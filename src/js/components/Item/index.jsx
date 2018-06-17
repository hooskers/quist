import React from 'react';
import PropTypes from 'prop-types';

const Item = ({ id, title, checked, onCheck, onDelete }) => {
  return (
    <div className="item">
      <span>{title}</span>
      <input
        type="checkbox"
        title={checked ? 'Uncheck item' : 'Check off item'}
        defaultChecked={checked}
        onChange={() => {
          onCheck(id);
        }}
      />
      <button aria-label="close" onClick={() => onDelete(id)}>
        Delete
      </button>
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Item;
