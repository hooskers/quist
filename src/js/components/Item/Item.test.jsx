import React from 'react';
import { render, Simulate } from 'react-testing-library';
import 'jest-dom/extend-expect';

import Item from '../Item';

const defaultProps = {
  id: 'test_id',
  title: 'Test item',
  checked: false,
  onCheck: () => {},
  onDelete: () => {},
};

test('Item displays title', () => {
  const { container } = render(<Item {...defaultProps} />);

  expect(container.querySelector('.item > span')).toHaveTextContent(
    'Test item',
  );
});

test('clicking delete button calls passed function', () => {
  const onDeleteDummy = jest.fn();

  const { getByText } = render(
    <Item {...defaultProps} onDelete={onDeleteDummy} />,
  );

  Simulate.click(getByText('Delete'));

  expect(onDeleteDummy).toHaveBeenCalledTimes(1);
  expect(onDeleteDummy).toHaveBeenCalledWith(defaultProps.id);
});

test('clicking checkbox calls passed function', () => {
  const onCheckDummy = jest.fn();

  const { getByTitle, container } = render(
    <Item {...defaultProps} onCheck={onCheckDummy} />,
  );

  Simulate.click(getByTitle('Check off item'));

  expect(onCheckDummy).toHaveBeenCalledTimes(1);
  expect(onCheckDummy).toHaveBeenCalledWith(defaultProps.id);
  expect(container.querySelector('input[type="checkbox"]')).toHaveAttribute(
    'checked',
  );

  Simulate.click(getByTitle('Uncheck item'));

  expect(onCheckDummy).toHaveBeenCalledTimes(2);
  expect(onCheckDummy).toHaveBeenCalledWith(defaultProps.id);
  expect(container.querySelector('input[type="checkbox"]')).not.toHaveAttribute(
    'checked',
  );
});
