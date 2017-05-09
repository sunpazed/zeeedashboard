import { tickets } from "./ticketData";


export function fetchTickets() {
  return tickets;
}


export function filterTicketsByAgent(assignee_id) {

  let assignee = parseInt(assignee_id);
  return tickets.filter(ticket => {
              if (ticket.assignee_id == assignee) { return ticket }
            });

}


export function fetchReportingPeriod() {

  let ticketsOverTime = tickets.map(ticket => { 
     let created = new Date(ticket.created_at).getTime();
     ticket.created_at_ts = created;
     return ticket;
  });

  let sortedTicketsByTime = ticketsOverTime.sort((a, b) => {return a.created_at_ts-b.created_at_ts});

  return { 
          start: sortedTicketsByTime[0].created_at, 
          end: sortedTicketsByTime[sortedTicketsByTime.length-1].created_at 
        }

}

export function getAgentMetrics(assignee_id) {

  // let's grab all agent tickets by the agent id
  let thisAgent = filterTicketsByAgent(assignee_id);
  let agentTickets = thisAgent.length;

  // grab the resolve times
  let agentResolveTimes = thisAgent.map(ticket => { return parseInt(ticket.full_resolve_time) });
  let agentFilterTimes = agentResolveTimes.filter(ticket => { if (!isNaN(ticket)) return ticket });
  let agentMeanResolveTime = (median(agentFilterTimes));
  let teamMeanResolveTime = (getMeanTicketResolveTimes());

  // grab ticket status
  let agentTicketStatus = thisAgent.map(ticket => { return ticket.status });

  // sum - resolved tickets?
  let agentResolvedTickets = agentTicketStatus.filter(ticket => { if (ticket == "Solved") return ticket});
  let agentResolvedTicketsTotal = agentResolvedTickets.length;

  // sum - closed tickets?
  let agentClosedTickets = agentTicketStatus.filter(ticket => { if (ticket == "Closed") return ticket});
  let agentClosedTicketsTotal = agentClosedTickets.length;

  // sum - agents first time to reply?
  let agentTimetoFirstReply = thisAgent.map(ticket => { return parseInt(ticket.first_reply_time) });
  let agentMeanTimeToFirstReply = parseInt(mean(agentTimetoFirstReply));

  // sum - agents resolved on first reply ratio
  let agentResolvedOnFirstReply = thisAgent.filter(ticket => { if (parseInt(ticket.full_resolve_time) == parseInt(ticket.first_reply_time)) { return ticket } });
  let agentTicketsResolvedOnFirstReply = agentResolvedOnFirstReply.length;

  // sum - mean replies per ticket
  let agentRepliesPerTicket = thisAgent.map(ticket => { return parseInt(ticket.replies) });
  let agentMeanRepliesPerTicket = (mean(agentRepliesPerTicket)).toFixed(1);


  // Pending tickets > SLA
  // Ressignments per ticket

  // Median first reply time
  // Median full resolve time

  // Satisfaction ratings / response rate / percentage surveyed

  // These agents works best over weekends
  // These agents works best after hours
  // These agents work best during hours
  
  // tickets over timeseries
  let agentTicketsOverTime = thisAgent.map(ticket => { 
     let created = new Date(ticket.created_at).getTime();
     ticket.created_at_ts = created;
     return ticket;
  });
  sortedTicketsByTime = agentTicketsOverTime.sort((a, b) => {return a.created_at_ts-b.created_at_ts});

  // Time metrics, such as first reply time, full resolution time, and requester wait time.
  // Ticket text, drawn from the subject, description, and comments fields.
  // Effort metrics, including the number of replies, reopened tickets, and reassigned tickets


  // Busy times graph
  // ---------------------
  let agentTicketsCreatedByHour = sortedTicketsByTime.map(ticket => { 
    let created = new Date(ticket.created_at_ts);
    let hour = created.getHours();
    let day_of_week = created.getDay();
    return { day: day_of_week, hour: hour } 
  });

  // our struct for the week (0..Sun, 1..Mon)
  let week = {'0':[], '1':[], '2':[], '3':[], '4':[], '5':[], '6':[]};

  // populate each day of the week with an hourly value
  for (let ticket in agentTicketsCreatedByHour) {
    week[agentTicketsCreatedByHour[ticket].day].push(agentTicketsCreatedByHour[ticket].hour);
  }

  let maxTicketsPerHour = 0;

  // generate histograms per day
  for (let [key,value] in week) {
    let day_histogram = histogram(week[key]);
    let week_sorted = sort(week[key]);

    // let's find the max number of tickets assigned per hour
    for (let [key,value] of day_histogram) {
        maxTicketsPerHour = ( value > maxTicketsPerHour) ? value : maxTicketsPerHour;
    }

    week[key] = day_histogram;
  }



  // Ticket activity over period ( created, resolved, pending )
  // ---------------------------------
  // tickets created over time
  let agentTicketsCreatedByDate = thisAgent.map(ticket => { return ticket.created_at.split(" ")[0]});
  let agentTicketsCreatedHistogram = histogram(agentTicketsCreatedByDate);

  // tickets solved over time
  let agentTicketsSolvedByDate = thisAgent.map(ticket => { return ticket.solved_at.split(" ")[0]});
  let agentTicketsSolvedHistogram = histogram(agentTicketsSolvedByDate);



  return {
            agent_id: assignee_id,
            number_of_tickets: agentTickets,
            mean_resolve_time: agentMeanResolveTime,
            mean_resolve_time_team: teamMeanResolveTime,
            mean_replies_per_ticket: agentMeanRepliesPerTicket,
            mean_time_to_first_reply: agentMeanTimeToFirstReply,
            resolved_tickets: agentResolvedTicketsTotal,
            closed_tickets: agentClosedTicketsTotal,
            resolved_on_first_reply: agentTicketsResolvedOnFirstReply,
            tickets_created_over_time: agentTicketsCreatedHistogram,
            tickets_solved_over_time: agentTicketsSolvedHistogram,
            busy_times_over_week: week,
            max_tickets_per_hour: maxTicketsPerHour

          };

}




export function getMetrics() {
  // let's grab all agent tickets by the agent id
  let totalTickets = tickets.length;

  // grab the resolve times
  let ticketResolveTimes = tickets.map(ticket => { return parseInt(ticket.full_resolve_time) });
  let ticketMeanResolveTime = parseInt(median(ticketResolveTimes));

  // grab ticket status
  let ticketStatus = tickets.map(ticket => { return ticket.status });

  // sum - resolved tickets?
  let resolvedTickets = ticketStatus.filter(ticket => { if (ticket == "Solved") return ticket});
  let resolvedTicketsTotal = resolvedTickets.length;

  // sum - closed tickets?
  let closedTickets = ticketStatus.filter(ticket => { if (ticket == "Closed") return ticket});
  let closedTicketsTotal = closedTickets.length;

  // sum - agents first time to reply?
  let timetoFirstReply = tickets.map(ticket => { return parseInt(ticket.first_reply_time) });
  let meanTimeToFirstReply = parseInt(median(timetoFirstReply));

  // sum - agents resolved on first reply ratio
  let resolvedOnFirstReply = tickets.filter(ticket => { if (parseInt(ticket.full_resolve_time) == parseInt(ticket.first_reply_time)) { return ticket } });
  let ticketsResolvedOnFirstReply = resolvedOnFirstReply.length;

  // sum - mean replies per ticket
  let repliesPerTicket = tickets.map(ticket => { return parseInt(ticket.replies) });
  let meanRepliesPerTicket = (mean(repliesPerTicket)).toFixed(1);
  // build pie chart
  let repliesPerTicketTemp = tickets.map(ticket => { let replies = parseInt(ticket.replies); if (replies<10) { return replies } else { return ">9" } });
  let repliesPerTicketHistogram = histogram(repliesPerTicketTemp);
  let count_of_replies = [];
  let count_of_reply_freq = [];
  let cumulative_count_of_replies = repliesPerTicket.reduce((acc, cur, _, arr) => acc + cur,0);
  for (let [key,value] of repliesPerTicketHistogram) {
      count_of_replies.push(key);
      count_of_reply_freq.push(value);   
  }
  let repliesPerTicketViz = {
    replies: count_of_replies,
    frequency: count_of_reply_freq,
    total: cumulative_count_of_replies
  }


  // tickets over timeseries
  let ticketsOverTime = tickets.map(ticket => { 
     let created = new Date(ticket.created_at).getTime();
     ticket.created_at_ts = created;
     return ticket;
  });
  sortedTicketsByTime = ticketsOverTime.sort((a, b) => {return a.created_at_ts-b.created_at_ts});

  // Busy times graph
  // ---------------------
  let ticketsCreatedByHour = sortedTicketsByTime.map(ticket => { 
    let created = new Date(ticket.created_at_ts);
    let hour = created.getHours();
    let day_of_week = created.getDay();
    return { day: day_of_week, hour: hour } 
  });

  // our struct for the week (0..Sun, 1..Mon)
  let week = {'0':[], '1':[], '2':[], '3':[], '4':[], '5':[], '6':[]};

  // populate each day of the week with an hourly value
  for (let ticket in ticketsCreatedByHour) {
    week[ticketsCreatedByHour[ticket].day].push(ticketsCreatedByHour[ticket].hour);
  }

  let maxTicketsPerHour = 0;

  // generate histograms per day
  for (let [key,value] in week) {
    let day_histogram = histogram(week[key]);
    let week_sorted = sort(week[key]);

    // let's find the max number of tickets assigned per hour
    for (let [key,value] of day_histogram) {
        maxTicketsPerHour = ( value > maxTicketsPerHour) ? value : maxTicketsPerHour;
    }

    week[key] = day_histogram;
  }



  // Ticket activity over period ( created, resolved, pending )
  // ---------------------------------
  // tickets created over time
  let ticketsCreatedByDate = tickets.map(ticket => { return ticket.created_at.split(" ")[0]});
  let ticketsCreatedHistogram = histogram(ticketsCreatedByDate);

  // tickets solved over time
  let ticketsSolvedByDate = tickets.map(ticket => { return ticket.solved_at.split(" ")[0]});
  let ticketsSolvedHistogram = histogram(ticketsSolvedByDate);

  let timeseries_day = [];
  let timeseries_solved = [];
  let timeseries_created = [];
  let timeseries_rolling = [];
  let ticket_rolling = 0;

  // generate histograms over the week
  for (let [key,value] of ticketsCreatedHistogram) {
    let current_day = key;
    let ticket_created_today = (ticketsCreatedHistogram.get(current_day)) > 0 ? (ticketsCreatedHistogram.get(current_day)) : 0 ;
    let ticket_solved_today = (ticketsSolvedHistogram.get(current_day)) > 0 ? (ticketsSolvedHistogram.get(current_day)) : 0 ;
    let ticket_rolling = ticket_created_today - ticket_solved_today;
    timeseries_day.push(current_day);
    timeseries_created.push(ticket_created_today);
    timeseries_solved.push(ticket_solved_today);
    timeseries_rolling.push(ticket_rolling);
  }

  let ticketStatusOverTimeViz = {
    timeseries: timeseries_day,
    created: timeseries_created,
    solved: timeseries_solved,
    rolling: timeseries_rolling
  } 

  // Resolved within
  // ---------------------------------
  let resolvedWithinLessThan4hr = (tickets.filter(ticket => { if (parseInt(ticket.full_resolve_time) <= (4*60)) return ticket })).length;
  let resolvedWithinLessThan8hr = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (4*60)) && parseInt(ticket.full_resolve_time) < (8*60)) return ticket })).length;
  let resolvedWithinLessThan12hr = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (8*60)) && parseInt(ticket.full_resolve_time) < (12*60)) return ticket })).length;
  let resolvedWithinLessThan24hr = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (12*60)) && parseInt(ticket.full_resolve_time) < (24*60)) return ticket })).length;
  let resolvedWithinLessThan2day = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (24*60)) && parseInt(ticket.full_resolve_time) < (48*60)) return ticket })).length;
  let resolvedWithinLessThan5day = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (2*24*60)) && parseInt(ticket.full_resolve_time) < (5*24*60)) return ticket })).length;
  let resolvedGreaterThan5days = (tickets.filter(ticket => { if ((parseInt(ticket.full_resolve_time) >= (5*24*60))) return ticket })).length;
  let resolvedTimeframes = {
    less_than_4h: resolvedWithinLessThan4hr,
    less_than_8h: resolvedWithinLessThan8hr,
    less_than_12h: resolvedWithinLessThan12hr,
    less_than_24h: resolvedWithinLessThan24hr,
    less_than_2d: resolvedWithinLessThan2day,
    less_than_5d: resolvedWithinLessThan5day,
    more_than_5d: resolvedGreaterThan5days
  }

  // Top twenty agents (assigned tickets, customer satisfaction, time spent)
  // ---------------------------------
  let fetchAgents = tickets.map(ticket => { let agent = parseInt(ticket.assignee_id); if (!isNaN(agent)) return agent });
  let uniqueAgents = [...new Set(fetchAgents)];
  // top assigned tickets
  let sumTicketsByAgent = histogram(fetchAgents);
  let sumTicketsByAgentsSorted = sortMapByValues(sumTicketsByAgent);
  let sumTicketsByAgentsTop = spliceMap(sumTicketsByAgentsSorted,19);
  // top time spent
  let agentByTimeSpent = new Map();
  uniqueAgents.forEach(agent => {
    let agentTicketsByTime = tickets.filter(ticket => { if (agent == parseInt(ticket.assignee_id)) return ticket });
    let agentTicketMeanTime = agentTicketsByTime.map(ticket => { return parseInt(ticket.full_resolve_time) });
    agentByTimeSpent.set(agent,mean(agentTicketMeanTime));
  });
  let sumTimeSpentByAgentsSorted = sortMapByValues(agentByTimeSpent);
  let sumTimeSpentByAgentsTop = spliceMap(sumTimeSpentByAgentsSorted,19);
  // happy customers
  let agentByHappyCustomers = new Map();
  uniqueAgents.forEach(agent => {
    let agentTickets = tickets.filter(ticket => { if (agent == parseInt(ticket.assignee_id) && ticket.satisfaction == "Good") return ticket });
    agentByHappyCustomers.set(agent,agentTickets.length);
  });
  let sumHappyCustomerAgentsSorted = sortMapByValues(agentByHappyCustomers);
  let sumHappyCustomerAgentsTop = spliceMap(sumHappyCustomerAgentsSorted,19);


  return {
            reporting_period: fetchReportingPeriod(),
            number_of_tickets: totalTickets,
            mean_resolve_time: ticketMeanResolveTime,
            mean_replies_per_ticket: meanRepliesPerTicket,
            mean_time_to_first_reply: meanTimeToFirstReply,
            resolved_tickets: resolvedTicketsTotal,
            closed_tickets: closedTicketsTotal,
            resolved_on_first_reply: ticketsResolvedOnFirstReply,
            tickets_over_time: ticketStatusOverTimeViz,
            tickets_created_over_time: ticketsCreatedHistogram,
            tickets_solved_over_time: ticketsSolvedHistogram,
            ticket_solved_within_timeframes: resolvedTimeframes,
            busy_times_over_week: week,
            max_tickets_per_hour: maxTicketsPerHour,
            replies_per_ticket: repliesPerTicketViz,
            top_agents_assigned_tickets: sumTicketsByAgentsTop,
            top_agents_resolve_time: sumTimeSpentByAgentsTop,
            top_agents_happy_customers: sumHappyCustomerAgentsTop,


          };

}


export function getCustomerMetrics(assignee_id) {

  let customers = fetchCustomers();

}


export function getMeanTicketResolveTimes() {

  return median(tickets.map(ticket => { return parseInt(ticket.full_resolve_time) }));

}



export function fetchTeam() {

  // grab team
  let all_assignees = tickets.map(ticket => { { return ticket.assignee_id } });
  let uniq_assignees = {};

  let teamList = all_assignees.filter(assignee => { 
      if (!isNaN(parseInt(assignee))) {
        return uniq_assignees.hasOwnProperty(assignee) ? false : (uniq_assignees[assignee] = true);  
      }
  });

  // Top twenty agents (assigned tickets, customer satisfaction, time spent)
  // ---------------------------------
  let fetchAgents = tickets.map(ticket => { let agent = parseInt(ticket.assignee_id); if (!isNaN(agent)) return agent });
  let uniqueAgents = [...new Set(fetchAgents)];
  // top assigned tickets
  let sumTicketsByAgent = histogram(fetchAgents);
  let sumTicketsByAgentsSorted = sortMapByValues(sumTicketsByAgent);
  let sumTicketsByAgentsTop = spliceMap(sumTicketsByAgentsSorted,19);
  // top time spent
  let agentByTimeSpent = new Map();
  uniqueAgents.forEach(agent => {
    let agentTicketsByTime = tickets.filter(ticket => { if (agent == parseInt(ticket.assignee_id)) return ticket });
    let agentTicketMeanTime = agentTicketsByTime.map(ticket => { return parseInt(ticket.full_resolve_time) });
    agentByTimeSpent.set(agent,mean(agentTicketMeanTime));
  });
  let sumTimeSpentByAgentsSorted = sortMapByValues(agentByTimeSpent);
  let sumTimeSpentByAgentsTop = spliceMap(sumTimeSpentByAgentsSorted,19);
  // happy customers
  let agentByHappyCustomers = new Map();
  uniqueAgents.forEach(agent => {
    let agentTickets = tickets.filter(ticket => { if (agent == parseInt(ticket.assignee_id) && ticket.satisfaction == "Good") return ticket });
    agentByHappyCustomers.set(agent,agentTickets.length);
  });
  let sumHappyCustomerAgentsSorted = sortMapByValues(agentByHappyCustomers);
  let sumHappyCustomerAgentsTop = spliceMap(sumHappyCustomerAgentsSorted,19);

  return {
            team_list: teamList,
            top_agents_assigned_tickets: sumTicketsByAgentsTop,
            top_agents_resolve_time: sumTimeSpentByAgentsTop,
            top_agents_happy_customers: sumHappyCustomerAgentsTop,
            }  
  return 


}


export function getResolveTime() {

  let got_resolvetime_satisfaction = tickets.map(ticket => { { return ticket.full_resolve_time,ticket.satisfaction } });

  // lets get the resolve time
  let got_resolvetime = tickets.map(ticket => { { if (!isNaN(ticket.full_resolve_time)) { return ticket.full_resolve_time }  } });
  // sort by low to high
  got_resolvetime = got_resolvetime.filter(num => { if (!isNaN(num)) return num });
  got_resolvetime = got_resolvetime.sort((a, b) => {return a-b});

  // find the mean
  let resolve_mean = mean(got_resolvetime);
  let resolve_min = got_resolvetime[0];
  let resolve_max = got_resolvetime[got_resolvetime.length-1];
  let number_of_partitions = 20;
  let partition_bucket_size = (resolve_max - resolve_mean) / (number_of_partitions/2);
  let current_partition = 1;
  let partition = new Array();


  let foo = partition2.default(got_resolvetime,number_of_partitions);

  partition.push([]);
  partition.push([]);

  for (let i=0; i<=got_resolvetime.length;i++){
    let item = got_resolvetime[i];
    if (item < (partition_bucket_size*current_partition)) {
      partition[current_partition].push(item)
    } else {
      current_partition++;
      partition.push([]);
      partition[current_partition].push(item);
    }

  };

  let mean_frequency_of_each_partition = this_partition.map(part => { { return [mean(part), part.length] } });

  return mean_frequency_of_each_partition;


}




export function fetchCustomers() {


  // Customer Sat
  // ---------------------------------
  let totalTickets = tickets.length;
  let customerSatGood = (tickets.filter(ticket => { if (ticket.satisfaction == "Good") return ticket }));
  let customerSatBad = (tickets.filter(ticket => { if (ticket.satisfaction == "Bad") return ticket }));
  let customerSatDeclined = (tickets.filter(ticket => { if (ticket.satisfaction == "Declined") return ticket }));
  let customerSatNone = (tickets.filter(ticket => { if (ticket.satisfaction == "None") return ticket }));
  let customerSat = {
    good: customerSatGood.length,
    bad: customerSatBad.length,
    declined: customerSatDeclined.length,
    none: customerSatNone.length
  }
  let customerEngagement = (((customerSatGood.length + customerSatBad.length) / totalTickets)*100).toFixed(1);

  // Customers over time
  // --------------------------------- 
  let goodResolvedWithinLessThan4hr = (customerSatGood.filter(ticket => { if (parseInt(ticket.first_reply_time) <= (4*60)) return ticket }));
  let goodResolvedWithinLessThan8hr = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (4*60)) && parseInt(ticket.first_reply_time) < (8*60)) return ticket })).length;
  let goodResolvedWithinLessThan12hr = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (8*60)) && parseInt(ticket.first_reply_time) < (12*60)) return ticket })).length;
  let goodResolvedWithinLessThan24hr = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (12*60)) && parseInt(ticket.first_reply_time) < (24*60)) return ticket })).length;
  let goodResolvedWithinLessThan2day = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (24*60)) && parseInt(ticket.first_reply_time) < (48*60)) return ticket })).length;
  let goodResolvedWithinLessThan5day = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (2*24*60)) && parseInt(ticket.first_reply_time) < (5*24*60)) return ticket })).length;
  let goodResolvedGreaterThan5days = (customerSatGood.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (5*24*60))) return ticket })).length;
  let goodResolvedTimeframes = {
    less_than_4h: goodResolvedWithinLessThan4hr,
    less_than_8h: goodResolvedWithinLessThan8hr,
    less_than_12h: goodResolvedWithinLessThan12hr,
    less_than_24h: goodResolvedWithinLessThan24hr,
    less_than_2d: goodResolvedWithinLessThan2day,
    less_than_5d: goodResolvedWithinLessThan5day,
    more_than_5d: goodResolvedGreaterThan5days
  }

  let badResolvedWithinLessThan4hr = (customerSatBad.filter(ticket => { if (parseInt(ticket.first_reply_time) <= (4*60)) return ticket })).length;
  let badResolvedWithinLessThan8hr = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (4*60)) && parseInt(ticket.first_reply_time) < (8*60)) return ticket })).length;
  let badResolvedWithinLessThan12hr = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (8*60)) && parseInt(ticket.first_reply_time) < (12*60)) return ticket })).length;
  let badResolvedWithinLessThan24hr = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (12*60)) && parseInt(ticket.first_reply_time) < (24*60)) return ticket })).length;
  let badResolvedWithinLessThan2day = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (24*60)) && parseInt(ticket.first_reply_time) < (48*60)) return ticket })).length;
  let badResolvedWithinLessThan5day = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (2*24*60)) && parseInt(ticket.first_reply_time) < (5*24*60)) return ticket })).length;
  let badResolvedGreaterThan5days = (customerSatBad.filter(ticket => { if ((parseInt(ticket.first_reply_time) >= (5*24*60))) return ticket })).length;
  let badResolvedTimeframes = {
    less_than_4h: badResolvedWithinLessThan4hr,
    less_than_8h: badResolvedWithinLessThan8hr,
    less_than_12h: badResolvedWithinLessThan12hr,
    less_than_24h: badResolvedWithinLessThan24hr,
    less_than_2d: badResolvedWithinLessThan2day,
    less_than_5d: badResolvedWithinLessThan5day,
    more_than_5d: badResolvedGreaterThan5days
  }

  let customerSatResolveTimes = {
    good: goodResolvedTimeframes,
    bad: badResolvedTimeframes
  }


  return {
                reporting_period: fetchReportingPeriod(),
                customer_sat_summary: customerSat,
                customer_sat_engagement: customerEngagement,
                customer_sat_resolve_times: customerSatResolveTimes,
  };


}

function sort(values) {
    return values.sort((a, b) => {return a-b});
}

function sortMapByValues(map) {
    return new Map([...map.entries()].sort((a,b) => a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0));
}

function sortMapByKeys(map) {
    return new Map([...map.entries()].sort((a,b) => a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0));
}

function spliceMap(map,index) {
  let splicemap = new Map();
  let mapiter = map[Symbol.iterator]();
  for (let i=0;i<=index;i++) {
    let item = mapiter.next().value;
    splicemap.set(item[0],item[1]);
  }
    return splicemap;
}


function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}


function mean(values) {
  // assumption is that values is an array of values
  values = values.filter(num => { if (!isNaN(num)) return num });

  // use reduce to iteratively generate the mean
  return values.reduce((acc, cur, _, arr) => acc + cur / arr.length,0);
}

function histogram(value) {
  var map = new Map();
  var obj = {};
  Object.keys(value.reduce((obj, prop) => {
      return (prop in obj ? ++obj[prop] : (obj[prop] = 1)), obj
    }, obj)).forEach(el => map.set(el, obj[el]));
  return map
}


