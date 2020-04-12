import React, { Component } from 'react'
import { PropTypes  }  from 'prop-types'
import { formatShelf } from '../helpers/formatShelf.js'
import BooksResults from './BooksResults.js'

export default class BooksList extends Component {
    static propTypes = {
        books: PropTypes.object.isRequired,
        updateBooks: PropTypes.func,
    };

    render() {
        const { books, updateBooks } = this.props;

        return(
            <div className="list-books">
                <div className="list-books-title">
                    My {new Date().getFullYear()} Reading Library
                </div>
                <div className="list-books-content">
                    {Object.keys(books).map(shelf =>
                        <div key={shelf} className="bookshelf">
                            <h2 className="bookshelf-title">{formatShelf(shelf)}</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    <BooksResults
                                        books={books[shelf]}
                                        updateBooks={(book, shelf) => {
                                            updateBooks(book, shelf);
                                        }}
                                    />
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
