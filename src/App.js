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
    books: {},
  };

  componentDidMount() {
      setTimeout(() => {
          BooksAPI.getAll().then((books) => {
              this.setState(() => ({
                  books: partitionBooks(books),
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
                        <BooksList books={this.state.books}></BooksList>
                        <div className="open-search">
                            <Link to='/search'>
                                <button>Add a book</button>
                            </Link>
                        </div>
                  </div>)}
          />
        <Route exact path='/search' render={({ history }) =>
            <SearchBooks onSearchClose={ () => {
                history.push('/');
            }}/>
        }/>
      </div>
    )
  }
}

export default BooksApp
