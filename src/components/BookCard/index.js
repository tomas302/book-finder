import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

import './BookCard.css';

const BookCard = (props) => {
    return <Card className="book-card">
        <CardImg src={ props.image } />
        <CardBody>
          <CardTitle><b>{ props.title }</b></CardTitle>
          <CardText>
              By: { props.author }<br />
              Published by: { props.publisher }
          </CardText>
          <Button color="success" onClick={() => window.location.href = props.link}>See this Book</Button>
        </CardBody>
    </Card>;
};

export default BookCard;