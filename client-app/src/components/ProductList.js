import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Button } from 'reactstrap'
import ProductSearch from './ProductSearch';

export default class ProductList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: null
        };

        this.setListData = this.setListData.bind(this);
        this.renderList = this.renderList.bind(this);
        this.onProductSelected = this.onProductSelected.bind(this)

        props.dataSource.setDataView(this);
        this.pageManager = props.mgr;
    }

    setListData(data) {
        this.setState({
            products: data
        });
    }

    onProductSelected(event) {
        console.log(event.currentTarget.textContent);
        console.log(event.currentTarget.id);
        let product = {
            id: event.currentTarget.id,
            name: event.currentTarget.textContent
        };
        console.log(product)
        this.pageManager.changePage(1, product);
    }

    renderList() {
        if (this.state.products == null) {
            console.log("nothing")
        } else {
            console.log(JSON.stringify(this.state.products));
            return this.state.products.map(
                (product, i) => {
                    return (<ListGroupItem
                                id={product.id}
                                key={i}
                                tag="button"
                                onClick={this.onProductSelected}>
                                {product.name}
                            </ListGroupItem>);
                }
            );
        }
    }

    render() {
        return(
            <ListGroup>
                {this.renderList()}
            </ListGroup>);
    }
} 