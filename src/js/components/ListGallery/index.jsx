import React, { Component } from 'react';
import PropTypes from 'prop-types';
import database from '../../firebase';

import Firestore from '../List/Firestore';
import List from '../List';

class ListGallery extends Component {
  static propTypes = {
    ownLists: PropTypes.array.isRequired, //eslint-disable-line
    sharedLists: PropTypes.array.isRequired, //eslint-disable-line
    onAddList: PropTypes.func.isRequired,
  }

  state = {
    newListValue: '',
  }

  newListChange = (e) => {
    e.preventDefault();
    this.setState({ newListValue: e.target.value });
  }

  addList = (e) => {
    e.preventDefault();
    this.props.onAddList([], this.state.newListValue);
    this.setState({ newListValue: '' });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.addList}
        >
          <input
            placeholder="Add list"
            onChange={this.newListChange}
            value={this.state.newListValue}
          />
          <input type="submit" value="submit" />
        </form>
        <h2>Your lists:</h2>
        {this.props.ownLists.map(list => (
          <Firestore key={list.id} listDocRef={list} database={database}>
            {(listData, runTransaction) => (
              <List
                items={listData.items}
                name={listData.name}
                onAddItem={runTransaction}
                onDeleteItem={runTransaction}
              />
            )}
          </Firestore>
        ))}
        <h2>Shared lists:</h2>
        {this.props.sharedLists.map(list => (
          <Firestore key={list.id} listDocRef={list} database={database}>
            {(listData, runTransaction) => (
              <List
                items={listData.items}
                name={listData.name}
                onAddItem={runTransaction}
                onDeleteItem={runTransaction}
              />
            )}
          </Firestore>
        ))}
      </div>
    );
  }
}

export default ListGallery;