import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentReference from 'firebase/firestore';

class List extends Component {
  static propTypes = {
    listDocument: PropTypes.instanceOf(DocumentReference.constructor).isRequired,
    db: PropTypes.object, //eslint-disable-line
  };

  state = {
    items: [],
    newItemValue: '',
    name: '',
  }

  async componentDidMount() {
    const {
      listDocument,
    } = this.props;

    const list = await listDocument.get();
    const listData = await list.data();
    this.setState({ //eslint-disable-line
      items: listData.items,
      name: listData.name,
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

    this.props.db.runTransaction(transaction => (
      transaction.get(this.props.listDocument).then((listDoc) => {
        if (!listDoc.exists) throw new Error('List doc does not exist');

        const listData = listDoc.data();
        const items = [
          ...listData.items,
          {
            item: this.state.newItemValue,
            category: '',
            checked: false,
          },
        ];

        transaction.update(this.props.listDocument, { items });
        return items;
      })
        .catch((err) => {
          throw new Error(err);
        })
    ));
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
        {this.state.name}
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
