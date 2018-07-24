import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

const Item = ({ id, title, checked, onCheck, onDelete }) => {
  return (
    <div css={itemStyles(checked)} className="item">
      <span className="item-title">{title}</span>
      <input
        type="checkbox"
        className="item-checkbox"
        title={checked ? 'Uncheck item' : 'Check off item'}
        defaultChecked={checked}
        onChange={e => {
          e.stopPropagation();
          onCheck(id);
        }}
      />
      <button
        className="item-delete"
        aria-label="close"
        onClick={() => onDelete(id)}
      >
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

const itemStyles = checked => css`
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-top: 5px;
  padding-bottom: 5px;

  .item-title {
    margin-left: 7px;
    text-decoration: ${checked ? 'line-through' : 'unset'};
  }

  .item-delete {
    float: right;
  }

  input[type='checkbox'] {
    float: left;
  }
`;

export default Item;
