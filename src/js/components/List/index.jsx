import React from 'react';

import List from './List';
import ListFirestore from './Firestore';
import database from '../../firebase';

export default (
  { id }, //eslint-disable-line
) => (
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
);
