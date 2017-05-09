import React from 'react';
import qr from 'qr-image';

import styles from './QR.css';

class QR extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const svg_string = qr.imageSync(this.props.value, { type: 'svg' });

    return (
      <div className={styles.wrapper} >
        <div dangerouslySetInnerHTML={{ __html: svg_string }} />
      </div>
    );
  }
}

export default QR;
