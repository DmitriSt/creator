import React, { Component } from 'react';

import {
  AuthenticationResultStatus,
  AuthLoaderRadius,
  LogoutActions,
  QueryParameterNames,
} from '../../../models/constants/authorization';
import authService from '../../../services/authorization/authorize.service';
import ReturnUrlStore from '../../stores/loginStore/returnUrl';
import Loader from '../sharedComponents/Loader/Loader';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
interface ILogoutProps {
  action: string;
}

interface ILogoutState {
  message: string;
  isReady: boolean;
}

export default class Logout extends Component<ILogoutProps, ILogoutState> {
  constructor(props: any) {
    super(props);

    this.state = {
      message: '',
      isReady: false,
    };
  }

  componentDidMount() {
    const { action } = this.props;
    switch (action) {
      case LogoutActions.Logout:
        if (window.history.state && window.history.state.state.local) {
          this.logout(this.getReturnUrl());
        } else {
          this.navigateToReturnUrl(this.getReturnUrl());
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          // this.setState({ isReady: true, message: 'The logout was not initiated from within the page.' });
        }
        break;
      case LogoutActions.LogoutCallback:
        this.processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        this.navigateToReturnUrl(this.getReturnUrl());
        break;
      default:
        this.navigateToReturnUrl(this.getReturnUrl());
    }

    this.populateAuthenticationState();
  }

  getReturnUrl(state?: any): string {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error('Invalid return url. The return url needs to have the same origin as the current page.');
    }
    return (state && state.returnUrl) || fromQuery || `${ReturnUrlStore.getUrl()}`;
  }

  getLoader(message: string) {
    return <Loader message={message} radius={AuthLoaderRadius} />;
  }

  async logout(returnUrl: string) {
    const state = { returnUrl };
    const isauthenticated = await authService.getAuthenticatedStatus();
    if (isauthenticated) {
      const result = await authService.signOut(state);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          break;
        case AuthenticationResultStatus.Success:
          await this.navigateToReturnUrl(returnUrl);
          break;
        case AuthenticationResultStatus.Fail:
          this.setState({ message: result.message });
          break;
        default:
          await this.navigateToReturnUrl(returnUrl);
      }
    } else {
      await this.navigateToReturnUrl(this.getReturnUrl());
    }
  }

  async processLogoutCallback() {
    const url = window.location.href;
    const result: any = await authService.completeSignOut(url);
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeAuthentication finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message });
        break;
      default:
        throw new Error('Invalid authentication result status.');
    }
  }

  async populateAuthenticationState() {
    await authService.getAuthenticatedStatus();
    this.setState({ isReady: true });
  }

  navigateToReturnUrl(returnUrl: string) {
    this.navigateToReturnUrl = this.navigateToReturnUrl.bind(this);
    return window.location.replace(returnUrl);
  }

  render() {
    const { isReady, message } = this.state;
    if (!isReady) {
      return this.getLoader('please wait...');
    }

    // else
    const { action } = this.props;
    switch (action) {
      case LogoutActions.Logout:
        return this.getLoader('signing out...');
      case LogoutActions.LogoutCallback:
        return this.getLoader('almost done...');
      case LogoutActions.LoggedOut:
        return this.getLoader(message);
      default:
        return this.getLoader('please wait...');
    }
  }
}
