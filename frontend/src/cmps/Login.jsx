import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route , withRouter} from 'react-router-dom';
import { GoogleOauth } from './GoogleOauth'
import { TiUser } from "react-icons/ti";
import { MdEmail } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { loadWorkspaces} from '../store/actions/workspaceActions'
import { Loading } from './Loading'

import {
  loadUsers,
  removeUser,
  login,
  logout,
  signup,
  guestLogin
} from '../store/actions/userActions'

class _Login extends Component {
  state = {
    isLoading: false,
    isErrLogin: false,
    errMsg: '',
    loginCred: {
      email: '',
      password: '',
    },
    signupCred: {
      email: '',
      password: '',
      username: '',
    },
    section: true,
  }

  loginHandleChange = (ev) => {
    const { name, value } = ev.target
    this.setState((prevState) => ({
      loginCred: {
        ...prevState.loginCred,
        [name]: value,
      },
    }))
  }

  signupHandleChange = (ev) => {
    const { name, value } = ev.target
    this.setState((prevState) => ({
      signupCred: {
        ...prevState.signupCred,
        [name]: value,
      },
    }))
  }

  doLogin = async (ev) => {
    ev.preventDefault()
    try {
      const { email, password } = this.state.loginCred
      const userCreds = { email, password }
      await this.props.login(userCreds);
      this.setState({ isLoading: true })
      await this.props.loadWorkspaces()
      this.setState({ isLoading: false })
      if (this.props.loggedInUser) this.props.history.push(`/boards`)

    }catch (err) {
      this.setState({ isErrLogin: true, errMsg: 'Invalid email or password' })
        setTimeout(() => {
                this.setState({ isErrLogin: false })
        }, 2000);
    }
  }

  doSignup = async (ev) => {
    ev.preventDefault()
    try {
      const { email, password, username } = this.state.signupCred
      const signupCreds = { email, password, username }
      await this.props.signup(signupCreds)
      this.setState({ isLoading: true })
      await this.props.loadWorkspaces()
      this.setState({ isLoading: false })
      if (this.props.loggedInUser) this.props.history.push(`/boards`)

    }catch (err) {
      this.setState({ isErrLogin: true, errMsg: 'All inputs are required!' })
        setTimeout(() => {
                this.setState({ isErrLogin: false })
        }, 2000);
    }
  }

  removeUser = (userId) => {
    this.props.removeUser(userId)
  }

  onSignup = () => {
    this.setState({ errMsg: '' })
    this.setState({ section: !this.state.section })
  }

  render() {
    const {isErrLogin} = this.state

    let signupSection = (
      <form onSubmit={this.doSignup} className='signup-container'>
        <h3>Register</h3>
        {isErrLogin&&<div 
        className="alert alert-danger"
        role="alert">
           <IoMdAlert className='margin-right'/>{this.state.errMsg}
        </div>}
        <div className="form-group">
          <label><TiUser/></label>
          <input 
          type="text" 
          className="form-control" 
          placeholder="User name" 
          name='username'
          value={this.state.signupCred.username}
          onChange={this.signupHandleChange}
          maxLength="10"
          />
        </div>

        {/* <div className="form-group">
          <label>First name</label>
          <input 
          type="text" 
          className="form-control" 
          placeholder="First name" 
          name='username'
          value={this.state.signupCred.username}
          onChange={this.signupHandleChange}
          maxLength="10"
          />
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input 
          type="text" 
          className="form-control" 
          placeholder="Last name" 
          name='username'
          value={this.state.signupCred.username}
          onChange={this.signupHandleChange}
          maxLength="10"
          />
        </div> */}

        <div className="form-group">
          <label><MdEmail/></label>
          <input 
          type="email" 
          className="form-control" 
          placeholder="Enter email"
          name='email'
          value={this.state.signupCred.email}
          onChange={this.signupHandleChange} 
          />
        </div>

        <div className="form-group">
          <label><RiLockPasswordFill/></label>
          <input 
          type="password" 
          className="form-control" 
          placeholder="Enter password" 
          name='password'
          value={this.state.signupCred.password}
          onChange={this.signupHandleChange}
          />
        </div>

        <button type="submit" className="btn btn-login-blue btn-lg btn-block">Register</button>
        <p className="text-right">
            Already registered <span className="small-text" onClick={this.onSignup}>log in?</span>
        </p>
      </form>
    )
    let loginSection = (
      <form onSubmit={this.doLogin} className='login-container'>
        <h3>Log in</h3>
        {isErrLogin&&<div 
        className="alert alert-danger"
        role="alert">
           <IoMdAlert className='margin-right'/>{this.state.errMsg}
        </div>}
        <div className="form-group">
          <label><MdEmail/></label>
          <input
          type="email" 
          className="form-control" 
          placeholder="Enter email" 
          name='email'
          value={this.state.loginCred.email}
          onChange={this.loginHandleChange}
          />
        </div>
        <div className="form-group">
          <label><RiLockPasswordFill/></label>
          <input 
          type="password" 
          className="form-control" 
          placeholder="Enter password" 
          name='password'
          value={this.state.loginCred.password}
          onChange={this.loginHandleChange}
          />
        </div>

        <button type="submit" className="btn btn-login-blue btn-lg btn-block">Sign in</button>
        <button onClick={this.onSignup} className="btn btn-login-blue btn-lg btn-block">Sign up</button>

      </form>
    )

    const { loggedInUser } = this.props

    if (this.state.isLoading) return <Loading txt='SIGNING IN.. PLEASE WAIT'/>
    return (
      <div className='login-section slide-left-login'>

        <div className="outer">

          <div className="inner">
              {!loggedInUser && this.state.section ? loginSection : signupSection}
              <div className="google-oauth">
                <GoogleOauth className="google-oauth-btn"/>
              </div>
          </div>
          
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    loggedInUser: state.user.loggedInUser,
    isLoading: state.system.isLoading,
  }
}
const mapDispatchToProps = {
  login,
  logout,
  signup,
  removeUser,
  loadUsers,
  guestLogin,
  loadWorkspaces
}

export const Login = connect(mapStateToProps, mapDispatchToProps)( withRouter(_Login))
