import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBooks from './components/SearchBooks'
import BooksList from './components/BooksList'
import LoadingScreen from './components/LoadingScreen'
import partitionBooks from './helpers/partitionBooks'
import { Route, Link } from 'react-router-dom'
import Alert  from './components/Alert'

const loadingText = 'Loading your books...';

class BooksApp extends React.Component {
  state = {
      showLoadingScreen: true,
      partitionedBooks: {},
      rawBooks: [],
      showAlert: false,
      updatedBookTitle: ''
  };

  setMovingBook(book) {
      const newBooks = this.state.rawBooks.map((b) => {
          if (b.id === book.id) {
              b.loading = true;
          }
          return b;
      });
      this.loadBooks(newBooks);
  }

  loadBooks(books, options) {
      this.setState({
          rawBooks: books,
      });
      setTimeout(() => {
          this.setState(() => ({
              partitionedBooks: partitionBooks(this.state.rawBooks),
              ...options,
          }))
      }, 0)
  }

  updateBooks(book, shelf, loadNewBooks) {
      BooksAPI.update(book, shelf).then(() => {
          if (!loadNewBooks) {
               this.setState({
                   showAlert: true,
                   updatedBookTitle: book.title
              });
          }
          if (loadNewBooks) {
              BooksAPI.get(book.id).then((updatedBook) => {
                  const newBooks = this.state.rawBooks.map((book) => {
                      if (book.id === updatedBook.id) {
                          book.shelf = updatedBook.shelf;
                          if (book.loading) {
                              book.loading = false;
                          }
                      }
                      return book;
                  });
                  this.loadBooks(newBooks);
              });
          }
      });
  }

  searchBooks(query, callback) {
      setTimeout(() => {
          BooksAPI.search(query).then((books) => {
              let isEmpty =(books && books.items && books.items.length === 0 && books.error) || !books;
              this.setState({
                  rawBooks: isEmpty ? [] : books,
              });
              callback(books);
          })
      }, 500);
  }

  componentDidMount() {
      setTimeout(() => {
          BooksAPI.getAll().then((books) => {
              this.loadBooks(books, {
                  showLoadingScreen: false,
              });
          });
      }, 1000);
  }

  render() {
    return  (
      <div className="app">
          <Route exact path='/' render={() =>
              this.state.showLoadingScreen ? (<LoadingScreen isLoading={this.state.showLoadingScreen} text={loadingText}/>) :
                  (<div className="books-list-container">
                        <BooksList
                            books={this.state.partitionedBooks}
                            updateBooks={(book, shelf) => {
                                this.setMovingBook(book);
                                this.updateBooks(book, shelf, true)
                            }}
                        />
                        <div className="open-search">
                            <Link to='/search'>
                                <button style={{ 'cursor' : 'pointer' }}>Add a book</button>
                            </Link>
                        </div>
                  </div>)}
          />
        <Route exact path='/search' render={({ history }) =>
            <SearchBooks
                books={this.state.rawBooks}
                onSearchClose={ () => {
                    history.push('/');
                    this.setState(() => {});
                }}
                onSearch={ (query, callback) => { this.searchBooks(query, callback) }}
                updateBooks={ (book, shelf) => {
                    this.updateBooks(book, shelf);
                }}
            />
        }/>
        {this.state.showAlert && (
            <Alert updatedBook={this.state.updatedBookTitle}/>
        )}
      </div>
    )
  }
}

export default BooksApp
