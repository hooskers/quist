import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Item from '../Item';

class List extends Component {
  static propTypes = {
    // TODO: Change `items` to Map?
    items: PropTypes.object.isRequired, // eslint-disable-line
    title: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: '',
  }

  addItem = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onAddItem({
      id: uuid(),
      title: this.state.newItemValue,
      category: '',
      checked: false,
    });

    this.state.newItemValue = '';
  };

  deleteItem = (id) => {
    this.props.onDeleteItem(id);
  }

  newItemChange = (e) => {
    e.preventDefault();
    this.setState({ newItemValue: e.target.value });
  }

  render() {
    return (
      <div>
        <span>{this.props.title}</span>
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
        {Object.entries(this.props.items).map((kv) => {
          const id = kv[0];
          const item = kv[1];
          return <Item key={id} id={id} title={item.title} onDelete={this.deleteItem} />;
        })}
        <br />
      </div>
    );
  }
}

export default List;
