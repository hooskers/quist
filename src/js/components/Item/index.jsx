import React from 'react';
// import PropTypes from 'prop-types';

const Item = ({ id, title, checked, onDelete }) => { //eslint-disable-line
  return (
    <div className="item">
      <span>{title}</span>
      <input type="checkbox" checked={checked} />
      <button aria-label="close" onClick={() => onDelete(id)}>❌</button>
    </div>
  );
};

// Item.propTypes = {

// }

export default Item;
