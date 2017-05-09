import React from 'react';
import { Link } from 'react-router';
import styles from './Nav.css';

class Nav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

      return (
        <div className={styles.navcontainer}>
            <Link className={styles.channel} to="/">Overview</Link>
            <Link className={styles.channel} to="/customers">Customers</Link>
            <Link className={styles.channel} to="/team">Team</Link>
        </div>
      )
  }

}

export default Nav;
