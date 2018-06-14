import React from 'react';
import { render, Simulate } from 'react-testing-library';
import Item from '../Item';

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
