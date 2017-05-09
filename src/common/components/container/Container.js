import React, { PropTypes } from 'react';

import styles from './Container.css';

const Container = props => (
  <div className={styles.container}>
    {props.children}
  </div>
);

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default Container;
