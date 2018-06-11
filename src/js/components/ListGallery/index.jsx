import React from 'react';

import ListGallery from './ListGallery';
import ListGalleryFirestore from './Firestore';
import UserContext from '../UserContext';

const ComposedComponent = () => (
  <UserContext.Consumer>
    {userId => (
      <ListGalleryFirestore userId={userId}>
        {(ownLists, sharedLists, addList, deleteList) => (
          <ListGallery
            ownLists={ownLists}
            sharedLists={sharedLists}
            onAddList={addList}
            onDeleteList={deleteList}
          />
        )}
      </ListGalleryFirestore>
    )}
  </UserContext.Consumer>
);

export default ComposedComponent;
