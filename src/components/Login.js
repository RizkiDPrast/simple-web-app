import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import validator from 'validator'
import { gql, graphql } from 'react-apollo'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            initial: true
        }
    }

    validateEmail = (email) => {
        if (email.trim() === "")
            return false

        if (validator.isEmail(email))
            return true
        return false
    }


    onInputEmail = (val) => {
        this.setState({ email: val.target.value, initial: false })
    }

    onInputPwd = (val) => {
        let text = val.target.value
        if (val.target.id === "pwd") {
            this.setState({ password: text, initial: false })
        } else {
            this.setState({ password2: text, initial: false })
        }

    }

    redirectPath = (user) => {        
        if (user.role && user.role.name === 'admin') {
            window.location = window.location.origin + "/dashboard"
        } else {
            window.location = `${window.location.origin}/profile/${this.props.data.user.id}`
        }
    }

    handleLogin = () => {

        const { email, password } = this.state

        this.props.signinUser({ variables: { email, password } })
            .then((response) => {
                window.localStorage.setItem('graphcoolToken', response.data.signinUser.token)
                console.log('s',this.props)
                let user = this.props.data.user
                this.redirectPath(user)                
            }).catch((e) => {
                console.error(e)
                this.props.history.push(`/login`)
            })

        // window.location.pathname = '/'
    }

    componentDidMount() {
        // redirect if user is logged in
        if (this.props.data && this.props.data.user) {
            console.warn('already logged in')
            this.redirectPath(this.props.data.user)            
        }
    }

    render() {
        const c = {
            email: this.state.initial || this.validateEmail(this.state.email) ? "form-control" : "form-control error",
            pwd: "form-control"
        }
        return (
            <div>
                <h1>Login</h1>
                <form>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" className={c.email} name="email" id="email" value={this.state.email} onInput={this.onInputEmail} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className={c.pwd} name="password" id="pwd" value={this.state.password} onInput={this.onInputPwd} />
                    </div>
                    <input type="button" className="btn btn-default" value="Login" onClick={this.handleLogin} />
                </form>
                Don't have an account?
                    <Link to="/">
                    <i>Sign up</i>
                </Link>
            </div>
        )
    }

}

const signinUser = gql`
  mutation ($email: String!, $password: String!) { 
    signinUser(email: {email: $email, password: $password}) {
      token
    }
  }
`

const userQuery = gql`
  query {
    user {
      id
      role {
          name
      }
    }
  }
`

export default graphql(signinUser, { name: 'signinUser' })(
    graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(withRouter(Login))
)

