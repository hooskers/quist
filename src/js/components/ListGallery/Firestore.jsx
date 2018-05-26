import { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import database from '../../firebase';

class ListGalleryFirestore extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  state = {
    ownLists: [],
    sharedLists: [],
  }

  async componentDidMount() {
    const {
      userId,
    } = this.props;

    console.log(`userId: ${userId}`);

    try {
      const ownListsSnapshot = await database.collection('newLists')
        .where('owner', '==', userId).get();

      const ownLists = [];

      ownListsSnapshot.forEach(async (doc) => {
        // console.log(doc.id);
        // const itemsCollection = await database.collection(`/newLists/${doc.id}/items`);
        // const itemsSnapshot = await itemsCollection.get();
        // itemsSnapshot.forEach((itemDoc) => {
        //   console.log(itemDoc.data());
        // });
        // TODO: Can the `items` object be updated WITHOUT a transaction??
        // const docData = await doc.data();
        ownLists.push(doc.ref);
        // console.log(new Map(Object.entries(docData.items)).get('test'));
        // doc.ref.update('items.test.checked', true);
      });

      this.setState({ ownLists }); // eslint-disable-line
    } catch (e) {
      console.error(e);
    }


    // const userDocRef = await database.collection('users').doc(userId);

    // const user = await userDocRef.get();
    // const userData = await user.data();
    // this.setState({ //eslint-disable-line
    //   ownLists: userData.ownLists,
    //   sharedLists: userData.sharedLists,
    // });

    // userDocRef.onSnapshot(this.updateStateFromDoc);
  }

  updateStateFromDoc = async (doc) => {
    const userData = await doc.data();

    this.setState({
      ownLists: userData.ownLists,
      sharedLists: userData.sharedLists,
    });
  }

  addListDocument = (items, name) => {
    const listId = uuid();

    database.collection('lists').doc(listId).set({
      items, // array
      name, // string
      owner: this.props.userId, // string
      sharedUsers: [],
    })
      .then(async () => {
        const userRef = await database.collection('users').doc(this.props.userId);
        database.runTransaction(transaction => (
          transaction.get(userRef).then(async (userDoc) => {
            if (!userDoc.exists) {
              throw new Error(`User doc for ID: (${this.props.userId}) does not exist`);
            }

            const userData = await userDoc.data();
            const newOwnLists = [
              ...userData.ownLists,
              database.doc(`lists/${listId}`),
            ];

            transaction.update(userRef, { ownLists: newOwnLists });
          })
        ));
      })
      .catch((error) => {
        throw new Error(`Error writing document: ${error}`);
      });
  }

  deleteListDocument = (listId) => {
    database.collection('lists').doc(listId).delete().then(async () => {
      const userRef = await database.collection('users').doc(this.props.userId);
      database.runTransaction(transaction => (
        transaction.get(userRef).then(async (userDoc) => {
          if (!userDoc.exists) {
            throw new Error(`User doc for ID: (${this.props.userId}) does not exist`);
          }

          const userData = await userDoc.data();
          // const newOwnLists = [
          //   ...userData.ownLists,
          //   database.doc(`lists/${listId}`),
          // ];

          const newOwnLists = userData.ownLists.filter(list => list.id !== listId);

          transaction.update(userRef, { ownLists: newOwnLists });
        })
      ));
    });
  }

  render() {
    return (
      this.props.children(
        this.state.ownLists,
        this.state.sharedLists,
        this.addListDocument,
        this.deleteListDocument,
      )
    );
  }
}

export default ListGalleryFirestore;
