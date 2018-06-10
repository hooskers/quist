/* eslint-env node */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ListGallery from '../src/js/components/ListGallery/ListGallery';
import { generateLists } from './utils';

storiesOf('ListGallery', module)
  .add('initial state', () => (
    <ListGallery
      ownLists={[]}
      sharedLists={[]}
      onAddList={action('clicked')}
      onDeleteList={action('clicked')}
    />
  ))
  .add('with lists', () => (
    <ListGallery
      ownLists={generateLists(2)}
      sharedLists={generateLists(3)}
      onAddList={action('clicked')}
      onDeleteList={action('clicked')}
    />
  ));
