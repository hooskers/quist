import { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import firebase from 'firebase';

class ListGalleryFirestore extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    database: PropTypes.instanceOf(firebase.firestore.Firestore).isRequired,
  };

  state = {
    ownLists: [],
    sharedLists: [],
  };

  async componentDidMount() {
    const { userId, database } = this.props;

    // Get lists owned by user
    const ownListsQuery = await database
      .collection('lists')
      .where('owner', '==', userId);

    let ownLists = [];

    const ownListsQuerySnapshot = await ownListsQuery.get();
    ownListsQuerySnapshot.forEach(doc => {
      let list = doc.data();
      ownLists.push({ ...list, items: this.itemsToArray(list.items) });
    });

    // Get lists shared with users
    const sharedListsQuery = await database
      .collection('lists')
      .where(`sharedUsers.${userId}`, '==', true);

    let sharedLists = [];

    const sharedListsQuerySnapshot = await sharedListsQuery.get();
    sharedListsQuerySnapshot.forEach(doc => {
      let list = doc.data();
      sharedLists.push({ ...list, items: this.itemsToArray(list.items) });
    });

    this.setState({ ownLists, sharedLists });

    // Watch user's lists for updates
    this.offOwnListsSnapshot = ownListsQuery.onSnapshot(
      { includeQueryMetadataChanges: true },
      this.updateOwnListsFromSnapshot,
    );

    // Watch user's shared lists for updates
    this.offSharedListsSnapshot = sharedListsQuery.onSnapshot(
      { includeQueryMetadataChanges: true },
      this.updateSharedListsFromSnapshot,
    );
  }

  componentWillUnmount() {
    // Stop listening to snapshot from Firestore
    if (this.offOwnListsSnapshot) this.offOwnListsSnapshot();
    if (this.offSharedListsSnapshot) this.offSharedListsSnapshot();
  }

  itemsToArray = items => {
    return Object.entries(items).map(kv => {
      return { ...kv[1], id: kv[0] };
    });
  };

  updateOwnListsFromSnapshot = async querySnapshot => {
    const ownLists = querySnapshot.docs.map(doc => {
      const list = doc.data();
      return { ...list, items: this.itemsToArray(list.items) };
    });

    this.setState({ ownLists });
  };

  updateSharedListsFromSnapshot = async querySnapshot => {
    const sharedLists = querySnapshot.docs.map(doc => {
      const list = doc.data();
      return { ...list, items: this.itemsToArray(list.items) };
    });

    this.setState({ sharedLists });
  };

  // updateStateFromDoc = async querySnapshot => {
  //   debugger; // eslint-disable-line
  //   const userData = await querySnapshot.data();
  //   console.log(userData); //eslint-disable-line

  //   // this.setState({
  //   //   ownLists: userData.ownLists.map(list => ({
  //   //     ...list,
  //   //     items: this.itemsToArray(list.items),
  //   //   })),
  //   //   sharedLists: userData.sharedLists.map(list => ({
  //   //     ...list,
  //   //     items: this.itemsToArray(list.items),
  //   //   })),
  //   // });
  // };

  addListDocument = (items, title) => {
    const listId = uuid();

    this.database
      .collection('lists')
      .doc(listId)
      .set({
        id: listId,
        items: {},
        title,
        owner: this.props.userId,
      })
      .catch(error => {
        throw new Error(`Error writing document: ${error}`);
      });
  };

  deleteListDocument = listId => {
    this.database
      .collection('lists')
      .doc(listId)
      .delete()
      .catch(error => {
        throw new Error(`Error deleting document: ${error}`);
      });
  };

  render() {
    return this.props.children(
      this.state.ownLists,
      this.state.sharedLists,
      this.addListDocument,
      this.deleteListDocument,
    );
  }
}

export default ListGalleryFirestore;
