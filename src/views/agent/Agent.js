import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { connect } from "react-redux";
import * as actions from '~/store/actions/ticketActions';

import {
  Container,
  Loading,
  Helpers
} from '~/common/components';

import styles from './Agent.css';

class Agent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(newProps) {
  }

  componentWillMount() {
    this.props.dispatch(actions.getAgentMetrics(this.props.params.agent));
  }

  componentWillUnmount() {
  }

  updateCaptions(payload) {
  }


  render () {

      let helper = new Helpers;

      let mean_resolve_time = helper.formatMinsToDHMS(this.props.agent.mean_resolve_time);

      let team_mean_resolve_time = helper.formatMinsToDHMS(this.props.agent.mean_resolve_time_team);

      let created_days = [];
      let solved_days = [];

      // render graph for created time series
      if (this.props.agent.tickets_created_over_time) {
          for (let [key,value] of this.props.agent.tickets_created_over_time) {
            created_days.push(<div>
                    <div>{key}</div><div>{value}</div>
                    </div>);
        };
      }

      // render graph for solved time series
      if (this.props.agent.tickets_solved_over_time) {
          for (let [key,value] of this.props.agent.tickets_solved_over_time) {
            solved_days.push(<div>
                    <div>{key}</div><div>{value}</div>
                    </div>);
        };
      }

      // chart: render histograms for busy days over the week
      // ----------------------------------
      let this_week = [];
      let day_of_week = {
        0:"Sun",
        1:"Mon",
        2:"Tue",
        3:"Wed",
        4:"Thu",
        5:"Fri",
        6:"Sat"
      }

      let this_day = [];        
      for (let hour in [0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]) {
              this_day.push(<div className={styles.histoDayCol}>{hour}h</div>);        
      }
      this_week.push(<div className={styles.histoWeek}><div className={styles.histoDayTitle}>&nbsp;</div>{this_day}</div>)

      if (this.props.agent.busy_times_over_week) {

            for (let day in [0,1,2,3,4,5,6]) {
              let this_day = [];
              this_day.push(<div className={styles.histoDayTitle}>{day_of_week[day]}</div>);
              for (let hour in [0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]) {
                if (this.props.agent.busy_times_over_week[day].get(hour)>0) {
                  let percentage = (this.props.agent.busy_times_over_week[day].get(hour)/this.props.agent.max_tickets_per_hour);
                  let this_style = {backgroundColor: `rgba(251, 69, 112,${percentage})`};
                  this_day.push(<div className={styles.histoDay} style={this_style}>{this.props.agent.busy_times_over_week[day].get(hour)}</div>)                  
                } else {
                  this_day.push(<div className={styles.histoDayBlank}>-</div>)                  
                }
              }
              this_week.push(<div className={styles.histoWeek}>{this_day}</div>)
            }
      }

      return (
        <div>
        <h1>Agent #{this.props.agent.agent_id}</h1>

        <div className={styles.containerFields}>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Tickets handled</div>
            <div className={styles.fieldValue}>{this.props.agent.number_of_tickets}</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Tickets Resolved</div>
            <div className={styles.fieldValue}>{this.props.agent.resolved_tickets}</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Tickets Closed</div>
            <div className={styles.fieldValue}>{this.props.agent.closed_tickets}</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Resolved/Closed on first reply</div>
            <div className={styles.fieldValue}>{
                                                 ((this.props.agent.resolved_on_first_reply / this.props.agent.number_of_tickets)*100).toFixed(1) 
                                               }%</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Time to first reply</div>
            <div className={styles.fieldValue}>{this.props.agent.mean_time_to_first_reply} mins</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Replies per ticket (mean)</div>
            <div className={styles.fieldValue}>{this.props.agent.mean_replies_per_ticket} replies</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Resolution time (median)</div>
            <div className={styles.fieldValue}>
            { mean_resolve_time.weeks > 0 &&
              <span styles={styles.fieldDuration}>{ mean_resolve_time.weeks }w </span>
            }

            { mean_resolve_time.days > 0 &&
              <span styles={styles.fieldDuration}>{ mean_resolve_time.days }d </span>
            }

            { mean_resolve_time.hours > 0 &&
              <span styles={styles.fieldDuration}>{ mean_resolve_time.hours }h </span>
            }

            { mean_resolve_time.minutes > 0 &&
              <span styles={styles.fieldDuration}>{ mean_resolve_time.minutes }m </span>
            }
            </div>
            <div className={styles.fieldInsight}>vs Team <span></span> 

            { team_mean_resolve_time.weeks > 0 &&
              <span>{ team_mean_resolve_time.weeks }w </span>
            }

            { team_mean_resolve_time.days > 0 &&
              <span>{ team_mean_resolve_time.days }d </span>
            }

            { team_mean_resolve_time.hours > 0 &&
              <span>{ team_mean_resolve_time.hours }h </span>
            }

            { team_mean_resolve_time.minutes > 0 &&
              <span>{ team_mean_resolve_time.minutes }m </span>
            }
            </div>
            </div>
        </div>


        <h2>Utilisation</h2>



        <div className={styles.containerViz}>        
            <div className={styles.fieldTitle}>Agents assigned tickets by day/hour</div>
            {this_week}
        </div>



        </div>
      )

    }

}

export default connect((store) => {
  return {
    agent: store.agent.agent,
  };
})(Agent);
