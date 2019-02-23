import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './App.css';

import SearchBar from './components/SearchBar'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      valueSended: ''
    };
    
    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchBarChange(e) {
    let regex = /[^\w\s\-_,.;:()]+/g;
    let value = e.target.value.replace(regex, "");
    this.setState({
      searchValue: value
    });
  }

  handleSearchSubmit() {
    if (this.state.searchValue === this.state.valueSended) return;
    console.log("Sending \"" + this.state.searchValue + "\" to the API...");
    this.setState({
      valueSended: this.state.searchValue
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
              />
            </Col>
          </Row>
          <Row>
            <h1>Book List</h1>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
