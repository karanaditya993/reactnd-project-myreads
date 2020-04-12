/**
 * API data format: {
 *  shelf : [ 'wantToRead', 'currentlyReading', 'read' ]
 * }
 * */

export default function partitionBooks(books = []) {
    const partitionedBooks = {
        wantToRead: [],
        currentlyReading: [],
        read: [],
    };
    books.map((book) => {
        if (book.shelf && book.shelf !== 'none') {
            partitionedBooks[book.shelf].push(book)
        }
    });
    return partitionedBooks;
}
