import React, { Component } from 'react'
import { Route , withRouter} from 'react-router-dom';
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import { loginByGoogle } from '../store/actions/userActions'
import { Loading } from './Loading'
import { loadWorkspaces} from '../store/actions/workspaceActions'

export class _GoogleOauth extends Component {
    state={
        isLoading: false,
    }
    responseGoogle =async (response) => {
        const userCreds = { 
            email: response.profileObj.email,
            avatar:response.profileObj.imageUrl, 
            username: response.profileObj.givenName 
        }
        await this.props.loginByGoogle(userCreds)
        this.setState({ isLoading: true })
        await this.props.loadWorkspaces()
        this.setState({ isLoading: false })
        if (this.props.loggedInUser) this.props.history.push(`/boards`)
    }
       
    render() {
        if (this.state.isLoading) return <Loading txt='SIGNING IN WITH GOOGLE...'/>
        return (
           <div>
                <GoogleLogin
                    clientId="866960241942-jhfvtsh6b7adl5jae5cth72jlhug4i72.apps.googleusercontent.com"
                    buttonText="Login With Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
           </div> 
        )}
}
const mapStateToProps = (state) => {
    return {
      users: state.user.users,
      loggedInUser: state.user.loggedInUser,
      isLoading: state.system.isLoading,
    }
}
const mapDispatchToProps = {
    loginByGoogle,
    loadWorkspaces
}
export const GoogleOauth =  connect(mapStateToProps, mapDispatchToProps)(withRouter(_GoogleOauth))