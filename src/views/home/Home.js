import React from 'react';
import ReactDOM from 'react-dom';
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

import styles from './Home.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState((state) => {
      return {ran: Math.random()}
    });

    this.forceUpdate();
    this.props.dispatch(actions.getMetrics());
  }

  componentWillUnmount() {
    this.setState((state) => {
      return{ran: Math.random()}
    });
    // let mountNode = ReactDOM.findDOMNode(this.refs.wassup);
    // let unmount = ReactDOM.unmountComponentAtNode(mountNode);
  }

  render () {

      let helper = new Helpers;

      let mean_resolve_time = helper.formatMinsToDHMS(this.props.metrics.mean_resolve_time);

      let created_days = [];
      let solved_days = [];


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

      if (this.props.metrics.busy_times_over_week) {

            for (let day in [0,1,2,3,4,5,6]) {
              let this_day = [];
              this_day.push(<div className={styles.histoDayTitle}>{day_of_week[day]}</div>);
              for (let hour in [0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]) {
                if (this.props.metrics.busy_times_over_week[day].get(hour)>0) {
                  let percentage = (this.props.metrics.busy_times_over_week[day].get(hour)/this.props.metrics.max_tickets_per_hour);
                  let this_style = {backgroundColor: `rgba(251, 69, 112,${percentage})`};
                  this_day.push(<div className={styles.histoDay} style={this_style}>{this.props.metrics.busy_times_over_week[day].get(hour)}</div>)                  
                } else {
                  this_day.push(<div className={styles.histoDayBlank}>-</div>)                  
                }
              }
              this_week.push(<div className={styles.histoWeek}>{this_day}</div>)
            }
      }

      let reporting_from, reporting_to = "";


      if (this.props.metrics.reporting_period) {
        reporting_from = `${helper.formatDateFromString(this.props.metrics.reporting_period.start)}`; 
        reporting_to = `${helper.formatDateFromString(this.props.metrics.reporting_period.end)}`;
      }


      // chart: tickets over time
      // ----------------------------------
      let chart_ticket_time_data = {};
      let chart_ticket_time_options = {}

      if (this.props.metrics.tickets_over_time) {


        chart_ticket_time_data = {
            labels: this.props.metrics.tickets_over_time.timeseries,
            datasets: [
                {
                    label: "Created",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(251, 69, 112,0.6)",
                    borderColor: "rgba(251, 69, 112,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(251, 69, 112,1)",
                    pointBackgroundColor: "rgba(251, 69, 112,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(251, 69, 112,1)",
                    pointHoverBorderColor: "rgba(251, 69, 112,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.metrics.tickets_over_time.created,
                    spanGaps: false,
                },
                {
                    label: "Solved",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.metrics.tickets_over_time.solved,
                    spanGaps: false,
                }

            ]
        };


        let chart_ticket_time_options = {
          scales: {
            yAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,0.1)"
                        }   
                    }]
              }
        };

      }


      // chart: replies by ticket
      // ----------------------------------
      let chart_reply_data = {};
      let chart_reply_options = {};
      let chart_reply_pie = {};
      let chart_reply_pie_options = {};

      if (this.props.metrics.replies_per_ticket) {
  
        chart_reply_pie = {
           labels: this.props.metrics.replies_per_ticket.replies,
                        labelColor : 'white',
                                labelFontSize : '16',

                                datasets: [{
                                    label: 'Total tickets',
                                    data: this.props.metrics.replies_per_ticket.frequency,
                                    backgroundColor:["#eee","#5bb5b9","#71a5ae","#9b889b","#b47791","#cb6786","#d75f80","#ed4e77","#f74871","#fb4570","#ec2755"],

                                    borderWidth: 1
                                }]
        };

        // chart_reply_data =  {
        //                 labels: this.props.metrics.replies_per_ticket.replies,
        //                         datasets: [{
        //                     label: 'Total tickets',
        //                     data: this.props.metrics.replies_per_ticket.frequency,
        //                     borderWidth: 1
        //                 }]
        //             };

        let total_replies = this.props.metrics.replies_per_ticket.total;
        chart_reply_pie_options = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return chart_reply_pie.datasets[0].data[tooltipItem.index] + " tickets with " + chart_reply_pie.labels[tooltipItem.index]+" replies (" + ((chart_reply_pie.datasets[0].data[tooltipItem.index]/total_replies)*100).toFixed(1) +"%)";
                    }
                }
            },
            legend: {
              position: "right",
              align: "center",
            labels: {
            generateLabels: function(data) {
                if (chart_reply_pie.labels.length && chart_reply_pie.datasets.length) {
                    return chart_reply_pie.labels.map(function(label, i) {
                        return {
                            text: chart_reply_pie.labels[i]+" replies (" + chart_reply_pie.datasets[0].data[i] + " tickets, " + ((chart_reply_pie.datasets[0].data[i]/total_replies)*100).toFixed(1) +"%)",
                            fillStyle: chart_reply_pie.datasets[0].backgroundColor[i],
                            hidden: isNaN(chart_reply_pie.datasets[0].data[i]),

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



      // chart: ticket_solved_within_timeframes
      // ----------------------------------
      let ticket_solved_within_timeframes_data = {};
      let ticket_solved_within_timeframes_options = {};

      if (this.props.metrics.ticket_solved_within_timeframes) {

        let this_data = [
          this.props.metrics.ticket_solved_within_timeframes.less_than_4h,
          this.props.metrics.ticket_solved_within_timeframes.less_than_8h,
          this.props.metrics.ticket_solved_within_timeframes.less_than_12h,
          this.props.metrics.ticket_solved_within_timeframes.less_than_24h,
          this.props.metrics.ticket_solved_within_timeframes.less_than_2d,
          this.props.metrics.ticket_solved_within_timeframes.less_than_5d,
          this.props.metrics.ticket_solved_within_timeframes.more_than_5d,
        ];

        let this_labels = [
          '0-4hr',
          '4-8hr',
          '8-12hr',
          '12-48hr',
          '2-5 days',
          '>5 days'
        ]

        ticket_solved_within_timeframes_data =  {
                        labels: this_labels,
                                datasets: [{
                            label: 'Tickets resolved within',
                            data: this_data,
                            backgroundColor:["#5bb5b9","#71a5ae","#9b889b","#b47791","#cb6786","#d75f80","#ed4e77","#f74871","#fb4570","#ec2755"],
                            borderWidth: 1
                        }]
                    };          
            

        ticket_solved_within_timeframes_options = {
          scales: {
            xAxes: [{
                        gridLines: {
                            color: "rgba(200,200,200,0.0)"
                        }   
                    }]
                  }
              };

      }



      return (
        <div>
        <h1>Support desk performance</h1>

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

        <h2>Ticket overview</h2>

        <div className={styles.containerViz}>        
            <div className={styles.fieldTitle}>Tickets Created / Solved per day</div>
            <Line data={chart_ticket_time_data} options={chart_ticket_time_options} width="100" height="40"/>
        </div>

        <div className={styles.containerFields}>

            <DataField name="Tickets handled"
                       value={this.props.metrics.number_of_tickets} 
                       insight={{desc:"34% increase on last period",state:"negative"}}/>

            <DataField name="Tickets closed"
                       value={this.props.metrics.closed_tickets}/>

            <DataField name="Tickets resolved, pending close"
                       value={this.props.metrics.resolved_tickets} />


        </div>

         <div className={styles.containerFields}>

          <div className={styles.containerViz}>
            <div className={styles.fieldTitle}>Tickets resolved within timeframe</div>         
           <Bar data={ticket_solved_within_timeframes_data} options={ticket_solved_within_timeframes_options} width="100" height="35"/>
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
              <div className={styles.fieldInsightPositive}>Within SLA</div>
            </div>
        </div>

        <hr/>

        <div className={styles.containerFields}>
        <h2>Ticket attendence</h2>
        <div className={styles.containerViz}>        
            <div className={styles.fieldTitle}>Replies per ticket</div>
        </div>

            <Doughnut data={chart_reply_pie} options={chart_reply_pie_options} width="100" height="35"/>

 
            <DataField name="Resolved/Closed on first reply"
                       value={
                               ((this.props.metrics.resolved_on_first_reply / this.props.metrics.number_of_tickets)*100).toFixed(1)+"%" 
                                               }
                       insight={{desc:"Most tickets need follow up",state:"negative"}}/>

            <DataField name="Time to first reply (median)"
                       value={`${this.props.metrics.mean_time_to_first_reply} mins`} 
                       insight={{desc:"Within Response SLA",state:"positive"}}/>

            <DataField name="Replies per ticket (mean)"
                       value={`${this.props.metrics.mean_replies_per_ticket} replies`}
                       insight={{desc:"Most tickets are solved within a few interactions",state:"positive"}}/>



        </div>

        <hr/>

        <h2>Utilisation</h2>
        <div className={styles.containerViz}>        
            <div className={styles.fieldTitle}>Agents assigned tickets by day/hour</div>
            {this_week}
        </div>

        <hr/>


        </div>
      )

    }

}

export default connect((store) => {
  return {
    metrics: store.team.metrics,
  };
})(Home);
