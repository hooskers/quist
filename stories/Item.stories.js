/* eslint-env node */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Item from '../src/js/components/Item';

storiesOf('Item', module)
  .add('initial state', () => (
    <Item
      id={'testID'}
      title={'This is a list item'}
      checked={false}
      onDelete={action('clicked')}
    />
  ))
  .add('checked', () => (
    <Item
      id={'testID'}
      title={'This is a checked list item'}
      checked={true}
      onDelete={action('clicked')}
    />
  ));
