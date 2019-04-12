import React, { Component } from 'react';
import ProductSearch from './components/ProductSearch'
import ProductView from './components/ProductView'
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
        this.setState({
            appState: pgId,
            selctedProduct: data
        });
    }

    render() {
        if (this.state.appState === 0) {
            // render product search page
            return (
                <div>
                    <ProductSearch mgr={this}/>
                </div>
            );
        } else if (this.state.appState === 1) {
            return (
            <div>
                <ProductView product={this.state.selctedProduct} />
            </div>);
        }
    }
}

export default App;
