import React from 'react';
import { Row, Col } from 'reactstrap';
import BookCard from './BookCard/';

const BookList = (props) => {
    let books = [];
    for (let i = 0; i < props.books.length; i++) {
        let volumeInfo = props.books[i].volumeInfo;
        let thumbnail = (volumeInfo.imageLinks) ? volumeInfo.imageLinks.thumbnail : "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
        let title = volumeInfo.title;
        let author = (volumeInfo.authors !== undefined) ? volumeInfo.authors[0] : "Unknown";
        let publisher = (volumeInfo.publisher) ? volumeInfo.publisher : "Unknown";
        let link = volumeInfo.infoLink;
        books.push(<Col xs="12" lg="6" key={i}>
            <BookCard 
                image={thumbnail}
                title={title}
                author={author}
                publisher={publisher}
                link={link}
            />
        </Col>);
    }
    return <Row style={{marginBottom: 50}}>
        {books}
    </Row>
};

export default BookList;