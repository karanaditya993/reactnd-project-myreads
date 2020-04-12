import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { PropTypes } from 'prop-types'

 toast.configure();

export default class Alert extends Component {
    static propTypes = {
        updatedBookTitle: PropTypes.string,
    };
    componentDidMount() {
        toast(`${this.props.updatedBookTitle || 'Your book'} was successfully added to your library!`);
    }
    render() {
        return (
            <div>
                <ToastContainer />
            </div>
        )
    }
}
