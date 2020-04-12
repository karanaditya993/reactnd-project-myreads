import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { formatShelf, getShelves } from '../helpers/formatShelf';

const shelves = getShelves();

export default class BookshelfArranger extends Component {
    static propTypes = {
        book: PropTypes.object.isRequired,
        updateShelf: PropTypes.func,
    };

    changeShelf(event) {
        const shelf = event.target.value;
        this.props.updateShelf(shelf);
    }

    render() {
        const { book } = this.props;
        return (
            <div className="book-shelf-changer">
                <select
                    value={book.shelf || 'none'}
                    onChange={(event) => this.changeShelf(event)}>
                    <option value="move" disabled>Move to...</option>
                    {shelves.map((shelf) =>
                        (<option key={shelf} value={shelf}>{formatShelf(shelf)}</option>)
                    )}
              </select>
            </div>
        )
    }
}
