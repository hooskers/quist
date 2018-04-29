import React from 'react';
// import PropTypes from 'prop-types';

const Item = ({ item, checked, onDelete }) => { //eslint-disable-line
  return (
    <div className="item">
      <span>{item}</span>
      <input type="checkbox" checked={checked} />
    </div>
  );
};

// Item.propTypes = {

// }

export default Item;
