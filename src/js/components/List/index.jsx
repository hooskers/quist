import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Item from '../Item';

class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      category: PropTypes.string,
      checked: PropTypes.bool,
    })).isRequired,
    name: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: '',
  }

  addItem = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onAddItem([
      ...this.props.items,
      {
        id: uuid(),
        title: this.state.newItemValue,
        category: '',
        checked: false,
      },
    ]);

    this.state.newItemValue = '';
  };

  deleteItem = (id) => {
    this.props.onDeleteItem([
      ...this.props.items.filter(item => item.id !== id),
    ]);
  }

  newItemChange = (e) => {
    e.preventDefault();
    this.setState({ newItemValue: e.target.value });
  }

  render() {
    if (!this.props.items.length) {
      return null;
    }

    return (
      <div>
        {this.props.name}
        <form
          onSubmit={this.addItem}
        >
          <input
            placeholder="Add item"
            onChange={this.newItemChange}
            value={this.state.newItemValue}
          />
          <input type="submit" value="submit" />
        </form>
        {this.props.items.map(item => (
          <Item key={item.id} id={item.id} title={item.title} onDelete={this.deleteItem} />
        ))}
        <br />
      </div>
    );
  }
}

export default List;
