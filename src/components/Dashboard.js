import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Account from './Account'
import { gql, graphql } from 'react-apollo'

class Dashboard extends Component {
    render() {
        
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }                      
                             
        return (
            <div>
                <Account user={this.props.data.user} history={this.props.history}/>                
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
                    <div className="col-sm-4">
                        <Link to={`/profile/${1}`}>
                            <button type="button" className="btn btn-outline-primary btn-lg btn-block">
                                Profile
                            </button>
                        </Link>
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


export default withRouter(graphql(userQuery)(Dashboard))               