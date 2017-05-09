import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { connect } from "react-redux";
import * as actions from '~/store/actions/ticketActions';

import {HorizontalBar, Bar, Line, Doughnut} from 'react-chartjs-2';

import {
  Container,
  Loading,
  Helpers,
  DataField
} from '~/common/components';


import styles from './Team.css';

class Team extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(actions.fetchTeam());
  }

  componentWillUnmount() {
  }

  updateCaptions(payload) {
  }

  render () {

    let team = [];

    if (this.props.team.team_list) {
      team = this.props.team.team_list.map(assignee_id => {
        return (<div className={styles.agent}><Link to={`/agent/${assignee_id}`}>id {assignee_id}</Link></div>);
      })
    }


      // chart: chart_top_agent_tickets_data
      // ----------------------------------
      let chart_top_agent_tickets_data = {};
      let chart_top_agent_tickets_options = {};

      if (this.props.team.top_agents_assigned_tickets) {

        let labels = [];
        let values = [];

        this.props.team.top_agents_assigned_tickets.forEach((v, k) => {
            labels.push(k);
            values.push(v);
        });
        

        chart_top_agent_tickets_data =  {
                        labels: labels,
                                datasets: [{
                            label: 'Tickets assigned',
                            data: values,
                            borderWidth: 1
                        }]
                    };          
            

        chart_top_agent_tickets_options = {
          scales: {
            yAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,0.0)"
                        }   
                    }]
                  }
              };

      }

      // chart: chart_top_agent_resolve_time
      // ----------------------------------
      let top_agents_resolve_time_data = {};
      let top_agents_resolve_time_options = {};

      if (this.props.team.top_agents_resolve_time) {

        let labels = [];
        let values = [];

        this.props.team.top_agents_resolve_time.forEach((v, k) => {
            labels.push(k);
            values.push((v/60/24).toFixed(1));
        });
        

        top_agents_resolve_time_data =  {
                        labels: labels,
                                datasets: [{
                            label: 'Time spent (days)',
                            data: values,
                            borderWidth: 1
                        }]
                    };          
            

        top_agents_resolve_time_options = {
          scales: {
            xAxes: [{
            ticks: {
                beginAtZero:true
            }
            }],
            yAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,0.0)"
                        }   
                    }]
                  }
              };

      }

      // chart: top_agents_happy_customers
      // ----------------------------------
      let top_agents_happy_customers_data = {};
      let top_agents_happy_customers_options = {};

      if (this.props.team.top_agents_happy_customers) {

        let labels = [];
        let values = [];

        this.props.team.top_agents_happy_customers.forEach((v, k) => {
            labels.push(k);
            values.push(v);
        });
        

        top_agents_happy_customers_data =  {
                        labels: labels,
                                datasets: [{
                            label: 'Positive feedback (total)',
                            data: values,
                            borderWidth: 1
                        }]
                    };          
            

        top_agents_happy_customers_options = {
          scales: {
            xAxes: [{
            ticks: {
                beginAtZero:true
            }
            }],
            yAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,0.0)"
                        }   
                    }]
                  }
              };

      }

      return (
        <div>
        <h1>Team</h1>

        <h2>Agent overview</h2>

        <div className={styles.containerFields}>

          <div className={styles.field}>
            <div className={styles.fieldTitle}>Top agents who have the most tickets assigned (total)</div>
            <HorizontalBar data={chart_top_agent_tickets_data} options={chart_top_agent_tickets_options} width="50" height="100"/>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTitle}>Top agents who spent the greatest time resolving tickets (mean)</div>
            <HorizontalBar data={top_agents_resolve_time_data} options={top_agents_resolve_time_options} width="50" height="100"/>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTitle}>Top agents who receive the most positive feedback (totals)</div>
            <HorizontalBar data={top_agents_happy_customers_data} options={top_agents_happy_customers_options} width="50" height="100"/>
          </div>

        </div>
        
        <hr/>

        <h2>Agents</h2>

        <div>{team}</div>


        </div>
      )

    }

}

export default connect((store) => {
  return {
    team: store.team.team,
    customers: store.customers.customers
  };
})(Team);
