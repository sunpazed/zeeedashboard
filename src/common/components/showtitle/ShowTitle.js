import React from 'react';
import { Link } from 'react-router';

import {
  Helpers
} from '~/common/components';


import { CHANNELS, CATEGORIES } from '~/common/config';
import styles from './ShowTitle.css';

class ShowTitle extends React.Component {

  constructor(props) {
    super(props);

  }


  componentDidMount() {


  }

  componentWillReceiveProps(newProps){


  }



  render() {

    let helper = new Helpers;

    let thisprogram = this.props.program;
    let program = (<div/>);

    if (this.props.program.title) {

        var contentinfo = this.props.program.contentinfo;

        let progStartTimeDate = new Date(this.props.program.starttime*1000);
        let progEndTimeDate = new Date(this.props.program.endtime*1000);
        let progStartTime = helper.formatTimeHS(progStartTimeDate);
        let progEndTime =  helper.formatTimeHS(progEndTimeDate);
        let progDay = helper.formatDate(this.props.program.starttime);

        let category = "";

        program = (
              <div className={styles.program} key={this.props.program.eventid}>
              <div className={styles.times}>{progStartTime} - {progEndTime}</div>
              <div className={styles.day}>{progDay}</div>
                <div className={styles.title}>{this.props.program.title}</div>
                <div className={styles.description}>{this.props.program.description}</div>
                <div className={styles.contentinfo}>{ CATEGORIES.map(item => { if (contentinfo.match(new RegExp(item.filter,'gi'))) return item.name; }) }</div>

              </div>

            )

    }


    return (
      <div>{program}</div>
    );

  }



}

export default ShowTitle;
