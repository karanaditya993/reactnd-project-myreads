import React, { Component } from 'react'
import { PropTypes  }  from 'prop-types'

export default class BookResults extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
    };

    render()  {
        const { books } = this.props;

        return (
            <ol className="books-grid">
             {books.map((book) =>
                 <li key={book.id}>
                     <div className="book">
                         <div className="book-top">
                             <div className='book-cover'
                                  style={{backgroundImage: `url(${book.imageLinks.thumbnail})`}}>
                             </div>
                             <div className="book-shelf-changer">
                                 <select>
                                     <option value="move" disabled>Move to...</option>
                                    <option value="currentlyReading">Currently Reading</option>
                                    <option value="wantToRead">Want to Read</option>
                                    <option value="read">Read</option>
                                    <option value="none">None</option>
                                 </select>
                             </div>
                         </div>
                         <div className="book-title">{book.title}</div>
                         {book.authors && (<div className="book-authors">{book.authors[0]}</div>)}
                     </div>
                 </li>
             )}
         </ol>
        )
    }
}
