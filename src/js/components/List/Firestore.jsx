import { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentReference from 'firebase/firestore';

class ListFirestore extends Component {
  static propTypes = {
    listDocRef: PropTypes.instanceOf(DocumentReference.constructor).isRequired,
    database: PropTypes.object, //eslint-disable-line
    children: PropTypes.func.isRequired,
  }

  state = {
    items: [],
    name: '',
  }

  async componentDidMount() {
    const {
      listDocRef,
    } = this.props;

    const list = await listDocRef.get();
    const listData = await list.data();
    this.setState({ //eslint-disable-line
      items: listData.items,
      name: listData.name,
    });

    listDocRef.onSnapshot(this.updateStateFromDoc);
  }

  updateStateFromDoc = async (doc) => {
    const listData = await doc.data();

    this.setState({
      items: listData.items,
      name: listData.name,
    });
  }

  runTransaction = (items) => {
    const {
      database,
      listDocRef,
    } = this.props;

    database.runTransaction(transaction => (
      transaction.get(listDocRef).then((listDoc) => {
        if (!listDoc.exists) {
          throw new Error('List doc does not exist');
        }

        transaction.update(listDocRef, { items });
        return items;
      })
        .catch((err) => {
          throw new Error(err);
        })
    ));
  }

  render() {
    return (
      this.props.children(this.state, this.runTransaction)
    );
  }
}

export default ListFirestore;
