import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Account from './Account'
import { gql, graphql } from 'react-apollo'

class Dashboard extends Component {
    render() {

        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (!this.props.data.user) {
            window.location = window.location.origin + "/login"
            return (<div>Wait a moment</div>)
        }

        return (
            <div>
                <Account user={this.props.data.user} history={this.props.history} />
                <div className="container">
                    <div className="jumbotron">
                        <h3>Dashboard</h3>
                        <div className="row">
                            <div className="col-sm-4">
                                <Link to="/userlist">
                                    <button type="button" className="btn btn-outline-primary btn-lg btn-block">
                                        Get all user
                            </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const userQuery = gql`
  query {
    user {
      id
      name
      email
      role {
          name
      }
    }
  }
`


export default graphql(userQuery)(withRouter(Dashboard))               