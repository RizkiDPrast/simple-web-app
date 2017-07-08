import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import validator from 'validator'
import { gql, graphql } from 'react-apollo'
import Profile from './Profile'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            password2: "",            
            initial: true,
            roleId: "cj4th8vqw1y7m0154xoapwgpk"
        }
    }

    validateEmail = (email) => {
        if (email.trim() === "")
            return false

        if (validator.isEmail(email))
            return true
        return false
    }

    validatePassword = () => {
        if (this.state.password === this.state.password2)
            return "form-control"
        return "form-control error"
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

    onRoleChange = (val) => {
        this.setState({roleId: val})
    }

    onSubmit = (e) => {
        this.submit.setAttribute("disabled", "disabled");
        e.preventDefault()

        if (this.state.password.length < 0 && this.state.password !== this.state.password2)
            return

        const { email, password, roleId } = this.state        

        this.props.createUser({ variables: { email, password , roleId} })
            .then((response) => {
                this.props.signinUser({ variables: { email, password } })
                    .then((response) => {
                        window.localStorage.setItem('graphcoolToken', response.data.signinUser.token)                        
                        this.props.history.push(`/profile${this.props.data.user.id}`)
                    }).catch((e) => {
                        console.error(e)                        
                        this.props.history.push(`/`)
                    })
            }).catch((e) => {
                console.error(e)
                this.props.history.push(`/`)
            })
    }

    componentDidMount() {
        // redirect if user is logged in
        if (this.props.data && this.props.data.user) {
            console.warn('already logged in')
            this.props.history.push(`/profile/${this.props.data.user.id}`)  
            return <Profile />   
        }
    }

    render() {
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }
        
        const c = {
            email: this.state.initial || this.validateEmail(this.state.email) ? "form-control" : "form-control error",
            pwd: (() => {
                if (this.state.initial)
                    return "form-control"
                return this.validatePassword()
            })()
        }
        const roleSelect = this.props.data.User && this.props.data.User.Role === "admin"  ? (
            <div className="form-group">
                <label>Role:</label>
                <select className="form-control" id="role" name="role" value={this.state.roleId} onChange={this.onRoleChange}>                    
                    <option value="cj4th8vqw1y7m0154xoapwgpk"> User </option>
                    <option value="cj4th8s9v1y7i0154ztp35psy"> Admin </option>
                </select>
            </div>
        ) :
            null;

        return (
            <div>
                <h1>Register</h1>
                <form>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" className={c.email} name="email" id="email" value={this.state.email} onInput={this.onInputEmail} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className={c.pwd} name="password" id="pwd" value={this.state.password} onInput={this.onInputPwd} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className={c.pwd} id="pwd2" placeholder="retype password" value={this.state.password2} onInput={this.onInputPwd} />
                    </div>
                    {roleSelect}
                    <input type="button" ref={(btn) => { this.submit = btn }} className="btn btn-default" onClick={this.onSubmit} value="submit" />
                </form>
                Already have an account?
                    <Link to="/login">
                    <i>Login</i>
                </Link>
            </div>
        )
    }

}

const createUser = gql`
  mutation ($roleId: String!, $email: String!, $password: String!) {
    createUser(roleId:$roleId authProvider: {email: {email: $email, password: $password}}) {
      id
    }
  }
`

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
          id
          name
      }
    }
  }
`

export default graphql(createUser, { name: 'createUser' })(
    graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
        graphql(signinUser, { name: 'signinUser' })(
            withRouter(Register))
    )
)

