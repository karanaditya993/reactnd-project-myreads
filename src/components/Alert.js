import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { PropTypes } from 'prop-types'

 toast.configure();

export default class Alert extends Component {
    static propTypes = {
        updatedBook: PropTypes.object,
    };
    componentDidMount() {
        toast(`${this.props.updatedBook.title || 'Your book'} has been updated in your library!`);
    }
    render() {
        return (
            <div>
                <ToastContainer />
            </div>
        )
    }
}
