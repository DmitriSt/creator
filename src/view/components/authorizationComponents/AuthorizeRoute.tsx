import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { ApplicationPaths, AuthLoaderRadius, QueryParameterNames } from '../../../models/constants/authorization';
import authService from '../../../services/authorization/authorize.service';
import Loader from '../sharedComponents/Loader/Loader';

interface IAuthorizeRouteProps {
  component: Component;
  path: string;
}

interface IAuthorizeRouteState {
  ready: boolean;
  authenticated: boolean;
}

export default class AuthorizeRoute extends Component<IAuthorizeRouteProps, IAuthorizeRouteState> {
  subscription: any;

  constructor(props: IAuthorizeRouteProps) {
    super(props);

    this.state = {
      ready: false,
      authenticated: false,
    };
  }

  componentDidMount() {
    this.subscription = authService.subscribe(() => this.authenticationChanged());
    this.populateAuthenticationState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this.subscription);
  }

  getLoader(message: string) {
    return <Loader message={message} radius={AuthLoaderRadius} />;
  }

  async populateAuthenticationState() {
    const authenticated = await authService.getAuthenticatedStatus();
    this.setState({ ready: true, authenticated });
  }

  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }

  render() {
    const { ready, authenticated } = this.state;
    const link = document.createElement('a');
    link.href = this.props.path;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
    if (!ready) {
      return this.getLoader('just a sec...');
    }
    const { component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) => {
          if (authenticated) {
            return <Component {...props} />;
          }
          return <Redirect to={redirectUrl} />;
        }}
      />
    );
  }
}
