import React, { Component } from 'react';

export default class ProductView extends Component {
    constructor(props) {
        super(props);

        this.theProduct = props.product;
        this.state = {
            productInfo: null
        };

        let cmd = `api/getProductInfo/${this.theProduct.id}`
        fetch(cmd).then(resp => resp.json())
            .then(data => {
                this.setState({
                    productInfo: data
                });
            });
    }

    render() {
        if (this.state.productInfo != null) {
            return (
                <div>
                    <h1>{JSON.stringify(this.theProduct)}</h1>
                    <p>{JSON.stringify(this.state.productInfo)}</p>
                </div>
            );    
        } else {
            return (
                <div>
                    <h1>{JSON.stringify(this.theProduct)}</h1>
                    <p>loading...</p>
                </div>
            );
        }
    }
}