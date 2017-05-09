import * as dataservice from "./dataService";

export function fetchTickets() {
  return {
    type: "FETCH_CUSTOMERS_FULFILLED",
    payload: dataservice.fetchTickets()
  }
}

export function getAgentMetrics(query) {
  let payload = dataservice.getAgentMetrics(query);
  return {
    type: "GOT_AGENT",
    payload: payload
  }
}

export function getMetrics() {
  let payload = dataservice.getMetrics();
  return {
    type: "GOT_METRICS",
    payload: payload
  }
}

export function fetchTeam() {
  let payload = dataservice.fetchTeam();
  return {
    type: "GOT_TEAM",
    payload: payload
  }
}

export function fetchCustomers() {
  let payload = dataservice.fetchCustomers();
  return {
    type: "GOT_CUSTOMERS",
    payload: payload
  }
}
