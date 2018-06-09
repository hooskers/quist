import { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

class ListFirestore extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired,
    database: PropTypes.object, //eslint-disable-line
    children: PropTypes.func.isRequired,
  }

  state = {
    list: {
      items: {},
      title: '',
    },
    listDocRef: undefined,
  }

  async componentDidMount() {
    const {
      listId,
      database,
    } = this.props;

    const listDocRef = await database.collection('newLists').doc(listId);
    const listDocSnapshot = await listDocRef.get();
    const listData = listDocSnapshot.data();

    this.setState({ listDocRef, list: { ...listData } }); //eslint-disable-line

    this.offSnapshot = listDocRef.onSnapshot(
      { includeMetadataChanges: true },
      this.updateStateFromDoc,
    );
  }

  componentWillUnmount() {
    // Stop listening to snapshot from Firestore
    if (this.offSnapshot) this.offSnapshot();
  }

  updateStateFromDoc = async (querySnapshot) => {
    const listData = await querySnapshot.data();

    // List was deleted
    if (listData === undefined) return;

    this.setState({
      list: { ...listData },
    });
  }

  addItem = (item) => {
    const itemIdPath = `items.${item.id}`;
    this.state.listDocRef.update({
      [itemIdPath]: {
        category: item.category,
        checked: item.checked,
        title: item.title,
      },
    });
  }

  deleteItem = (id) => {
    this.state.listDocRef.update({
      [`items.${id}`]: firebase.firestore.FieldValue.delete(),
    });
  }

  render() {
    return (
      this.props.children(this.state.list, this.addItem, this.deleteItem)
    );
  }
}

export default ListFirestore;
