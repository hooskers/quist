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

test('clicking unchecked box calls passed function and unchecks box', () => {
  const onCheckDummy = jest.fn();

  const { getByTitle } = render(
    <Item {...defaultProps} onCheck={onCheckDummy} />,
  );

  Simulate.change(getByTitle('Check off item'), { target: { checked: true } });

  expect(onCheckDummy).toHaveBeenCalledTimes(1);
  expect(onCheckDummy).toHaveBeenCalledWith(defaultProps.id);
});

test('clicking checked box calls passed function and unchecks box', () => {
  const onCheckDummy = jest.fn();

  const { getByTitle } = render(
    <Item {...defaultProps} checked={true} onCheck={onCheckDummy} />,
  );

  Simulate.change(getByTitle('Uncheck item'), { target: { checked: false } });

  expect(onCheckDummy).toHaveBeenCalledTimes(1);
  expect(onCheckDummy).toHaveBeenCalledWith(defaultProps.id);
});
