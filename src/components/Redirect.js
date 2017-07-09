import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'

class Redirect extends Component {
    render() {
        const data = this.props.data
        if (data.loading) {
            return (<div>A moment...<br/> you will be redirected</div>)
        }        

        if (data.user.role && data.user.role.name === 'admin') {
            window.location = window.location.origin + "/dashboard"
        } else {
            window.location = `${window.location.origin}/profile/${data.user.id}`
        }
        
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

