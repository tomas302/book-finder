import React from 'react';
import { Row, Col } from 'reactstrap';
import BookCard from './BookCard/';

const BookList = (props) => {
    return <div>
        <Row>
            <Col sm="12" md="6"><BookCard /></Col>
            <Col sm="12" md="6"><BookCard /></Col>
        </Row>
    </div>
};

export default BookList;