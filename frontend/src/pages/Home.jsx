import React, { Component,useEffect,useState,useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout } from '../store/actions/userActions'
import { Login } from '../cmps/Login';
import {guestLogin} from '../store/actions/userActions'
import { HomeBackground } from "../cmps/HomeBackground";
import { Loading } from '../cmps/Loading'
import { loadWorkspaces} from '../store/actions/workspaceActions'

export class _Home extends Component {
    state ={
        showComponent: false,
        isLoading:false
    }
    onOpenModal=()=>{
        this.setState({
            showComponent: !this.state.showComponent
          });
    }
    logout=()=>{
        if(this.props.history.location.pathname==='/boards'){
            this.setState({isLoading:true})
            this.props.logout()
            if(!this.props.loggedInUser){
                this.setState({isLoading:false})
                this.props.history.push('/')
            }
        }else{
            this.props.logout()
        }
    }

    onGuestLogin = async () => {
        await this.props.guestLogin();
        this.setState({ isLoading: true })
        await this.props.loadWorkspaces()
        this.setState({ isLoading: false })
        this.props.history.push('/boards')
    }



    render() {
        if (this.state.isLoading) return <Loading txt='LOADING WORKSPACES...'/>
        return (  
            <>
                <HomeBackground showComponent={this.state.showComponent}/>
            <div className="home-page">
                <div className="home-page-intro">

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
                        
                        {!this.props.loggedInUser&&
                          <div class="treat-wrapper">
                            <div className="button is-white is-top-join"  onClick={this.onOpenModal}>
                                <span class="hover"></span>
                                <span class="label">Log in</span>
                            </div>
                          </div>
                        }
    
                        {!this.props.loggedInUser&&<TreatButton onGuestLogin={this.onGuestLogin}/>}

                    </div>
                </div>
                {this.state.showComponent&&  <Login/> }
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
    guestLogin,
    loadWorkspaces
}
export const Home = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Home))


function TreatButton ({onGuestLogin}) {
    const [runGuestLogin, setrunGuestLogin] = useState(true)
    const [width, setWidth] = useState(window.innerWidth)
    const [height, sethHight] = useState(window.innerHeight)
    const treatmojis = ["🍬", "🍫", "🍭", "🍡", "🍩", "🍪", "🍒"];
    const treats = [];
    const radius = 15;
    
    const Cd = 0.47; // Dimensionless
    const rho = 1.22; // kg / m^3
    const A = Math.PI * radius * radius / 10000; // m^2
    const ag = 9.81; // m / s^2
    const frameRate = 1 / 60;
    const elButton = useRef(null)
    const elWrapper = useRef(null)

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function createTreat() /* create a treat */ {
        const vx = getRandomArbitrary(-10, 10); // x velocity
        const vy = getRandomArbitrary(-10, 1);  // y velocity
        
        const el = document.createElement("div");
        el.className = "treat";
      
        const inner = document.createElement("span");
        inner.className = "inner-style";
        inner.innerText = treatmojis[getRandomInt(0, treatmojis.length - 1)];
        el.appendChild(inner);
        
        elWrapper.current.appendChild(el);
      
        const rect = el.getBoundingClientRect();
      
        const lifetime = getRandomArbitrary(2000, 3000);
      
        el.style.setProperty("--lifetime", lifetime);
      
        const treat = {
          el,
          absolutePosition: { x: rect.left, y: rect.top },
          position: { x: rect.left, y: rect.top },
          velocity: { x: vx, y: vy },
          mass: 0.1, //kg
          radius: el.offsetWidth, // 1px = 1cm
          restitution: -.7,
          
          lifetime,
          direction: vx > 0 ? 1 : -1,
      
          animating: true,
      
          remove() {
            this.animating = false;
            this.el.parentNode.removeChild(this.el);
          },
      
          animate() {
            const treat = this;
            let Fx =
              -0.5 *
              Cd *
              A *
              rho *
              treat.velocity.x *
              treat.velocity.x *
              treat.velocity.x /
              Math.abs(treat.velocity.x);
            let Fy =
              -0.5 *
              Cd *
              A *
              rho *
              treat.velocity.y *
              treat.velocity.y *
              treat.velocity.y /
              Math.abs(treat.velocity.y);
      
            Fx = isNaN(Fx) ? 0 : Fx;
            Fy = isNaN(Fy) ? 0 : Fy;
      
            // Calculate acceleration ( F = ma )
            var ax = Fx / treat.mass;
            var ay = ag + Fy / treat.mass;
            // Integrate to get velocity
            treat.velocity.x += ax * frameRate;
            treat.velocity.y += ay * frameRate;
      
            // Integrate to get position
            treat.position.x += treat.velocity.x * frameRate * 100;
            treat.position.y += treat.velocity.y * frameRate * 100;
            
            treat.checkBounds();
            treat.update();
          },
          
          checkBounds() {
      
            if (treat.position.y > height - treat.radius) {
              treat.velocity.y *= treat.restitution;
              treat.position.y = height - treat.radius;
            }
            if (treat.position.x > width - treat.radius) {
              treat.velocity.x *= treat.restitution;
              treat.position.x = width - treat.radius;
              treat.direction = -1;
            }
            if (treat.position.x < treat.radius) {
              treat.velocity.x *= treat.restitution;
              treat.position.x = treat.radius;
              treat.direction = 1;
            }
      
          },
      
          update() {
            const relX = this.position.x - this.absolutePosition.x;
            const relY = this.position.y - this.absolutePosition.y;
      
            this.el.style.setProperty("--x", relX);
            this.el.style.setProperty("--y", relY);
            this.el.style.setProperty("--direction", this.direction);
          }
        };
      
        setTimeout(() => {
          treat.remove();
        }, lifetime);
      
        return treat;
      }
      
   
    
    function animationLoop() {
        var i = treats.length;
        while (i--) {
        treats[i].animate();
  
            if (!treats[i].animating) {
              treats.splice(i, 1);
            }
        }
  
        requestAnimationFrame(animationLoop);
    }
  
    animationLoop();
  
    function addTreats() {
      //cancelAnimationFrame(frame);
      if (treats.length > 40) {
        return;
      }
      for (let i = 0; i < 10; i++) {
        treats.push(createTreat());
      }
    }
  

    useEffect(() => {
        const resizeListener = () => {
          // change width from the state object
            setWidth(window.innerWidth)
            sethHight(window.innerHeight)
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);
    
        // clean up function
        return () => {
          // remove resize listener
          window.removeEventListener('resize', resizeListener);
        }
    }, [])

    useEffect(() => {
      setTimeout(() => {
        if(elButton&&elButton.current){
            elButton.current.addEventListener("click", onGuestLogin, {once: true})
        }
      }, 1000);
    })

    return(
        <div className="treat-wrapper" ref={elWrapper}>
            <button className="button is-purple is-top-login treat-button" ref={elButton} onClick={()=>{
                if(elButton&&elButton.current){
                    addTreats()
                    // onGuestLogin()
                    // setTimeout(() => {
                    //     elButton.current.addEventListener("click", onGuestLogin, {once: true})
                    // }, 1000);
                }
            }} >
              <span class="hover"></span>
              <span class="label">Try as a guest</span>
            </button>
        </div>
    )
    
}