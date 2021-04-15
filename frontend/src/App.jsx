import React, { useEffect,useState,useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import {routes} from './routes.js'
import { Navbar } from './cmps/Navbar'
import { useSelector } from "react-redux";
import { socketService } from './services/socketService'

export function App() {
  const loggedInUser = useSelector(state => state.user.loggedInUser);

  return (
    <div className="App">
      {loggedInUser&&<Navbar/>}
      <Switch>
        { routes.map(route => <Route key={ route.path } exact component={ route.component } path={ route.path } />) }
      </Switch>
    </div>
  )
}

