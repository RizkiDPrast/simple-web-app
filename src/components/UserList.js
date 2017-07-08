import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'
import Account from './Account'

class UserRow extends Component {
    render() {
        let tr = this.props.list.map((elm, i) => {
            return (<tr>
                <td>{elm.id}</td>
                <td>{elm.name}</td>
                <td>{elm.email}</td>
                <td>
                    <span className="glyphicon glyphicon-pencil"> </span>
                    <span className="glyphicon glyphicon-trash"> </span>
                    <span className="glyphicon glyphicon-plus"> </span>
                </td>
            </tr>)
        })
        return (
            <tbody>
                {tr}
            </tbody>
        )
    }
}


class UserList extends Component {
    render() {
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }
        return (
            <div>
                <Account user={this.props.data.user} history={this.props.history}/>
            <div className="container">
                <h1>User List</h1>
                <div className="row">
                    <table className="table table-hover table-responsive table-striped">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>name</th>
                                <th>email</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <UserRow list={this.props.data.allUsers} />
                    </table>
                </div>
                <div class="row">
                    <a onClick={this.props.history.goBack}> back to dashboard </a>
                </div>
            </div>
            </div>
        )
    }
}

const FeedQuery = gql`query {
  allUsers(orderBy: createdAt_DESC) {
    id
    name
    email   
  }
}`

export default graphql(FeedQuery)(UserList)