import React, { Component } from 'react';
import ProductSearch from './components/ProductSearch'
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            appState: 0,
            selctedProduct: null
        };
    }

    changePage(pgId, data) {
        if (pgId === 0) {
            this.setState({
                appState: pgId,
                selctedProduct: null
            });
        } else if (pgId === 1) {
            this.setState({
                appState: pgId,
                selctedProduct: data
            });
        }
    }

    render() {
        if (this.state.appState === 0) {
            // render product search page
            return (
                <div>
                    <ProductSearch mgr={this}/>
                </div>
            );
        }
    }
}

export default App;
