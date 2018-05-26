import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import Item from '../Item';

class List extends Component {
  static propTypes = {
    // TODO: Change `items` to Map?
    items: PropTypes.object.isRequired, // eslint-disable-line
    // items: PropTypes.arrayOf(PropTypes.shape({
    //   id: PropTypes.string,
    //   title: PropTypes.string,
    //   category: PropTypes.string,
    //   checked: PropTypes.bool,
    // })).isRequired,
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

    // this.props.onAddItem([
    //   ...this.props.items,
    //   {
    //     id: uuid(),
    //     title: this.state.newItemValue,
    //     category: '',
    //     checked: false,
    //   },
    // ]);

    this.state.newItemValue = '';
  };

  deleteItem = (id) => {
    this.props.onDeleteItem(id);
    // this.props.onDeleteItem([
    //   ...this.props.items.filter(item => item.id !== id),
    // ]);
  }

  newItemChange = (e) => {
    e.preventDefault();
    this.setState({ newItemValue: e.target.value });
  }

  render() {
    console.log(this.props);
    // console.log(this.props.items);
    return (
      <div>
        {this.props.title}
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
        {Array.from(this.props.items.entries()).map((kv) => {
          const id = kv[0];
          const item = kv[1];
          return <Item key={id} id={id} title={item.title} onDelete={this.deleteItem} />;
        })}
        {/* {this.props.items.map(item => (
          <Item key={item.id} id={item.id} title={item.title} onDelete={this.deleteItem} />
        ))} */}
        <br />
      </div>
    );
  }
}

export default List;
