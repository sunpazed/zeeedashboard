import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
  Error
} from '~/common/components';

import {
  App,
  Home,
  Team,
  Agent,
  Customers
} from '~/views';

const routes = (

  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/team" component={Team} />
    <Route path="/customers" component={Customers} />
    <Route path="/agent/:agent" component={Agent} />
    <Route path="*" component={Error} />
  </Route>

);

export default routes;

