/* eslint-env node */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import List from '../src/js/components/List/List';
import { generateItems } from './utils';

storiesOf('List', module)
  .add('initial state', () => (
    <List
      items={{}}
      title={'List title'}
      onAddItem={action('clicked')}
      onDeleteItem={action('clicked')}
    />
  ))
  .add('with items', () => (
    <List
      items={generateItems(10)}
      title={'List title'}
      onAddItem={action('clicked')}
      onDeleteItem={action('clicked')}
    />
  ));
