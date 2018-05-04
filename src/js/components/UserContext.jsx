import React from 'react';

const state = {
  userId: undefined,
};

const UserContext = React.createContext(state.userId);

export default UserContext;
