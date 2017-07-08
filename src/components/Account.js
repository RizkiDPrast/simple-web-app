import React, { Component } from 'react'
import Login from './Login'

export default class Account extends Component {
    userSignOut = (e) => {
        window.localStorage.removeItem('graphcoolToken')
        window.location.reload()

        this.props.history.push('/login')
    }
    render() {                
        if(!this.props.user) {            
            this.props.history.push('/login')
            return <Login />
        }
        
        const {id, name, email} = this.props.user               
        if (id) {
            return (
                <div className='navbar navbar-fixed-top'>
                    <div className='nav navbar-nav navbar-right'>                        
                        welcome {name === null ? email : name} <a onClick={this.userSignOut}> sign out </a>
                    </div>
                </div>
            )
        }
        return (
                null
            )

    }
}