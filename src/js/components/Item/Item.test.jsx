import React from 'react';
import { render, Simulate } from 'react-testing-library';
import 'jest-dom/extend-expect';

import Item from '../Item';

test('Item displays title', () => {
  const { container } = render(
    <Item id="test_id" title="Test item" checked={false} onDelete={() => {}} />,
  );

  expect(container.querySelector('.item > span')).toHaveTextContent(
    'Test item',
  );
});

test('clicking delete button calls passed function', () => {
  const onDeleteDummy = jest.fn();

  const { getByText } = render(
    <Item
      id="test_id"
      title="Test item"
      checked={false}
      onDelete={onDeleteDummy}
    />,
  );

  Simulate.click(getByText('Delete'));

  expect(onDeleteDummy).toHaveBeenCalledTimes(1);
  expect(onDeleteDummy).toHaveBeenCalledWith('test_id');
});

test.skip('clicking checkbox calls passed function', () => {});
