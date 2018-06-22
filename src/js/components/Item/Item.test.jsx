import React from 'react';
import { render, fireEvent } from 'react-testing-library';
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
  const onDeleteDummy = jest
    .fn()
    .mockReturnValue(console.log('sadf'))
    .mockName('onDeleteDummy');

  const { getByText } = render(
    <Item {...defaultProps} onDelete={onDeleteDummy} />,
  );

  fireEvent(
    getByText('Delete'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(onDeleteDummy).toHaveBeenCalledTimes(1);
  expect(onDeleteDummy).toHaveBeenCalledWith(defaultProps.id);
});

test('clicking checkbox calls passed function', () => {
  const onCheckDummy = jest.fn().mockName('onCheckDummy');

  const { getByTitle } = render(
    <Item {...defaultProps} onCheck={onCheckDummy} />,
  );

  fireEvent(
    getByTitle('Check off item'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(onCheckDummy).toHaveBeenCalledTimes(1);
  expect(onCheckDummy).toHaveBeenCalledWith(defaultProps.id);
});
