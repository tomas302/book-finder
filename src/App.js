import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './App.css';

import { searchBooks } from './API';

import SearchBar from './components/SearchBar/';
import BookList from './components/BookList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: 'Waiting',
      books: [],
      searchValue: '',
      valueSended: ''
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
    if (this.state.searchValue === this.state.valueSended) return;
    console.log("Sending \"" + this.state.searchValue + "\" to the API...");
    searchBooks(this.state.searchValue).then(books => this.setState({ books: books, state: 'Loading' }));
    this.setState({
      valueSended: this.state.searchValue
    });
  }

  handleClearSearch() {
    this.setState({
      state: 'Waiting',
      books: [],
      searchValue: '',
      valueSended: ''
    });
  }

  render() {
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
            <BookList books={this.state.books} />
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
