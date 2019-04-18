import React, { Component } from 'react';
import { Card, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody } from 'reactstrap';

export default class ProductReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theReviews: props.reviews
        }

        // this.defaultReviews = props.reviews
        props.dataSource.setDataView(this)

        this.renderReviews = this.renderReviews.bind(this)
        this.setData = this.setData.bind(this)
    }

    setData(reviews) {
        this.setState({
            theReviews: reviews
        })
    }

    renderReviews() {
        let progress = {
            theReviews: this.state.theReviews,
            count: 0
        };
        let drawDeck = () => {
            let drawCards = () => {
                let cards = []
                for (let i=0; i<5 && 
                        progress.count<progress.theReviews.length; ++i) {
                    cards.push(
                        <Card>
                            <CardBody>
                                <CardText>
                                    {progress.theReviews[progress.count].text}
                                </CardText>
                            </CardBody>
                        </Card>
                    )
                    ++progress.count
                }
                return cards
            }
            return (
                <CardDeck>
                    {drawCards()}
                </CardDeck>)
        }
        let drawAllCards = () => {
            let decks = []
            while (progress.count < progress.theReviews.length) {
                decks.push(drawDeck())
            }
            return decks
        }
        return drawAllCards()
    }

    render() {
        if (this.state.theReviews) {
            return(
                <div>
                    {this.renderReviews()}
                </div>)
        } else {
            return(<p> nothing yet </p>)
        }
    }
}