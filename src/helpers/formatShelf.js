// https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text

export function formatShelf(shelf) {
    const result = shelf.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function getShelves() {
    return ['wantToRead', 'currentlyReading', 'read'];
}
