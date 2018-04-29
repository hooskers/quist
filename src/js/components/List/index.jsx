import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Item from '../Item';

class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      item: PropTypes.string,
      category: PropTypes.string,
      checked: PropTypes.bool,
    })).isRequired,
    name: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: '',
  }

  addItem = (e) => {
    e.stopPropagation();
    e.preventDefault();

    return this.props.onAddItem([
      ...this.props.items,
      {
        item: this.state.newItemValue,
        category: '',
        checked: false,
      },
    ]);
  };

  // deleteItem = (e) => {

  // }

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
        {this.props.items.map(item => <Item key={item.item} item={item.item} />)}
        <br />
      </div>
    );
  }
}

export default List;
