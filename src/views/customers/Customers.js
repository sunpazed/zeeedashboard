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

import styles from './Customers.css';

class Customers extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(actions.fetchCustomers());
  }

  componentWillUnmount() {
  }

  updateCaptions(payload) {
  }

  render () {

      let helper = new Helpers;

      let reporting_from = "";
      let reporting_to = "";


      if (this.props.customers.reporting_period) {
        reporting_from = `${helper.formatDateFromString(this.props.customers.reporting_period.start)}`; 
        reporting_to = `${helper.formatDateFromString(this.props.customers.reporting_period.end)}`;
      }

    let customers = [];



      // chart: replies by ticket
      // ----------------------------------
      let chart_csat_pie = {};
      let chart_csat_pie_options = {};

      if (this.props.customers.customer_sat_summary) {

        let this_values = [this.props.customers.customer_sat_summary.good,this.props.customers.customer_sat_summary.bad];
        let this_labels = ['Positive','Negative'];

        chart_csat_pie = {
                         labels: this_labels,
                        labelColor : 'white',
                                labelFontSize : '16',

                                datasets: [{
                                    label: 'Total tickets',
                                    data: this_values,
                                    backgroundColor:["#5bb5b9","#ec2755"],

                                    borderWidth: 1
                                }]
        };


        let total_replies = this_values.reduce((acc, cur, _, arr) => acc + cur,0);
        chart_csat_pie_options = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return chart_csat_pie.datasets[0].data[tooltipItem.index] + " tickets with " + chart_csat_pie.labels[tooltipItem.index]+" responses (" + ((chart_csat_pie.datasets[0].data[tooltipItem.index]/total_replies)*100).toFixed(1) +"%)";
                    }
                }
            },
            legend: {
              position: "bottom",
              align: "center",
            labels: {
            generateLabels: function(data) {
                if (chart_csat_pie.labels.length && chart_csat_pie.datasets.length) {
                    return chart_csat_pie.labels.map(function(label, i) {
                        return {
                            text: chart_csat_pie.labels[i]+" responses (" + chart_csat_pie.datasets[0].data[i] + " tickets, " + ((chart_csat_pie.datasets[0].data[i]/total_replies)*100).toFixed(1) +"%)",
                            fillStyle: chart_csat_pie.datasets[0].backgroundColor[i],
                            hidden: isNaN(chart_csat_pie.datasets[0].data[i]),

                            // Extra data used for toggling the correct item
                            index: i
                        };
                    });
                  } else {
                      return [];
                  }
                  }
              }
              },
                        
            };
      }



      // chart: customer_sat_resolve_times
      // ----------------------------------
      let customer_sat_resolve_times_data = {};
      let customer_sat_resolve_times_options = {};

      if (this.props.customers.customer_sat_resolve_times) {

        let this_good_data = [
          this.props.customers.customer_sat_resolve_times.good.less_than_4h,
          this.props.customers.customer_sat_resolve_times.good.less_than_8h,
          this.props.customers.customer_sat_resolve_times.good.less_than_12h,
          this.props.customers.customer_sat_resolve_times.good.less_than_24h,
          this.props.customers.customer_sat_resolve_times.good.less_than_2d,
          this.props.customers.customer_sat_resolve_times.good.less_than_5d,
          this.props.customers.customer_sat_resolve_times.good.more_than_5d,
        ];

        let this_bad_data = [
          this.props.customers.customer_sat_resolve_times.bad.less_than_4h,
          this.props.customers.customer_sat_resolve_times.bad.less_than_8h,
          this.props.customers.customer_sat_resolve_times.bad.less_than_12h,
          this.props.customers.customer_sat_resolve_times.bad.less_than_24h,
          this.props.customers.customer_sat_resolve_times.bad.less_than_2d,
          this.props.customers.customer_sat_resolve_times.bad.less_than_5d,
          this.props.customers.customer_sat_resolve_times.bad.more_than_5d,
        ];

        let this_labels = [
          '0-4hr',
          '4-8hr',
          '8-12hr',
          '12-48hr',
          '2-5 days',
          '>5 days'
        ]

        customer_sat_resolve_times_data =  {
                        labels: this_labels,
                                datasets: [
                                {
                            label: 'Positive responses',
                            data: this_good_data,
                            backgroundColor:["#5bb5b9","#5bb5b9","#5bb5b9","#5bb5b9","#5bb5b9","#5bb5b9","#5bb5b9",],
                            borderWidth: 1
                        },
                                {
                            label: 'Negative responses',
                            data: this_bad_data,
                            backgroundColor:["#ec2755","#ec2755","#ec2755","#ec2755","#ec2755","#ec2755","#ec2755"],
                            borderWidth: 1
                        },                        
                        ]
                    };          
            

        customer_sat_resolve_times_options = {
          legend: {
              position: "bottom",
              },          
          scales: {
            xAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,1.0)"
                        }   
                    }]
                  }
              };

      }      

      return (
        <div>
        <h1>Customers</h1>

        <div className={styles.containerFields}>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Reporting from</div>
            <div className={styles.fieldValueSmall}>{reporting_from}</div>
            </div>

            <div className={styles.field}>
            <div className={styles.fieldTitle}>Reporting to</div>
            <div className={styles.fieldValueSmall}>{reporting_to}</div>
            </div>

        </div>

        <hr/>

        <h2>Customer Satisfaction</h2>

        <div className={styles.containerFields}>
             <div className={styles.containerFieldsHalf}>

                <div className={styles.containerViz}>        
                    <div className={styles.fieldTitle}>Positive vs Negative responses</div>
                    <Doughnut data={chart_csat_pie} options={chart_csat_pie_options} width="100" height="85"/>
                </div>

            </div>

            <div className={styles.containerFieldsHalf}>
                <div className={styles.containerViz}>        
                    <div className={styles.fieldTitle}>First response time and Customer Satisfaction</div>
                    <Bar data={customer_sat_resolve_times_data} options={customer_sat_resolve_times_options} width="100" height="85"/>
                </div>

            </div>

            <DataField name="Customer completion rate"
                       value={`${this.props.customers.customer_sat_engagement} %`}
                       insight={{desc:"Low completion rates",state:"negative"}}/>

        </div>

        <hr/>


        </div>
      )

    }

}

export default connect((store) => {
  return {
    team: store.team.team,
    customers: store.customers.customers
  };
})(Customers);
