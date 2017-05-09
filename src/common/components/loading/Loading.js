import React from 'react';
import { Link } from 'react-router';
import styles from './Loading.css';

const Loading = () => (
  <div className={styles.container}>
    <div className={styles.loader}>&nbsp;</div>
  </div>
);

export default Loading;
