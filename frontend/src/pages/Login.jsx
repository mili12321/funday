import React, { Component } from 'react'
import { connect } from 'react-redux'
import Particles from 'react-particles-js'
import { GoogleOauth } from '../cmps/GoogleOauth'

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
    msg: '',
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
    const { email, password } = this.state.loginCred
    if (!email || !password) {
      return this.setState({ msg: 'Please enter user/password' })
    }
    const userCreds = { email, password }
    const user = this.props.login(userCreds)
    user.then(data=>
      {if(data){
        this.setState({ loginCred: { email: '', password: '' } })
        this.props.closeModal()
        window.location.assign('/#/boards/')
      }else{
        return this.setState({ msg: 'Invalid email or password'})
      }
    })
  }

  doSignup = async (ev) => {
    ev.preventDefault()
    const { email, password, username } = this.state.signupCred
    if (!email || !password || !username) {
      return this.setState({ msg: 'All inputs are required!' })
    }
    const signupCreds = { email, password, username }
    this.props.signup(signupCreds)
    this.setState({ signupCred: { email: '', password: '', username: '' } })
    this.props.closeModal()
    window.location.assign('/#/boards/')
  }

  // onGuestLogin = async () => {
  //   await this.props.guestLogin();
  //   window.location.assign('/#/boards/')
  // }

  removeUser = (userId) => {
    this.props.removeUser(userId)
  }

  onSignup = () => {
    this.setState({ section: !this.state.section })
  }

  render() {
    let signupSection = (
      <form onSubmit={this.doSignup} className='signup-container'>
        <input
          className='login-input'
          type='text'
          name='email'
          value={this.state.signupCred.email}
          onChange={this.signupHandleChange}
          placeholder='Email'
        />
        <br />
        <input
          className='login-input'
          name='password'
          type='password'
          value={this.state.signupCred.password}
          onChange={this.signupHandleChange}
          placeholder='Password'
        />
        <br />
        <input
          className='login-input'
          type='text'
          name='username'
          value={this.state.signupCred.username}
          onChange={this.signupHandleChange}
          placeholder='Username'
          maxLength="10"
        />
        <br />
        <button className='login-btn'>Signup</button>
      </form>
    )
    let loginSection = (
      <form onSubmit={this.doLogin} className='login-container'>
        <input
          className='login-input'
          type='text'
          name='email'
          value={this.state.loginCred.email}
          onChange={this.loginHandleChange}
          placeholder='Email'
        />
        <br />
        <input
          className='login-input'
          type='password'
          name='password'
          value={this.state.loginCred.password}
          onChange={this.loginHandleChange}
          placeholder='Password'
        />
        <br />
        <button className='login-btn'>Login</button>
      </form>
    )

    const { loggedInUser } = this.props
    return (
      <React.Fragment>
        <Particles
          canvasClassName='login-particles-background'
          params={{
            particles: {
              number: {
                value: 160,
                density: {
                  enable: false,
                },
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  speed: 4,
                  size_min: 0.3,
                },
              },
              line_linked: {
                enable: false,
              },
              move: {
                random: true,
                speed: 1,
                direction: 'top',
                out_mode: 'out',
              },
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: 'bubble',
                },
                onclick: {
                  enable: true,
                  mode: 'repulse',
                },
              },
              modes: {
                bubble: {
                  distance: 250,
                  duration: 2,
                  size: 0,
                  opacity: 0,
                },
                repulse: {
                  distance: 400,
                  duration: 4,
                },
              },
            },
          }}></Particles>
        <div className='login-page'>
        <button className='close-modal' onClick={this.props.closeModal}>
              x
          </button>
          <h1 className='login-title'>
            <div
              className={`welcome-txt ${
                this.props.addFavMovieTxt ? 'hide-txt' : ''
              }`}>
              <div>Welcome</div>
              <div className='welcome-txt2'>
                Sign in with your email address
              </div>
            </div>
          </h1>
          <h2 className='mag'>{this.state.msg}</h2>


          <div className='auth-form'>

            {!loggedInUser && this.state.section ? loginSection : signupSection}
            <div className='login-txt'>
              {`${this.state.section ? "DON'T HAVE ACCOUNT YET?" : ''}`}{' '}
            </div>
            <div className="google-oauth">
            <GoogleOauth className="google-oauth-btn" closeModal={this.props.closeModal}/>
            </div>
            <div className='login-txt-btn' onClick={this.onSignup}>{`${
              this.state.section ? 'Signup Here' : 'Go Back'
            }`}</div>
          </div>

          <hr />
         
        </div>
      </React.Fragment>
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
  guestLogin
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
