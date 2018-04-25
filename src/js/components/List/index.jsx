import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentReference from 'firebase/firestore';

class List extends Component {
  static propTypes = {
    listDocument: PropTypes.instanceOf(DocumentReference.constructor).isRequired,
  };

  state = {
    items: [],
    newItemValue: '',
  }

  async componentDidMount() {
    const {
      listDocument,
    } = this.props;

    const list = await listDocument.get();
    const listData = await list.data();
    this.setState({ //eslint-disable-line
      items: listData.items,
    });

    listDocument.onSnapshot(this.setItemsOnState);
  }

  setItemsOnState = async (doc) => {
    const listData = await doc.data();

    this.setState({
      items: listData.items,
    });
  }

  addItem = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: This update needs to be a db.transaction()
    this.props.listDocument.update({
      items: [
        ...this.state.items,
        {
          item: this.state.newItemValue,
          category: '',
          checked: false,
        },
      ],
    });
  }

  newItemChange = (e) => {
    e.preventDefault();
    this.setState({ newItemValue: e.target.value });
  }

  render() {
    if (!this.state.items.length) {
      return null;
    }

    return (
      <div>
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
        {this.state.items.map(item => <div key={item.item}>{item.item}</div>)}
        <br />
      </div>
    );
  }
}

export default List;
