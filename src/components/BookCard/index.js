import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

import './BookCard.css';

const BookCard = (props) => {
    return <Card className="book-card">
        <CardImg width={200} src={ props.image } />
        <CardBody>
          <CardTitle><b>{ props.title }</b></CardTitle>
          <CardText>
              By: { props.author }<br />
              Published by: { props.publisher }
          </CardText>
          <Button color="success" className="btn-lg" onClick={() => window.open(props.link, '_blank') }>See this Book</Button>
        </CardBody>
    </Card>;
};

export default BookCard;