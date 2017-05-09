import React from 'react';

import styles from './DataField.css';

class DataField extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
            <div className={styles.field}>
            <div className={styles.fieldTitle}>{this.props.name}</div>
            <div className={  ( this.props.size == "s" ) ? styles.fieldValueSmall : styles.fieldValue }>{this.props.value}</div>
            { this.props.insight &&
              (<div className={(this.props.insight.state === "positive") ? styles.fieldInsightPositive : styles.fieldInsightNegative}>{this.props.insight.desc}</div>)
            }


            </div>
      )
  }

};

export default DataField;
