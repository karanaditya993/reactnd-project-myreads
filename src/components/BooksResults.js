import React, { Component } from 'react'
import { PropTypes  }  from 'prop-types'
import BookshelfArranger from './BookshelfArranger';
import ClipLoader from 'react-spinners/ClipLoader'

export default class BooksResults extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        updateBooks: PropTypes.func,
    };

    render()  {
        const { books, updateBooks } = this.props;

        return (
            <ol className="books-grid">
             {books.map((book) =>
                 <li key={book.id}>
                     <div className="book">
                         <div className="book-top">
                             <div className="book-cover"
                                  style={{backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail})`}}>
                                 {book.loading && (
                                     <div className="moving-book">
                                         <div className="moving-book-loader">
                                             <div className="sweet-loading">
                                                <ClipLoader
                                                    color={"#2e7c31"}
                                                    loading={book.loading}
                                                />
                                             </div>
                                         </div>
                                     </div>)}
                             </div>
                             <BookshelfArranger
                                 book={book}
                                 updateShelf={(shelf) => {
                                     updateBooks(book, shelf);
                                 }}
                             />
                         </div>
                         <div className="book-title">{book.title}</div>
                         {book.authors && (<div className="book-authors">{book.authors.map(author => (
                             <span key={author}>{author}</span>
                         ))}</div>)}
                     </div>
                 </li>
             )}
         </ol>
        )
    }
}
