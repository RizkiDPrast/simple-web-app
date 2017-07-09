import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, gql } from 'react-apollo'
import Account from './Account'

class UserRow extends Component {
    editRow = (e)=> {
        let id = e.target.parentNode.parentNode.dataset.row
        window.location = `${window.location.origin}/profile/${id}/edit`
    }

    deleteRow = (e)=> {
        let id = e.target.parentNode.parentNode.dataset.row        

        if(window.confirm(`This will delete user ${id}. Continue?`)) {
            this.props.delete({variables: {id}})
            window.location.reload()
        } 
    }

    addUser = (e)=> {                     
        window.location = `${window.location.origin}/register/`
    }

    render() {
        let tr = this.props.list.map((elm, i) => {
            // console.log(elm.email,elm.id, elm.password )
            return (<tr key={elm.id} data-row={elm.id}>
                <td>{elm.id}</td>
                <td>{elm.role.name}</td>
                <td>{elm.name}</td>
                <td>{elm.email}</td>
                <td>
                    <span className="glyphicon glyphicon-pencil" onClick={this.editRow}> </span>
                    <span className="glyphicon glyphicon-trash" onClick={this.deleteRow}> </span>
                    <span className="glyphicon glyphicon-plus" onClick={this.addUser}> </span>
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
        if (this.props.data.loading || this.props.user.loading) {
            return (<div>Loading</div>)
        }                
        
        if(!this.props.data.user) {
            window.location = "/login"
        }

        if(this.props.data.user.role && this.props.data.user.role.name !== "admin") {
            window.location = `${window.location.origin}/profile/${this.props.data.user.id}/edit`
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
                                <th>role</th>
                                <th>name</th>
                                <th>email</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <UserRow list={this.props.user.allUsers} delete={this.props.delete} />
                    </table>
                </div>
                <div className="row">
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
    password    
    role {
        name
    }
  }
}`

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

const deleteUser = gql`
    mutation deleteUser($id:ID!) {
        deleteUser(id:$id) {
            id
        }
    }
`

export default graphql(deleteUser, {name: "delete"})(graphql(FeedQuery, {name: "user"})(withRouter(graphql(userQuery)((UserList)))))