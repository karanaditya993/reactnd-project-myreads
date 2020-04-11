import React, { Component } from 'react'
import { availableSearchTerms } from '../availableSearchTerms'
import BooksResults from "./BooksResults";

export default class SearchBooks  extends Component {
    state = {
        searchTerm: '',
        showNoResults: true,
        showEasterEgg: false,
    };

    checkForEasterEgg(value) {
        if (value.toLowerCase() === 'something else') {
            this.setState({
                showEasterEgg: true,
            })
        } else {
            this.setState({
                showEasterEgg: false,
            })
        }
    }

    searchTermChanged(event) {
        this.setState({
            searchTerm: event.target.value,
        });

        this.checkForEasterEgg(event.target.value);

        if (availableSearchTerms.indexOf(event.target.value.trim().toLowerCase()) > -1) {
            this.props.onSearch(event.target.value.trim().toLowerCase());
            this.setState({
                showNoResults: false,
            })
        } else {
            this.setState({
                showNoResults: true,
            });
        }
    }
    render() {
        const { books, onSearchClose, } = this.props;
        return (
             <div className="search-books">
                <div className="search-books-bar">
                  <button className="close-search" onClick={ () => onSearchClose() }>Close</button>
                  <div className="search-books-input-wrapper">
                      <input type="text" placeholder="Search for books by title"
                             value={this.state.searchTerm}
                             onChange={(event) => this.searchTermChanged(event)}
                      />
                  </div>
                </div>
                 <div className="search-books-results">
                     {!this.state.showNoResults && (
                         <BooksResults books={books} />
                     )}
                 </div>
                 {this.state.showNoResults && (
                     <div className="no-search-results">
                         {!this.state.showEasterEgg && 'Sorry, there are no results for your search term. Try something else!'}
                         {this.state.showEasterEgg && 'Haha, very funny. But really, trying searching for something like "Drama", or "Photography"'}
                     </div>
                 )}
             </div>
         )
    }
}
