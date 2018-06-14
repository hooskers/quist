import React from 'react';

const state = {
  database: undefined,
};

const FirestoreContext = React.createContext(state.database);

export default FirestoreContext;
