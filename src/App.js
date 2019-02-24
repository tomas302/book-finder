import React, { Component } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import './App.css';

import { searchBooks } from './API';

import SearchBar from './components/SearchBar/';
import BookList from './components/BookList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waitingForApi: false,
      books: [],
      searchValue: '',
      valueSended: '',
      error: ''
    };
    
    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
  }

  handleSearchBarChange(e) {
    let regex = /[^\w\s\-_,.;:()]+/g;
    let value = e.target.value.replace(regex, "");
    this.setState({
      searchValue: value
    });
  }

  handleSearchSubmit() {
    // if the same value was already requested from the API, no need to call it back
    if (this.state.searchValue === this.state.valueSended || this.state.waitingForApi) return;
    if (this.state.searchValue === '') {
      this.setState({
        valueSended: '',
        waitingForApi: false
      });
      return;
    }
    if (this.state.error !== '') {
      this.setState({ error: '' });
    }
    this.setState({
      valueSended: this.state.searchValue,
      waitingForApi: true
    });
    searchBooks(this.state.searchValue).then(books => {
      if (!this.state.waitingForApi) {
        return;
      }
      this.setState({ books: books, waitingForApi: false })
    }).catch(error => {
      if (!this.state.waitingForApi) {
        return;
      }
      this.setState({ error: error, waitingForApi: false, valueSended: '' });
    });
    setTimeout(() => {
      if (this.state.waitingForApi) {
        this.setState({ waitingForApi: false, error: 'Timed out', valueSended: '' });
      }
    }, 5000);
  }

  handleClearSearch() {
    this.setState({
      waitingForApi: false,
      books: [],
      searchValue: '',
      valueSended: '',
      error: ''
    });
  }

  render() {
    let contents;
    if (this.state.error !== '') {
      let error = "There was an error";
      if (this.state.error === 'Timed out') error = "Error: cannot reach the server"; 
      contents = <Col xs="12"><Alert color="danger"><h3>{error}</h3></Alert></Col>;
    } else if (this.state.waitingForApi) {
      contents = <Col xs="12"><Alert color="secondary"><h3><i class="fas fa-spinner"></i> Loading...</h3></Alert></Col>;
    } else if (this.state.books.length === 0) {
      if (this.state.valueSended !== '') {
        contents = <Col xs="12"><Alert color="warning"><h3>Nothing found</h3></Alert></Col>;
      } else {
        contents = <Col xs="12"><Alert color="primary"><h3>Type something</h3></Alert></Col>;
      }
    } else {
      contents = <BookList books={this.state.books} />;
    }
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <h1>BOOK FINDER</h1>
            </Col>
          </Row>
          <Row>
            <Col xs="12" md={{ size: 10, offset: 1 }}>
              <SearchBar
                value={this.state.searchValue}
                onChangeHandle={this.handleSearchBarChange}
                onSearchHandle={this.handleSearchSubmit}
                clearHandle={this.handleClearSearch}
              />
            </Col>
          </Row>
          <Row>
            { contents }
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
