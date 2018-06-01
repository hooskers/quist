import { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

class ListFirestore extends Component {
  static propTypes = {
    list: PropTypes.object.isRequired, //eslint-disable-line
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
      list,
      database,
    } = this.props;

    const listDocRef = await database.collection('newLists').doc(list.id);
    const listDocSnapshot = await listDocRef.get();
    const listData = listDocSnapshot.data();

    this.setState({ listDocRef, list: { ...listData } }); //eslint-disable-line

    listDocRef.onSnapshot({ includeMetadataChanges: true }, this.updateStateFromDoc);
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
