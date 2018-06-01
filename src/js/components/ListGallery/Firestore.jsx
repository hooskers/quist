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

    const ownListsQuery = await database.collection('newLists')
      .where('owner', '==', userId);

    const ownLists = [];

    const ownListsQuerySnapshot = await ownListsQuery.get();
    ownListsQuerySnapshot.forEach((doc) => {
      ownLists.push(doc.data());
    });

    this.setState({ ownLists }); // eslint-disable-line

    ownListsQuery.onSnapshot((querySnapshot) => {
      const newLists = [];
      querySnapshot.forEach((doc) => {
        newLists.push(doc.data());
      });
      this.setState( { ownLists: newLists }); //eslint-disable-line
    });
  }

  updateStateFromDoc = async (doc) => {
    const userData = await doc.data();

    this.setState({
      ownLists: userData.ownLists,
      sharedLists: userData.sharedLists,
    });
  }

  addListDocument = (items, title) => {
    const listId = uuid();

    database.collection('newLists').doc(listId).set({
      id: listId,
      items: {},
      title,
      owner: this.props.userId,
    }).catch((error) => {
      throw new Error(`Error writing document: ${error}`);
    });
  }

  deleteListDocument = (listId) => {
    database.collection('newLists').doc(listId).delete()
      .catch((error) => {
        throw new Error(`Error deleting document: ${error}`);
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
