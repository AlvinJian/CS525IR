import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import { Input, InputGroup, InputGroupAddon  } from 'reactstrap';
import { Button } from 'reactstrap'
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardTitle, CardText, CardDeck,
    CardHeader, CardBody } from 'reactstrap';
import ProductReview from './ProductReview'
import predictButton from './PredictButton'
import './ProductView.css'
import DrawPredictButton from './PredictButton';

export default class ProductView extends Component {
    constructor(props) {
        super(props);

        this.theProduct = props.product
        this.pageManager = props.mgr
        this.searchBoxId = "200"
        this.state = {
            productInfo: null
        };

        this.setDataView = this.setDataView.bind(this)
        this.drawLabels = this.drawLabels.bind(this)
        this.drawLabelSection = this.drawLabelSection.bind(this)
        this.drawReviewInput = this.drawReviewInput.bind(this)
        this.drawReviewSearchBar = this.drawReviewSearchBar.bind(this)
        this.backToProductSearch = this.backToProductSearch.bind(this)
        this.searchReview = this.searchReview.bind(this)
        this.getPredictScore = this.getPredictScore.bind(this)

        let cmd = `api/getProductInfo/${this.theProduct.id}`
        fetch(cmd).then(resp => resp.json())
            .then(data => {
                this.setState({
                    productInfo: data
                });
            });

        this.dataView = null
    }

    setDataView(dataView) {
        this.dataView = dataView
    }

    drawLabels(labels, clr) {
        return (
            labels.map(
                (lbl, i) => {
                    return (
                        <Badge color={clr} key={i} className="label">
                            {lbl}
                        </Badge>
                    )
                }
            )
        )
    }

    drawLabelSection() {
        return (
            <CardDeck className="labelDeck">
                <Card>
                    <CardHeader>Popular Words</CardHeader>
                    <CardBody>
                        <CardText>
                            <div className="label">
                                { this.drawLabels(this.state.productInfo.labels, "success") }
                            </div>
                        </CardText>
                    </CardBody>
                </Card>
            </CardDeck>
        )
    }

    async getPredictScore() {
        let text = document.getElementById("userReview").value
        text = text.trim()
        if (text.length < 1) return -1
        const partUrl = `api/predictScore/${this.theProduct.id}`
        const theBody = `{"text": "${text}"}`
        const request = new Request(partUrl, {method: 'POST', body: theBody})
        const data = await fetch(request).then(resp => resp.json())
        // console.log(data)
        return data.score
    }

    drawReviewInput() {
        return(
            <div className="userInput">
                <div className="userComment">Your Comments:</div>
                <textarea id="userReview" className="inputReview"/>
                <Container>
                    <Row>
                        <Col lg="2" />
                        <Col lg="8">
                            {/* <Button className="predictButton" 
                                color="primary"
                                onClick={this.getPredictScore}>
                                Predict Rating
                            </Button> */}
                            <DrawPredictButton calcScore={this.getPredictScore} />
                        </Col>
                        <Col lg="2" />
                    </Row>
                </Container>
            </div>
        )
    }

    drawReviewSearchBar() {
        return(
            <InputGroup className="searchbar">
                <Input id={this.searchBoxId}
                    placeholder="search review"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            this.searchReview(event);
                        }
                    }} />
                <InputGroupAddon addonType="append">
                    <Button color="primary"
                            onClick={this.searchReview} >
                        Search Review
                    </Button>
                    <Button color="info"
                            onClick={(event) => {
                                if (this.dataView && this.state.productInfo) {
                                    this.dataView.setData(this.state.productInfo.topReviews)
                                }
                            }} >
                        Top Reviews
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        )
    }

    backToProductSearch() {
        this.pageManager.changePage(0, null)
    }

    searchReview(event) {
        // TODO
        let term = document.getElementById(this.searchBoxId).value
        console.log(term)
        let cmd = `api/searchReview/${this.theProduct.id}/${term}`
        fetch(cmd).then(resp => resp.json())
            .then(data => { 
                console.log(data)
                this.dataView.setData(data)
            })
    }

    render() {
        let condDraw = () => {
            if (this.state.productInfo) {
                let theViews = []
                theViews.push(
                    <Row>
                        <Col lg="2" />
                        <Col lg="8" >
                            { this.drawReviewInput() }
                        </Col>
                        <Col lg="2" />
                    </Row>
                )
                theViews.push(
                    <div>
                        <hr/>
                        <Row>
                            <Col lg="2" />
                            <Col lg="8" >
                                { this.drawLabelSection() }
                            </Col>
                            <Col lg="2" />
                        </Row>
                    </div>
                )
                theViews.push(
                    <Row>
                        <Col lg="2"/>
                        <Col lg="8">
                            {this.drawReviewSearchBar()}
                        </Col>
                        <Col lg="2"/>
                    </Row>
                )
                theViews.push(
                    <Row>
                        <Col lg="1" />
                        <Col lg="10">
                            <ProductReview 
                                reviews={this.state.productInfo.topReviews}
                                dataSource={this} />
                        </Col>
                        <Col lg="1" />
                    </Row>
                )
                return theViews
            } else {
                return (<Row><p>loading...</p></Row>)
            }
        }

        return (
            <div>
                <Button color="secondary"
                    className="backToSearch"
                    onClick={this.backToProductSearch}>
                    Back to Product Search
                </Button>
                <Jumbotron fluid className="Jumbo">
                    <Container>
                        <h1 className="Jumbo">{this.theProduct.name}</h1>
                    </Container>
                </Jumbotron>
                <Container>
                    {condDraw()}
                </Container>
            </div>
        )
    }
}