import React from 'react';
import { Link } from 'react-router';
import styles from './Error.css';

const Error = () => (
  <div className={styles.error}>
    <div className={styles.heading}>Oops.</div>
    <div className={styles.copy}>This is not the page you are looking for!</div>
  </div>
);

export default Error;
