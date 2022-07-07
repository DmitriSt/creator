import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { ApplicationPaths, LoginActions, LogoutActions } from '../../../models/constants/authorization';
import Login from './Login';
import Logout from './Logout';

export default class AuthorizationRoutes extends Component {
  loginAction(name: string) {
    return <Login action={name} />;
  }

  logoutAction(name: string) {
    return <Logout action={name} />;
  }

  render() {
    return (
      <>
        <Route path={ApplicationPaths.Login} render={() => this.loginAction(LoginActions.Login)} />
        <Route path={ApplicationPaths.LoginFailed} render={() => this.loginAction(LoginActions.LoginFailed)} />
        <Route path={ApplicationPaths.LoginCallback} render={() => this.loginAction(LoginActions.LoginCallback)} />
        <Route path={ApplicationPaths.Continue} render={() => this.loginAction(LoginActions.Continue)} />
        <Route path={ApplicationPaths.Profile} render={() => this.loginAction(LoginActions.Profile)} />
        <Route path={ApplicationPaths.Register} render={() => this.loginAction(LoginActions.Register)} />
        <Route path={ApplicationPaths.LogOut} render={() => this.logoutAction(LogoutActions.Logout)} />
        <Route path={ApplicationPaths.LogOutCallback} render={() => this.logoutAction(LogoutActions.LogoutCallback)} />
        <Route path={ApplicationPaths.LoggedOut} render={() => this.logoutAction(LogoutActions.LoggedOut)} />
        <Route path={ApplicationPaths.ProfileDeleted} render={() => this.logoutAction(LogoutActions.ProfileDeleted)} />
      </>
    );
  }
}
