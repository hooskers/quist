import { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentReference from 'firebase/firestore';
import firebase from 'firebase';
// import database from '../../firebase';
// import firebase from 'firebase/firestore';

class ListFirestore extends Component {
  static propTypes = {
    listDocRef: PropTypes.instanceOf(DocumentReference.constructor).isRequired,
    database: PropTypes.object, //eslint-disable-line
    children: PropTypes.func.isRequired,
  }

  state = {
    items: new Map(),
    title: '',
  }

  async componentDidMount() {
    const {
      listDocRef,
    } = this.props;

    const list = await listDocRef.get();
    const listData = await list.data();

    console.log(listData.items);
    console.log(Object.entries(listData.items));

    this.setState({ //eslint-disable-line
      items: new Map(Object.entries(listData.items)),
      title: listData.title,
    });

    // listDocRef.onSnapshot({ includeMetadataChanges: true }, this.updateStateFromDoc);
  }

  updateStateFromDoc = async (querySnapshot) => {
    console.log(querySnapshot.metadata);
    console.log(querySnapshot.docChanges);
    const listData = await querySnapshot.data();

    // List was deleted
    if (listData === undefined) return;

    this.setState({
      items: listData.items,
      name: listData.name,
    });
  }

  addItem = (item) => {
    const itemIdPath = `items.${item.id}`;
    this.props.listDocRef.update({
      [itemIdPath]: {
        category: item.category,
        checked: item.checked,
        title: item.title,
      },
    });
  }

  deleteItem = (id) => {
    this.props.listDocRef.update({
      [`items.${id}`]: firebase.firestore.FieldValue.delete(),
    });
  }

  // runTransaction = (items) => {
  //   const {
  //     database,
  //     listDocRef,
  //   } = this.props;

  //   listDocRef.set({ items });

  //   // database.runTransaction(transaction => (
  //   //   transaction.get(listDocRef).then((listDoc) => {
  //   //     if (!listDoc.exists) {
  //   //       throw new Error('List doc does not exist');
  //   //     }

  //   //     transaction.update(listDocRef, { items });
  //   //     return items;
  //   //   })
  //   //     .catch((err) => {
  //   //       throw new Error(err);
  //   //     })
  //   // ));
  // }

  render() {
    return (
      this.props.children(this.state, this.addItem, this.deleteItem)
    );
  }
}

export default ListFirestore;
