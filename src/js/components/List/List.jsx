import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Item from '../Item';

class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
      }),
    ),
    title: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: '',
  };

  addItem = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onAddItem({
      id: uuid(),
      title: this.state.newItemValue,
      category: '',
      checked: false,
    });

    this.setState({ newItemValue: '' });
  };

  deleteItem = id => {
    this.props.onDeleteItem(id);
  };

  newItemChange = e => {
    e.preventDefault();
    this.setState({ newItemValue: e.target.value });
  };

  render() {
    return (
      <div>
        <span>{this.props.title}</span>
        <form onSubmit={this.addItem}>
          <input
            placeholder="Add item"
            onChange={this.newItemChange}
            value={this.state.newItemValue}
          />
          <input type="submit" value="submit" />
        </form>
        <form>
          <input placeholder="Enter email to share with another user" />
          <input type="submit" value="submit" />
        </form>
        {this.props.items.map(item => (
          <Item
            key={item.id}
            id={item.id}
            title={item.title}
            checked={item.checked}
            onCheck={() => {
              // Need to make this change on the Firebase item
              console.log(
                'Change this function! Need to change the `checked` prop',
              );
            }}
            onDelete={this.deleteItem}
          />
        ))}
        <br />
      </div>
    );
  }
}

export default List;
