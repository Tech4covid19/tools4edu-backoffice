import React from 'react';
import './App.scss';

import LoginPage from "./pages/login/Login";
import DashboardPage from './pages/dashboard/Dashboard';
import { Switch, Route, Redirect } from 'react-router';
import Auth from './auth';
import {dashboardInitialState, dashboardReducer, DashboardStateProvider} from "./pages/dashboard/DashboardState";

const auth = new Auth();

function App() {
  return (
    <div className="App">
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/" render={props =>
                auth.isAuthenticated() ? (
                    <DashboardStateProvider initialState={dashboardInitialState} reducer={dashboardReducer}>
                        <DashboardPage/>
                    </DashboardStateProvider>
                ) : <Redirect to={{ pathname: '/login' }}/>
            }/>
        </Switch>
    </div>
  );
}

export default App;
