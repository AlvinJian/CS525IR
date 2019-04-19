import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap'
import { Input, InputGroup, InputGroupAddon  } from 'reactstrap';
import ProductList from  './ProductList.js'
import './ProductSearch.css'

export default class ProductSearch extends Component {
    constructor(props) {
        super(props)
        this.searchProduct = this.searchProduct.bind(this)
        this.setDataView = this.setDataView.bind(this)

        this.searchBoxId = "100"
        this.dataView = null
        this.pageManager = props.mgr
    }

    searchProduct(event) {
        let term = document.getElementById(this.searchBoxId).value
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
            <div>
                <Jumbotron fluid className="Jumbo">
                    <Container fluid>
                        <h1 className="Jumbo"> Amazon Product Review Search </h1>
                    </Container>
                </Jumbotron>
                <Container>
                    <Row>
                        <Col lg="3"/>
                        <Col lg="6">
                            <InputGroup className="searchbar">
                                <Input id={this.searchBoxId} 
                                    placeholder="product keyword"
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            this.searchProduct(event);
                                        }
                                    }} />
                                <InputGroupAddon addonType="append">
                                    <Button color="primary"
                                            onClick={this.searchProduct} >
                                        Search Product
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col lg="3"/>
                    </Row>
                    <Row>
                        <Col lg="3"/>
                        <Col lg="6">
                            <ProductList dataSource={this} mgr={this.pageManager}/>
                        </Col>
                        <Col lg="3"/>
                    </Row>
                </Container>
            </div>
        );
    }
}