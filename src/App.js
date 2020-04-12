import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBooks from './components/SearchBooks'
import BooksList from './components/BooksList'
import LoadingScreen from './components/LoadingScreen'
import { Route, Link } from 'react-router-dom'
import Alert  from './components/Alert'

const loadingText = 'Loading your books...';

class BooksApp extends React.Component {
  state = {
      showLoadingScreen: true,
      books: [],
      showAlert: false,
      updatedBookTitle: ''
  };

  setMovingBook(book) {
      this.setState({
          books: this.state.books.map((b) => {
              if (b.id === book.id) {
                  b.loading = true;
              }
              return b;
          }),
      });
  }

  async getShelvedBook(bookId) {
      return await BooksAPI.get(bookId).then((book) => {
          return Promise.resolve(book);
      });
  }

  async addBooksToShelves(book, shelvedBookIds) {
      if (shelvedBookIds.indexOf(book.id) > -1) {
          return await this.getShelvedBook(book.id).then((shelf) => {
              book.shelf = shelf;
              return Promise.resolve(book.shelf);
          });
      } else {
          return Promise.resolve(book);
      }
  }

  async searchResultsFindShelves(books, shelvedBookIds) {
      return await Promise.all(books.map((book) => {
          return this.addBooksToShelves(book, shelvedBookIds).then((book) => {
              return book;
          });
      }));
  }

  updateBooks(book, shelf, loadNewBooks) {
      BooksAPI.update(book, shelf).then(() => {
          this.setState({
               showAlert: true,
               updatedBookTitle: book.title
          });
          if (loadNewBooks) {
              BooksAPI.get(book.id).then((updatedBook) => {
                  this.setState({
                      books: this.state.books.map((book) => {
                          if (book.id === updatedBook.id) {
                              book.shelf = updatedBook.shelf;
                              if (book.loading) {
                                  book.loading = false;
                              }
                          }
                          return book;
                      }),
                  });
              });
          }
      });
  }

  searchBooks(query, callback) {
      const shelvedBookIds = this.state.books.map(book => book.id);
      setTimeout(() => {
          BooksAPI.search(query).then((books) => {
              let isEmpty =(books && books.items && books.items.length === 0 && books.error) || !books;
              this.searchResultsFindShelves(books, shelvedBookIds).then((booksWithShelves) => {
                  const searchedBooks = isEmpty ? [] : booksWithShelves;
                  callback(searchedBooks);
              });
          })
      }, 500);
  }

  componentDidMount() {
      setTimeout(() => {
          BooksAPI.getAll().then((books) => {
              this.setState({
                  books: books,
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
                            books={this.state.books}
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
                books={this.state.books}
                onSearchClose={ () => {
                    history.push('/');
                }}
                onSearch={ (query, callback) => { this.searchBooks(query, callback) }}
                updateBooks={ (book, shelf) => {
                    this.setState({
                        showAlert: false,
                    });
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
