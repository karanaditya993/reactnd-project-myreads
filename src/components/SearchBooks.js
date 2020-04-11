import React, { Component } from 'react'
import { availableSearchTerms } from '../availableSearchTerms'
import BooksResults from './BooksResults';
import LoadingScreen from './LoadingScreen';

export default class SearchBooks  extends Component {
    state = {
        searchTerm: '',
        showNoResults: true,
        showEasterEgg: false,
        loadingResults: false,
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

    setLoadingResults(hasSearchTerm) {
        if (!hasSearchTerm) {
            this.setState({
                loadingResults: false,
            });
        } else {
            this.setState({
                loadingResults: true,
            });
        }
    }

    onSearchChange(searchTerm) {
        const query = searchTerm.trim().toLowerCase();
        if (availableSearchTerms.indexOf(searchTerm.trim().toLowerCase()) > -1) {
             this.props.onSearch(query, (books) => {
                if (!books || !books.length) {
                    this.setState({
                        loadingResults: false,
                        showNoResults: true,
                    });
                } else {
                     this.setState({
                        loadingResults: false,
                        showNoResults: false,
                    })
                }
            });
        } else {
            this.setState({
                loadingResults: false,
                showNoResults: true,
            });
        }
    }

    searchTermChanged(event) {
        this.setLoadingResults(event.target.value.length);
        this.setState({ searchTerm: event.target.value });
        this.checkForEasterEgg(event.target.value);
        this.onSearchChange(event.target.value);
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
                     {!this.state.showNoResults &&
                        !this.state.loadingResults &&
                     (
                         <BooksResults books={books} />
                     )}
                 </div>
                 {this.state.showNoResults &&
                     !this.state.loadingResults &&
                 (
                     <div className="no-search-results">
                         {!this.state.showEasterEgg && 'Sorry, there are no results for your search term. Try something else!'}
                         {this.state.showEasterEgg && 'Haha, very funny. But really, trying searching for something like "Drama", or "Photography"'}
                     </div>
                 )}
                 <LoadingScreen isLoading={this.state.loadingResults}/>
             </div>
         )
    }
}
