import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Components from './components'

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'


const networkInterface = createNetworkInterface({ uri: "https://api.graph.cool/simple/v1/cj4sfnexb49du0179pqdmqksl" })

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }    
    if (localStorage.getItem('graphcoolToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
    }
    next()
  },
}])

const client = new ApolloClient({ networkInterface })


ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <div>
                <Route exact path='/' component={Components.Register} />
                <Route path='/login' component={Components.Login} />
                <Route path='/dashboard' component={Components.Dashboard} />
                <Route path='/userlist' component={Components.UserList} />
                <Route path='/profile/:id/:edit?' component={Components.Profile} />
            </div>
        </Router>
    </ApolloProvider>,
    document.getElementById('root'));

registerServiceWorker();
