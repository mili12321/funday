import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout } from '../store/actions/userActions'
import { LoginModal } from '../cmps/LoginModal';
import {guestLogin} from '../store/actions/userActions'
import { HomeBackground } from "../cmps/HomeBackground";

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
            <>
                <HomeBackground/>

                <div  className="home-page">

                    <div className="title-wrapper" >
                        <div className="title">FUNDAY</div>
                        <img class="title-img" src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt=''/>
                    </div>

                    <div className="desc-wraper" >
                        The next step in multi-planning and productivity!
                        Funday will help you keep track of hundreds of tasks.
                        An efficient way to manage your co-workers / employees.
                        Half the hassle and twice the fun.
                    </div>

                    <div className="btns-container">
                        <div className="login-btn">
                            {!this.props.loggedInUser&& 
                                <div className="user-login  after-canvas" onClick=  {this.onOpenModal}>Log in</div>
                            }
                            {this.props.loggedInUser && <div    className="user-name">Hello {this.props.loggedInUser.username}</div>}
                            {this.props.loggedInUser&&<div id="logout-btn"  onClick={this.logout}>Logout</div>}
                    
                        </div>
                        {!this.props.loggedInUser&& 
                            <div className="login-btn">
                                <div className="user-login  after-canvas" onClick={this.onGuestLogin}>
                                    Try as a guest
                                </div>
                            </div>
                        }
                        {this.state.showComponent&&<LoginModal onOpenModal= {this.onOpenModal}/>}
                    </div>

                </div>
            </>
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