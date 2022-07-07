import React, { Component } from 'react';

import {
  ApplicationPaths,
  AuthenticationResultStatus,
  AuthLoaderRadius,
  LoginActions,
  QueryParameterNames,
} from '../../../models/constants/authorization';
import authService from '../../../services/authorization/authorize.service';
import ReturnUrlStore from '../../stores/loginStore/returnUrl';
import Loader from '../sharedComponents/Loader/Loader';

interface ILoginProps {
  readonly action: string;
}

interface ILoginState {
  message: string | undefined | null;
}

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export default class Login extends Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      message: undefined,
    };
  }

  componentDidMount() {
    const { action } = this.props;
    let params;
    let error;
    switch (action) {
      case LoginActions.Login:
        this.login(this.getReturnUrl());
        break;
      case LoginActions.LoginCallback:
        this.processLoginCallback();
        break;
      case LoginActions.Continue:
        this.navigateToReturnUrl(this.getReturnUrl());
        break;
      case LoginActions.LoginFailed:
        params = new URLSearchParams(window.location.search);
        error = params.get(QueryParameterNames.Message);
        this.setState({ message: error });
        break;
      case LoginActions.Profile:
        this.redirectToProfile();
        break;
      case LoginActions.Register:
        this.redirectToRegister();
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }

  getReturnUrl(state?: any) {
    this.getReturnUrl = this.getReturnUrl.bind(this);
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

  async login(returnUrl: string) {
    const state = { returnUrl };
    const result: any = await authService.signIn(state);
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
        throw new Error(`Invalid status result ${result.status}.`);
    }
  }

  async processLoginCallback() {
    const url = window.location.href;
    const result: any = await authService.completeSignIn(url);
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeSignIn finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message });
        break;
      default:
        throw new Error(`Invalid authentication result status '${result.status}'.`);
    }
  }

  redirectToRegister() {
    this.redirectToApiAuthorizationPath(
      `${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`
    );
  }

  redirectToProfile() {
    this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
  }

  redirectToApiAuthorizationPath(apiAuthorizationPath: string) {
    this.redirectToApiAuthorizationPath = this.redirectToApiAuthorizationPath.bind(this);
    const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
    // It's important that we do a replace here so that when the user hits the back arrow on the
    // browser they get sent back to where it was on the app instead of to an endpoint on this
    // component.
    window.location.replace(redirectUrl);
  }

  navigateToReturnUrl(returnUrl: string) {
    this.navigateToReturnUrl = this.navigateToReturnUrl.bind(this);
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl);
  }

  render() {
    const { action } = this.props;
    const { message } = this.state;

    if (message) {
      return this.getLoader(message);
    }

    // else
    switch (action) {
      case LoginActions.Login:
        return this.getLoader('preparing to sign in...');
      case LoginActions.LoginCallback:
        return this.getLoader('almost done...');
      case LoginActions.Continue:
        return this.getLoader('almost done...');
      case LoginActions.Profile:
        return this.getLoader('loading your profile...');
      case LoginActions.Register:
        return this.getLoader('preparing to register you...');
      default:
        return this.getLoader('please wait...');
    }
  }
}
