import React, { Component } from 'react'
import { PropTypes  }  from 'prop-types'
import { formatShelf } from '../helpers/formatShelf.js'
import partitionBooks from '../helpers/partitionBooks'
import BooksResults from './BooksResults.js'

export default class BooksList extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        updateBooks: PropTypes.func,
    };

    static getDerivedStateFromProps(props) {
        return {
            partitionedBooks: partitionBooks(props.books)
        }
    }

    state = {
        partitionedBooks: {},
    };

    componentDidMount() {
        this.setState({
            partitionedBooks: partitionBooks(this.props.books),
        });
    }

    render() {
        const { updateBooks } = this.props;
        const { partitionedBooks } = this.state;

        return(
            <div className="list-books">
                <div className="list-books-title">
                    My {new Date().getFullYear()} Reading Library
                </div>
                <div className="list-books-content">
                    {Object.keys(partitionedBooks).map(shelf =>
                        <div key={shelf} className="bookshelf">
                            <h2 className="bookshelf-title">{formatShelf(shelf)}</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    <BooksResults
                                        books={partitionedBooks[shelf]}
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
