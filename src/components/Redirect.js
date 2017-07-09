import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'

class Redirect extends Component {
    render() {
        if (this.props.data.loading) {
            return (<div>A moment...<br/> you will be redirected to Profile page</div>)
        }        

        window.location = window.location.origin + `/profile/${this.props.data.user.id}/edit`
        return null
    }
}

const userQuery = gql`
  query {
    user {
      id
      role {
          id
          name
      }
    }
  }
`

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
            withRouter(Redirect))    

