import React from 'react';
import PropTypes from 'prop-types';

const Item = ({ id, title, checked, onDelete }) => {
  return (
    <div className="item">
      <span>{title}</span>
      <input type="checkbox" checked={checked} />
      <button aria-label="close" onClick={() => onDelete(id)}>
        ❌
      </button>
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Item;
