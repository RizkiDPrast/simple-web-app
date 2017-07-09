import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import Account from './Account'

class Hobby extends Component {
    onDeleteButton = (e) => {
        this.props.onDelete(e.target.dataset.id)
    }
    render() {
        return (
            <div className="alert alert-info alert-dismissible show" role="alert">
                <button type="button" className="close" aria-label="Close" onClick={this.onDeleteButton}>
                    <span aria-hidden="true" data-id={this.props.name}>&times;</span>
                </button>
                <strong>{this.props.name}</strong>
            </div>
        )
    }
}

class Hobbies extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.items !== this.props.items
    }

    render() {
        if (this.props.items.length === 0)
            return null
        var lis = this.props.items.map((o, i) => {
            return <Hobby key={i} name={o} onDelete={this.props.onHobbyDelete} />
        })

        return (
            <div className="col-xs-offset-4">
                {lis}
            </div>
        )
    }
}

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: "",
            hobby: "",
            hobbies: [],
            fetched: false
        }

    }

    onRoleChange = (e) => {        
        this.setState({roleId: e.target.value})
    }
    onNameInput = (e) => {
        this.setState({ fullName: e.target.value })
    }

    onHobbyInput = (e) => {
        this.setState({ hobby: e.target.value })
    }

    onHobbyDelete = (name) => {
        let temp = this.state.hobbies.filter((elm) => {
            return elm !== name;
        })

        this.setState({ hobbies: temp })
    }

    onHobbyButtonClick = (e) => {
        let val = this.hobby.value
        if (val && val.trim().length > 2) {
            let isUnique = true;
            let temp = this.state.hobbies.slice()
            if (temp.indexOf(val) > -1)
                isUnique = false

            if (isUnique) {
                temp.push(val)
                this.setState({
                    hobby: "",
                    hobbies: temp
                })
            }
        }
        this.hobby.focus()
    }

    onSubmit = () => {
        const id = this.props.data.User.id
        const name = this.state.fullName
        const hobbies = this.state.hobbies

        if (id === null || name === null)
            return

        this.submit.setAttribute('disabled', 'disabled')
        let allHobbies = this.props.hobbies.allHobbies
        let tempH = []
        for (var i = 0; i < hobbies.length; i++) {
            let id = 0, isUnique = true
            for (var a = 0; a < allHobbies.length; a++) {
                if (allHobbies[a].name === hobbies[i]) {
                    isUnique = false
                    id = allHobbies[a].id
                    break
                }
            }
            if (!isUnique) {
                tempH.push(id)
            } else {
                this.props.createHobby({ variables: { name: hobbies[i] } })
                    .then((res) => {
                        tempH.push(res.name)
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            }
        }
        //updating user
        this.props.updateUser({
            variables: {
                id, name, hobbiesIds: tempH
            }
        })
            .then((res) => {
                this.props.history.push(`/profile/${id}`)
            })
            .catch((e) => {
                console.error(e)
                this.submit.setAttribute('disabled', 'false')
            })
    }

    componentDidUpdate() {
        if (!this.state.fetched) {
            if (this.props.data.User) {
                const user = this.props.data.User                   
                this.setState({
                    fullName: user.name !== null && user.name.length > 0 ? user.name : " ",
                    hobbies: user.hobbies.map((elm)=> elm.name),
                    roleId: user.role.name === "admin" ? "cj4th8s9v1y7i0154ztp35psy" : "cj4th8vqw1y7m0154xoapwgpk",
                    fetched: true
                })                
            }
        }        
    }

    render() {        
        if (this.props.data.loading || this.props.login.loading || !this.props.data.User) {
            return (<div>Loading</div>)
        }

        let isEditStage = (()=>{            
            return (this.props.match.params.edit && this.props.match.params.edit.toLowerCase() === "edit")
        })()


        const NameInput = isEditStage ?
            <input type="text" className="form-control" name="fullname" id="name" onInput={this.onNameInput} value={this.state.fullName} />
            : <input type="text" className="form-control" disabled name="fullname" id="name" value={this.state.fullName} />

        const HobbyInput = isEditStage ?
            (
                <div className="input-group">
                    <input type="text" className="form-control" ref={(hobby) => { this.hobby = hobby }} name="hobby" id="hobby" value={this.state.hobby} onInput={this.onHobbyInput} />
                    <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button" onClick={this.onHobbyButtonClick}>+</button>
                    </span>
                </div>
            )
            : null
            
        const roleSelect = (this.props.login.user && this.props.login.user.role.name.toLowerCase()) === "admin" ?
            (isEditStage ?
                (
                    <div className="form-group">
                        <label>Role:</label>
                        <select className="form-control" id="role" name="role" value={this.state.roleId} onChange={this.onRoleChange}>
                            <option value="cj4th8vqw1y7m0154xoapwgpk"> User </option>
                            <option value="cj4th8s9v1y7i0154ztp35psy"> Admin </option>
                        </select>
                    </div>
                ) :

                (
                    <div className="form-group">
                        <input type="hidden" className="form-control" disabled name="roleId" id="roleId" value={this.state.roleId} />
                        <input type="text" className="form-control" disabled value={this.state.roleId === "cj4th8vqw1y7m0154xoapwgpk" ? "User" : "Admin"} />
                    </div>
                )

            )
            :

            null;
            
            console.log(this.props, 'pro')
            
        return (                        
            <div>
                <Account user={this.props.login.user} history={this.props.history}/> 
                <div className="container">  
                <h1> Profile </h1>
                <form>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" className="form-control" disabled name="email" id="email" value={this.props.data.User.email} />
                    </div>
                    {roleSelect}
                    <div className="form-group">
                        <label>Full Name:</label>
                        {NameInput}
                    </div>
                    <div className="form-group">
                        <label>Hobbies:</label>
                        {HobbyInput}
                    </div>
                    <div className="form-group">
                        <input type="hidden" name="hobbies" id="hobbies" value={this.state.hobbies.join(",")} />
                        <Hobbies items={this.state.hobbies} onHobbyDelete={this.onHobbyDelete} />
                    </div>

                    <input type="button" ref={(btn) => { this.submit = btn }} className={isEditStage ? "btn btn-default" : "hidden"} onClick={this.onSubmit} value="Save" />
                </form>
                <a onClick={this.props.history.goBack}> back </a>
                </div>
            </div>
        )
    }
}

const ProfileQuery = gql`
  query User($id: ID!) {
    User(id: $id) {
      id
      name
      email
      role {
          name
      }
      hobbies {
          name
      }
    }
  }
`

const CreateHobby = gql`
    mutation createHobby($name: String!) {
        createHobby (
            name: $name
        ){
            id
            name
        }
    }
`

const UserQuery = gql`
    query login{
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

const updateUser = gql`
    mutation updateUser($id: ID!, $name: String!, $hobbiesIds:[ID!]) {
        updateUser(
            id: $id
            name: $name            
            hobbiesIds: $hobbiesIds
        ) { 
            id
            email
            hobbies {
                name
            }
        } 
    }
`

const AllHobbies = gql`query {
  allHobbies {
    id
    name    
  }
}`


export default graphql(UserQuery, {name: "login"})(graphql(CreateHobby, {name: "createHobby"})(
        graphql(updateUser, {name: "updateUser"})(
            graphql(AllHobbies, {name: "hobbies"})(
                graphql(ProfileQuery, { options: ({ match }) => ({ variables: { id: match.params.id, } }) })((Profile))))))
