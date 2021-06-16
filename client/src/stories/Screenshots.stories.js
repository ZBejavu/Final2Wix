import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
let screenshots = [];
try {
  const modules = require.context('../screenshots', true);
  screenshots = modules.keys()
} catch(e) { console.log(e) }
// import screenshots from '../screenshots';
const list = ['one', 'two'];
screenshots.forEach(key => {
  const screenshot = require(`../screenshots${key.slice(1)}`);
  storiesOf('Screenshots', module)
  .add(`${key}`, () => <img alt={key} src={screenshot} />)
})

