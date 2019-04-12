import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import { Input, InputGroup, InputGroupAddon  } from 'reactstrap';
import { Button } from 'reactstrap'
import { Container, Row, Col } from 'reactstrap';
import ProductReview from './ProductReview'

export default class ProductView extends Component {
    constructor(props) {
        super(props);

        this.theProduct = props.product
        this.pageManager = props.mgr
        this.searchBoxId = "200"
        this.state = {
            productInfo: null
        };

        this.drawLabels = this.drawLabels.bind(this)
        this.backToProductSearch = this.backToProductSearch.bind(this)
        this.searchReview = this.searchReview.bind(this)

        let cmd = `api/getProductInfo/${this.theProduct.id}`
        fetch(cmd).then(resp => resp.json())
            .then(data => {
                this.setState({
                    productInfo: data
                });
            });
    }

    drawLabels() {
        return (
            this.state.productInfo.labels.map(
                (lbl, i) => {
                    return (<Badge color="success" key={i}>{lbl}</Badge>)
                }
            )
        )
    }

    backToProductSearch() {
        this.pageManager.changePage(0, null)
    }

    searchReview(term) {
        // TODO
        console.log(term)
    }

    render() {
        let condDraw = () => {
            if (this.state.productInfo) {
                let theViews = []
                theViews.push(
                    <Row>{this.drawLabels()}</Row>
                )
                theViews.push(
                    <Row>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <Button color="secondary"
                                        onClick={this.backToProductSearch}>
                                    Back to Product Search
                                </Button>
                            </InputGroupAddon>
                            <Input id={this.searchBoxId} 
                                placeholder="search review"
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        let term = document.getElementById(this.searchBoxId).value
                                        this.searchReview(term);
                                    }
                                }} />
                            <InputGroupAddon addonType="append">
                                <Button color="primary"
                                        onClick={this.searchProduct} >
                                    Search Review
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Row>
                )
                theViews.push(
                    <Row>
                        <ProductReview 
                            reviews={this.state.productInfo.topReviews} />
                    </Row>
                )
                return theViews
            } else {
                return (<Row><p>loading...</p></Row>)
            }
        }

        return (
            <Container>
                <Row>
                    <Jumbotron>
                        <h1>{this.theProduct.name}</h1>
                    </Jumbotron>
                </Row>
                {condDraw()}
            </Container>
        )
    }
}