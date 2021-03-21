import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout } from '../store/actions/userActions'
import { LoginModal } from '../cmps/LoginModal';
import {guestLogin} from '../store/actions/userActions'

export class _Home extends Component {
    state ={
        showComponent: false
    }
    onOpenModal=()=>{
        this.setState({
            showComponent: !this.state.showComponent
          });
    }
    logout=()=>{
        if(this.props.history.location.pathname==='/boards'){
            this.props.history.push('/')
            this.props.logout()
        }else{
            this.props.logout()
        }
    }

    onGuestLogin = async () => {
        await this.props.guestLogin();
        window.location.assign('/#/boards/')
    }

    render() {
        return (
            <div className="home-page">
                <div className="login-btn">
                {!this.props.loggedInUser&& 
                <div className="user-login  after-canvas" onClick={this.onOpenModal}>Log in</div>
                }
                {this.props.loggedInUser && <div className="user-name">Hello {this.props.loggedInUser.username}</div>}
                {this.props.loggedInUser&&<div id="logout-btn" onClick={this.logout}>Logout</div>}

                </div>
                {!this.props.loggedInUser&& <div className="login-btn">
                <div className="user-login  after-canvas" onClick={this.onGuestLogin}>
                    Try as a guest
                </div>
                </div>}
                {this.state.showComponent&&<LoginModal onOpenModal={this.onOpenModal}/>}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        loggedInUser: state.user.loggedInUser, 
        users: state.user.users,
    }
}
const mapDispatchToProps = {
    logout,
    guestLogin
}
export const Home = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Home))