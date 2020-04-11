import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBooks from './components/SearchBooks'
import BooksList from './components/BooksList'
import LoadingScreen from './components/LoadingScreen'
import partitionBooks from './helpers/partitionBooks'
import { Route, Link } from 'react-router-dom'

const loadingText = 'Loading your books...';

class BooksApp extends React.Component {
  state = {
    showLoadingScreen: true,
    partitionedBooks: {},
    rawBooks: [],
  };

  componentDidMount() {
      setTimeout(() => {
          BooksAPI.getAll().then((books) => {
              this.setState(() => ({
                  partitionedBooks: partitionBooks(books),
                  showLoadingScreen: false,
              }))
          });
      }, 2000);
  }

  render() {
    return  (
      <div className="app">
          <Route exact path='/' render={() =>
              this.state.showLoadingScreen ? (<LoadingScreen isLoading={this.state.showLoadingScreen} text={loadingText}/>) :
                  (<div className="books-list-container">
                        <BooksList books={this.state.partitionedBooks}></BooksList>
                        <div className="open-search">
                            <Link to='/search'>
                                <button>Add a book</button>
                            </Link>
                        </div>
                  </div>)}
          />
        <Route exact path='/search' render={({ history }) =>
            <SearchBooks
                books={this.state.rawBooks}
                onSearchClose={ () => {
                    history.push('/');
                }}
                /* passing onSearch as a prop because I don't want to import BooksAPI into SearchBooks component */
                onSearch={ (query, callback) => {
                    setTimeout(() => {
                        BooksAPI.search(query).then((books) => {
                            let isEmpty =(books && books.items && books.items.length === 0 && books.error) || !books;
                            this.setState({
                                rawBooks: isEmpty ? [] : books,
                            });
                            callback(books);
                        })
                    }, 500);
                }}
            />
        }/>
      </div>
    )
  }
}

export default BooksApp
