import React, { PropTypes } from 'react';

import {Nav} from '~/common/components';

import styles from './App.css';


const App = props => (

    <div className={styles.wrapper}>
      <Nav></Nav>
      {props.children}
    </div>

);

App.propTypes = {
  children: PropTypes.element,
};

export default App;
