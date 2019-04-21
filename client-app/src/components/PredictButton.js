import React, { useState } from 'react';
import { Button, Badge } from 'reactstrap'
import './PredictButton.css'

export default function DrawPredictButton(props) {
    const [score, setScore] = useState("-")
    const calc = props.calcScore
    const calcScore = async () => {
        setScore("calc...")
        const score_ = await calc()
        if (score_ < 0) setScore("-")
        else setScore(score_)
    }
    return (
        <Button className="predictButton" 
            color="primary"
            onClick={calcScore}>
            Predict Rating :
            <Badge className="predictRating">{score}</Badge>
        </Button>
    )
}