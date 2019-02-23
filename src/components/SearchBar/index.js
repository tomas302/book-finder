import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import "./SearchBar.css";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onSearchHandle();
        }
    }

    render() {
        return <InputGroup>
            <Input value={this.props.value} onKeyPress={this.handleKeyPress} onChange={this.props.onChangeHandle} placeholder="Search by book title or author..." />
            <InputGroupAddon addonType="append">
                <Button onClick={this.props.onSearchHandle} className="search-bar-button" color="success">Search</Button>
            </InputGroupAddon>
            <InputGroupAddon addonType="append" style={{ width: "0px" }}>
                <Button onClick={this.props.clearHandle} className="search-bar-cross" close />
            </InputGroupAddon>
        </InputGroup>;
    }
}

export default SearchBar;