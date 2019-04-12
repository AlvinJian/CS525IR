import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap'
import { Input, InputGroup, InputGroupAddon  } from 'reactstrap';
import ProductList from  './ProductList.js'

export default class ProductSearch extends Component {
    constructor(props) {
        super(props)
        this.searchProduct = this.searchProduct.bind(this)
        this.setDataView = this.setDataView.bind(this)

        this.searchBoxId = "100"
        this.dataView = null
        this.pageManager = props.mgr
    }

    searchProduct(term) {
        let cmd = `api/searchProduct/${term}`
        fetch(cmd)
            .then(resp => resp.json())
            .then(data => {
                if (this.dataView) {
                    this.dataView.setListData(data)
                }
            });
    }

    setDataView(view) {
        this.dataView = view
    }

    render() {
        return(
            <Container>
                <Row>
                    <InputGroup>
                        <Input id={this.searchBoxId} 
                            placeholder="product keyword"
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    let elem = document.getElementById(this.searchBoxId);
                                    this.searchProduct(elem.value);
                                }
                            }} />
                        <InputGroupAddon addonType="append">
                            <Button color="primary"
                                    onClick={this.searchProduct} >
                                Search Product
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Row>
                <Row>
                    <ProductList dataSource={this} mgr={this.pageManager}/>
                </Row>
            </Container>
        );
    }
}