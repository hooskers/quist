import { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

class ListFirestore extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired,
    database: PropTypes.instanceOf(firebase.firestore.Firestore),
    children: PropTypes.func.isRequired,
  };

  state = {
    list: {
      items: [],
      title: '',
    },
    listDocRef: undefined,
  };

  async componentDidMount() {
    const { listId, database } = this.props;

    const listDocRef = await database.collection('lists').doc(listId);
    const listDocSnapshot = await listDocRef.get();
    const listData = listDocSnapshot.data();

    this.setState({
      listDocRef,
      list: { ...listData, items: this.itemsToArray(listData.items) },
    });

    this.offSnapshot = listDocRef.onSnapshot(
      { includeMetadataChanges: true },
      this.updateStateFromDoc,
    );
  }

  componentWillUnmount() {
    // Stop listening to snapshot from Firestore
    if (this.offSnapshot) this.offSnapshot();
  }

  itemsToArray = items => {
    return Object.entries(items).map(kv => {
      return { ...kv[1], id: kv[0] };
    });
  };

  updateStateFromDoc = async querySnapshot => {
    const listData = await querySnapshot.data();

    // List was deleted
    if (listData === undefined) return;

    this.setState({
      list: { ...listData, items: this.itemsToArray(listData.items) },
    });
  };

  addItem = item => {
    const itemIdPath = `items.${item.id}`;
    this.state.listDocRef.update({
      [itemIdPath]: {
        category: item.category,
        checked: item.checked,
        title: item.title,
      },
    });
  };

  deleteItem = id => {
    this.state.listDocRef.update({
      [`items.${id}`]: firebase.firestore.FieldValue.delete(),
    });
  };

  render() {
    return this.props.children(this.state.list, this.addItem, this.deleteItem);
  }
}

export default ListFirestore;
