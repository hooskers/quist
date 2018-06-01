import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import database from '../../firebase';

import Firestore from '../List/Firestore';
import List from '../List';

class ListGallery extends Component {
  static propTypes = {
    ownLists: PropTypes.array.isRequired, //eslint-disable-line
    sharedLists: PropTypes.array.isRequired, //eslint-disable-line
    onAddList: PropTypes.func.isRequired,
    onDeleteList: PropTypes.func.isRequired,
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

  deleteList = listId => () => this.props.onDeleteList(listId);

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
          <Firestore key={list.id} list={list} database={database}>
            {(listData, addItem, deleteItem) => (
              <Fragment>
                <span>{listData.title}</span>
                <button onClick={this.deleteList(list.id)}>Delete list</button>
                <List
                  items={listData.items}
                  title={listData.title}
                  onAddItem={addItem}
                  onDeleteItem={deleteItem}
                />
              </Fragment>
            )}
          </Firestore>
        ))}
        <h2>Shared lists:</h2>
        {this.props.sharedLists.map(list => (
          <Firestore key={list.id} listDocRef={list} database={database}>
            {(listData, addItem, deleteItem) => (
              <List
                items={listData.items}
                name={listData.name}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
              />
            )}
          </Firestore>
        ))}
      </div>
    );
  }
}

export default ListGallery;
