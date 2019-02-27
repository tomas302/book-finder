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

    // with the format: "mostRecentQuery/query2/olderQuery"
    if (localStorage.getItem('last10Queries') === null)
      localStorage.setItem('last10Queries', "");
    
    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.addNewQuery = this.addNewQuery.bind(this);
    this.handlePastQueryClick = this.handlePastQueryClick.bind(this);
  }

  handleSearchBarChange(e) {
    let regex = /[^\w\s\-_,.;:()]+/g;
    let value = e.target.value.replace(regex, "");
    this.setState({
      searchValue: value
    });
  }

  handleSearchSubmit(searchVal) {
    let searchValue = (searchVal !== undefined) ? searchVal : this.state.searchValue;
    // if the same value was already requested from the API, no need to call it back
    if (searchValue === this.state.valueSended || this.state.waitingForApi) return;
    if (searchValue === '') {
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
      valueSended: searchValue,
      waitingForApi: true
    });
    searchBooks(searchValue).then(books => {
      if (!this.state.waitingForApi) {
        return;
      }
      this.addNewQuery();
      this.setState({ books: books, waitingForApi: false })
      if (this.currentTimeout) clearTimeout(this.currentTimeout);
    }).catch(error => {
      if (!this.state.waitingForApi) {
        return;
      }
      this.setState({ error: error, waitingForApi: false, valueSended: '' });
      if (this.currentTimeout) clearTimeout(this.currentTimeout);
    });
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
    this.currentTimeout = setTimeout(() => {
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

  // method for handling adding to the last 10 queries list
  addNewQuery() {
    let last10Queries = localStorage.getItem('last10Queries').split("/");
    // we check if the query already exists in the list, if it does, we remove it from its current index and position it in the first place
    let alreadyExistent = (query, i) => {
      if (query === this.state.valueSended) {
        let regex = /[^\w\s\-_,.;:()]+/g;
        query = query.replace(regex, "");
        last10Queries.splice(i, 1);
        last10Queries.unshift(query);
        localStorage.setItem('last10Queries', last10Queries.join("/").replace(/[/]$/, ""));
        return true;
      }
      return false;
    };
    if (last10Queries.some(alreadyExistent)) return;
    // if it doesn't, we make space if needed, we added to the beggining and we save it
    if (last10Queries.length === 10)
      last10Queries.pop();
    last10Queries.unshift(this.state.valueSended);
    localStorage.setItem('last10Queries', last10Queries.join("/").replace(/[/]$/, ""));
  }

  handlePastQueryClick(index) {
    let regex = /[^\w\s\-_,.;:()]+/g;
    let queryClicked = localStorage.getItem('last10Queries').split("/")[index].replace(regex, "");
    this.setState({
      searchValue: queryClicked
    });
    this.handleSearchSubmit(queryClicked);
  }

  render() {
    let contents;
    if (this.state.error !== '') {
      let error = "There was an error";
      if (this.state.error === 'Timed out') error = "Error: cannot reach the server";
      contents = <Col xs="12"><Alert color="danger"><h3>{error}</h3></Alert></Col>;
    } else if (this.state.waitingForApi) {
      contents = <Col xs="12"><Alert color="secondary"><h3><i className="fas fa-spinner"></i> Loading...</h3></Alert></Col>;
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
                handlePastQueryClick={this.handlePastQueryClick}
              />
            </Col>
          </Row>
          <Row>
            {contents}
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
