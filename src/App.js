import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBooks from './components/SearchBooks'
import BooksList from './components/BooksList'
import LoadingScreen from './components/LoadingScreen'
import { Route, Link } from 'react-router-dom'
import Alert  from './components/Alert'
import debounce from './helpers/debounce'

const loadingText = 'Loading your books...';

class BooksApp extends React.Component {
  state = {
      showLoadingScreen: true,
      books: [],
      showAlert: false,
      updatedBook: {}
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

  hideAlert() {
      this.setState({
          showAlert: false,
      });
  }

  showAlert() {
      this.setState({
          showAlert: true,
      })
  }

  getNewBooks(updatedBook) {
      const newBooks = this.state.books.map((book) => {
          if (book.id === updatedBook.id) {
              book.shelf = updatedBook.shelf;
              if (book.loading) {
                  book.loading = false;
              }
          }
          return book;
      });
      if (newBooks.map(item => item.id).indexOf(updatedBook.id) === -1) {
          newBooks.push(updatedBook);
      }
      return newBooks;
  }

  updateBooks(book, shelf) {
      this.showAlert();
      this.setState({
          updatedBook: book,
      });
      BooksAPI.update(book, shelf).then(() => {
          BooksAPI.get(book.id).then((updatedBook) => {
              const newBooks = this.getNewBooks(updatedBook);
              this.setState({
                  books: newBooks,
              });
              setTimeout(() => {
                  this.hideAlert();
              }, 2000)
          });
      });
  }

  searchBooks(query, callback) {
      const shelvedBookIds = this.state.books.map(book => book.id);
      setTimeout(() => {
          BooksAPI.search(query).then((books) => {
              let isEmpty =(books && books.items && books.items.length === 0 && books.error) || !books;
              if (!isEmpty) {
                  this.searchResultsFindShelves(books, shelvedBookIds).then((booksWithShelves) => {
                      const searchedBooks = isEmpty ? [] : booksWithShelves;
                      callback(searchedBooks);
                  });
              } else {
                  callback([]);
              }
          });
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
                                this.updateBooks(book, shelf);
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
                onSearch={ (query, callback) => {
                    debounce(this.searchBooks(query, callback), 1000);
                }}
                updateBooks={ (book, shelf) => {
                    this.updateBooks(book, shelf);
                }}
            />
        }/>
        {this.state.showAlert && (
            <Alert updatedBook={this.state.updatedBook}/>
        )}
      </div>
    )
  }
}

export default BooksApp
