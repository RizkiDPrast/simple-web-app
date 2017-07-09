import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'

class NavList extends Component {
    render() {
        let user = this.props.user
        let lis = []
        //user menu
        lis.push({href: `/profile/${user.id}/edit`, text: "Edit profile"})
        lis.push({href: `/profile/${user.id}`, text: "View profile"})
        //admin menu
        if(user.role.name === "admin") {
            lis.unshift({href: `/dashboard`, text: "Dashboard"})
        }
        lis = lis.map((elm, i) => {
            return <li key={i}><Link to={elm.href}>{elm.text}</Link></li>
        })
        return (
            <ul className="nav navbar-nav">
                {lis}
            </ul>
        )
    }
}

export default class Account extends Component {
    userSignOut = (e) => {
        window.localStorage.removeItem('graphcoolToken')
        window.location = window.location.origin + "/login"
        window.location.reload()
        // this.props.history.push('/login')
    }
    render() {
        if (!this.props.user) {
            this.props.history.push('/login')
            return <Login />
        }

        const { id, name, email } = this.props.user
        if (id) {
            return (
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Simple Web App</a>
                        </div>
                        <NavList user={this.props.user} />
                        <div className='nav navbar-nav navbar-right'>
                            welcome {name === null || name.length === 0 ? email : name} <a onClick={this.userSignOut}> sign out </a>
                        </div>
                    </div>
                </nav>
            )
        }
        return (
            null
        )

    }
}