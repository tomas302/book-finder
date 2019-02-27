// Detect clicks outside a React component from -> https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./SearchBar.css";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            pastQuerySelected: -1,
            last10Queries: localStorage.getItem("last10Queries").split("/")
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handlePastQueryClick = this.handlePastQueryClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.getLastQueries = this.getLastQueries.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleKeyDown = (e) => {
        let lastQueries, notNull;
        switch(e.key) {
            case('Enter'):
                if (this.state.pastQuerySelected !== -1) {
                    this.handlePastQueryClick(this.state.pastQuerySelected);
                } else {
                    this.props.onSearchHandle();
                    this.setState({ focused: false });
                }
                break;
            case('ArrowDown'):
                e.preventDefault();
                lastQueries = this.getLastQueries(false);
                notNull = lastQueries.reduce((array, q, index) => {
                    if (q !== null)
                        return array += ((array.length !== 0) ? "/" : "") + index;
                    return array;
                }, "");
                notNull = notNull.split("/").map(el => +el);
                if (this.state.pastQuerySelected === -1 || this.state.pastQuerySelected === notNull[notNull.length - 1])
                    this.setState({ pastQuerySelected: notNull[0] });
                else {
                    let newQuery = this.state.pastQuerySelected + 1;
                    for (let i = 0; i < lastQueries.length; i++) {
                        if (newQuery === lastQueries.length) {
                            newQuery = 0;
                        }
                        if (notNull.includes(newQuery)) {
                            break;
                        }
                        newQuery++;
                    }
                    this.setState({ pastQuerySelected: newQuery });
                }
                break;
            case('ArrowUp'):
                e.preventDefault();
                lastQueries = this.getLastQueries(false);
                notNull = lastQueries.reduce((array, q, index) => {
                    if (q !== null)
                        return array += ((array.length !== 0) ? "/" : "") + index;
                    return array;
                }, "");
                notNull = notNull.split("/").map(el => +el);
                if (this.state.pastQuerySelected === -1)
                    this.setState({ pastQuerySelected: notNull[0] });
                else if(this.state.pastQuerySelected === 0)
                    this.setState({ pastQuerySelected: notNull[notNull.length - 1] });
                else {
                    let newQuery = this.state.pastQuerySelected - 1;
                    for (let i = 0; i < lastQueries.length; i++) {
                        if (newQuery === -1) {
                            newQuery = lastQueries.length - 1;
                        }
                        if (notNull.includes(newQuery)) {
                            break;
                        }
                        newQuery--;
                    }
                    this.setState({ pastQuerySelected: newQuery });
                }
                break;
            default:
                if (this.state.pastQuerySelected !== -1) this.setState({ pastQuerySelected: -1 });
                break;
        }
    }

    handlePastQueryClick(index) {
        this.props.handlePastQueryClick(index);
        this.setState({ focused: false });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.state.focused) this.setState({ focused: false });
        } else {
            if (!this.state.focused) this.setState({ focused: true });
        }
    }

    getLastQueries(dropdown) {
        let last10Queries = localStorage.getItem("last10Queries").split("/");
        for (let i = 0; i < last10Queries.length; i++) {
            if (this.props.value === "" || last10Queries[i].includes(this.props.value)) {
                if (i === this.state.pastQuerySelected) {
                    if (dropdown)
                        last10Queries[i] = <DropdownItem active onClick={() => this.handlePastQueryClick(i)} key={i}>{last10Queries[i]}</DropdownItem>;
                } else {
                    if (dropdown)
                        last10Queries[i] = <DropdownItem onClick={() => this.handlePastQueryClick(i)} key={i}>{last10Queries[i]}</DropdownItem>;
                }
            } else {
                last10Queries[i] = null;
            }
        }
        return last10Queries;
    }
    render() {
        let last10Queries = this.getLastQueries(true);
        return <div ref={this.setWrapperRef}>
            <InputGroup>
                <Input className="search-bar-input" value={this.props.value} onKeyDown={this.handleKeyDown} onChange={this.props.onChangeHandle} placeholder="Search by book title or author..." />
                <InputGroupAddon addonType="append" className="search-bar-cross">
                    <Button onClick={this.props.clearHandle} close />
                </InputGroupAddon>
                <InputGroupAddon addonType="append">
                    <Button onClick={this.props.onSearchHandle} className="search-bar-button" color="success">Search</Button>
                </InputGroupAddon>
            </InputGroup>

            <Dropdown isOpen={this.state.focused} toggle={() => { }} >
                <DropdownToggle style={{ display: "none" }} />
                <DropdownMenu className="search-dropdown">
                    {last10Queries}
                </DropdownMenu>
            </Dropdown>
        </div>;
    }
}

export default SearchBar;