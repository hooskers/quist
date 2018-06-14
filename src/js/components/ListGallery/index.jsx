import React from 'react';

import ListGallery from './ListGallery';
import ListGalleryFirestore from './Firestore';
import UserContext from '../UserContext';
import FirestoreContext from '../FirestoreContext';

const ComposedComponent = () => (
  <UserContext.Consumer>
    {userId => (
      <FirestoreContext.Consumer>
        {database => (
          <ListGalleryFirestore userId={userId} database={database}>
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
      </FirestoreContext.Consumer>
    )}
  </UserContext.Consumer>
);

export default ComposedComponent;
