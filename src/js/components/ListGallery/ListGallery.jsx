import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

class ListGallery extends Component {
  static propTypes = {
    ownLists: PropTypes.array.isRequired, //eslint-disable-line
    sharedLists: PropTypes.array.isRequired, //eslint-disable-line
    onAddList: PropTypes.func.isRequired,
    onDeleteList: PropTypes.func.isRequired,
  };

  state = {
    newListValue: '',
  };

  newListChange = e => {
    e.preventDefault();
    this.setState({ newListValue: e.target.value });
  };

  addList = e => {
    e.preventDefault();
    this.props.onAddList([], this.state.newListValue);
    this.setState({ newListValue: '' });
  };

  deleteList = listId => () => this.props.onDeleteList(listId);

  render() {
    return (
      <div>
        <form onSubmit={this.addList}>
          <input
            placeholder="Add list"
            onChange={this.newListChange}
            value={this.state.newListValue}
          />
          <input type="submit" value="submit" />
        </form>
        <h2>Your lists:</h2>
        {this.props.ownLists.map(list => (
          <Link key={list.id} to={`list/${list.id}`} list={list}>
            {list.title}
          </Link>
        ))}
        <h2>Shared lists:</h2>
        {this.props.sharedLists.map(list => (
          <Link key={list.id} to={`list/${list.id}`} list={list}>
            {list.title}
          </Link>
        ))}
      </div>
    );
  }
}

export default ListGallery;
