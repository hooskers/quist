import React from 'react';
import PropTypes from 'prop-types';

import List from './List';
import ListFirestore from './Firestore';
import database from '../../firebase';
import FirestoreContext from '../FirestoreContext';

const ComposedComponent = ({ id }) => (
  <FirestoreContext.Provider value={database}>
    <ListFirestore listId={id} database={database}>
      {(listData, addItem, deleteItem) => (
        <List
          items={listData.items}
          title={listData.title}
          onAddItem={addItem}
          onDeleteItem={deleteItem}
        />
      )}
    </ListFirestore>
  </FirestoreContext.Provider>
);

ComposedComponent.propTypes = {
  id: PropTypes.string.isRequired,
};

// Need this because I think Reach Router calls this component
// with no props and it throws a prop type error
ComposedComponent.defaultProps = {
  id: '',
};

export default ComposedComponent;
