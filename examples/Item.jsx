import React from 'react';
import Item from '../src/js/components/Item';

export default exampleProps => (
  <Item
    id={exampleProps.id}
    title={exampleProps.title}
    checked={exampleProps.checked}
    onDelete={exampleProps.onDelete}
  />
);
