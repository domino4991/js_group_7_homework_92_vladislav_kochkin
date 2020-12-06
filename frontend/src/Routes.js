import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PlugPage from "./containers/PlugPage/PlugPage";
import LoginRegister from "./containers/LoginRegister/LoginRegister";
import Chat from "./containers/Chat/Chat";

const ProtectedRoute = ({isAllowed, redirectTo, ...props}) => {
    return isAllowed ?
        <Route {...props} /> :
        <Redirect to={redirectTo} />
};

const Routes = ({user}) => {
    return (
        <Layout>
            <Switch>
                <Route path='/' exact component={PlugPage} />
                <ProtectedRoute
                    path="/register"
                    exact
                    component={LoginRegister}
                    isAllowed={!user}
                    redirectTo='/'
                />
                <ProtectedRoute
                    path="/login"
                    exact
                    component={LoginRegister}
                    isAllowed={!user}
                    redirectTo='/'
                />
                <ProtectedRoute
                    path="/chat"
                    exact
                    component={Chat}
                    isAllowed={user}
                    redirectTo='/'
                />
            </Switch>
        </Layout>
    );
};

export default Routes;