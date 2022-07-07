import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ApplicationPaths } from '../../../models/constants/authorization';
import authService from '../../../services/authorization/authorize.service';
import profileService from '../../../services/authorization/profile.service';
import facebookIcon from '../../assets/images/identityProviders/facebook-icon.png';
import googleIcon from '../../assets/images/identityProviders/google-icon.png';
import microsoftIcon from '../../assets/images/identityProviders/microsoft-icon.png';
import twitterIcon from '../../assets/images/identityProviders/twitter-icon.png';
import dummyImage1 from '../../assets/images/profileImages/dummy1.png';
import dummyImage2 from '../../assets/images/profileImages/dummy2.png';
import ReturnUrlStore from '../../stores/loginStore/returnUrl';
import pageHeaderStyles from '../sharedComponents/PageHeader/pageHeader.module.scss';
import loginStyle from './loginAvatar.module.scss';

interface ILoginAvatarState {
  isAuthenticated: boolean;
  email: string;
  fullName: string;
  profilePicture: string;
  identityProvider: string;
  isOpen: boolean;
}

export default class LoginAvatar extends Component<any, ILoginAvatarState> {
  authSubscription: number;
  subscribed = false;
  containerRef: any = null;
  position = { top: 0, left: 0 };

  constructor(props: any) {
    super(props);

    this.state = {
      isAuthenticated: false,
      email: '',
      fullName: '',
      identityProvider: '',
      profilePicture: this.profilePicture('dummy1'),
      isOpen: false,
    };
    this.containerRef = React.createRef();
    this.handleOpenOnClick = this.handleOpenOnClick.bind(this);
    this.handleCloseEsc = this.handleCloseEsc.bind(this);
    this.handleCloseMouseClick = this.handleCloseMouseClick.bind(this);
    this.handleCloseEvent = this.handleCloseEvent.bind(this);
    this.handleAuthenticationStateChange = this.handleAuthenticationStateChange.bind(this);
  }

  componentDidMount() {
    this.authSubscription = authService.subscribe(() => this.handleAuthenticationStateChange());
    this.handleAuthenticationStateChange();
    ReturnUrlStore.setUrl();
  }

  componentWillUnmount() {
    this.unsubscribe(); // we do this in case the close event was not raised before the component unmounts
    authService.unsubscribe(this.authSubscription);
  }

  async handleSessionState(authenticated: boolean) {
    if (authenticated) {
      console.log('SIGN IN');
    } else {
      console.log('SIGN OUT');
    }
  }

  handleOpenOnClick() {
    const avatar: any = document.getElementsByClassName(loginStyle.picture_small);
    if (avatar.length) {
      this.position.left = this.getXPos(avatar[0]);
      this.position.top = avatar[0].offsetTop + 40;
    }
    this.subscribe();
    this.setState({ isOpen: true });
  }

  handleCloseEvent() {
    this.unsubscribe();
    this.setState({ isOpen: false });
  }

  handleCloseMouseClick(e: any) {
    const { isOpen } = this.state;
    if (isOpen && this.containerRef && !this.containerRef.current.contains(e.target)) {
      this.handleCloseEvent();
    }
  }

  handleCloseEsc(e: any) {
    const { isOpen } = this.state;
    if (isOpen && e.keyCode === 27) {
      this.handleCloseEvent();
    }
  }

  async handleAuthenticationStateChange() {
    let profilePicture = this.profilePicture('dummy1');
    let identityProvider = '';
    let fullName = '';
    let email = '';

    const user = await authService.getUser();
    const isAuthenticated = !!user && !user.expired && !!user.profile;
    this.handleSessionState(isAuthenticated); // async, we are not waiting...
    if (isAuthenticated) {
      const profile = user.profile;
      const [userProfile, picture] = await Promise.all([
        profileService.getProfile(profile.sub),
        profileService.getPicture(profile.sub),
      ]);
      profilePicture = picture || (userProfile && userProfile.picture) || this.profilePicture('dummy2');
      fullName = userProfile && userProfile.fullName;
      email = (userProfile && userProfile.email) || profile.name;
      identityProvider = profile.idp.toLowerCase();
    }
    this.setState({ isAuthenticated, email, identityProvider, fullName, profilePicture });
  }

  getXPos(avatar: HTMLElement) {
    function getScrollLeft() {
      if (typeof window.pageXOffset !== 'undefined') {
        return window.pageXOffset;
      }
      if (document.documentElement.scrollLeft) {
        return document.documentElement.scrollLeft;
      }
      if (document.body.scrollLeft) {
        return document.body.scrollLeft;
      }
      return 0;
    }

    function getDocWidth() {
      const documentBody = document.body;
      const scrollLeft = getScrollLeft();
      const docwidth = document.all
        ? scrollLeft + documentBody.clientWidth
        : window.pageXOffset + window.innerWidth - 15;

      return docwidth;
    }

    const popupWidth = 300;
    const docwidth = getDocWidth();

    let xcoord = avatar.offsetLeft;
    const rightEdge = xcoord + popupWidth;
    if (rightEdge >= docwidth) {
      xcoord = docwidth - popupWidth;
      if (xcoord < 0) {
        xcoord = 0;
      }
    }

    return xcoord;
  }

  subscribe() {
    if (!this.subscribed) {
      this.subscribed = true;
      document.addEventListener('keydown', this.handleCloseEsc, false);
      document.addEventListener('click', this.handleCloseMouseClick, false);
      window.addEventListener('resize', this.handleCloseEvent, false);
    }
  }

  unsubscribe() {
    if (this.subscribed) {
      this.subscribed = false;
      document.removeEventListener('keydown', this.handleCloseEsc, false);
      document.removeEventListener('click', this.handleCloseMouseClick, false);
      window.removeEventListener('resize', this.handleCloseEvent, false);
    }
  }

  identityProviderIcon(provider: string) {
    switch (provider) {
      case 'google':
        return googleIcon;
      case 'twitter':
        return twitterIcon;
      case 'facebook':
        return facebookIcon;
      case 'microsoft':
        return microsoftIcon;
      default:
        return '';
    }
  }

  profilePicture(name: string) {
    return name === 'dummy1' ? dummyImage1 : dummyImage2;
  }

  /* eslint-disable class-methods-use-this */
  authenticatedView(profilePath: string, logoutPathInfo: any) {
    const { top, left } = this.position;
    const { email, fullName, profilePicture, identityProvider, isOpen } = this.state;
    const idpPicture = identityProvider && this.identityProviderIcon(identityProvider);
    const title = identityProvider && `identity provided by ${identityProvider}`;
    return (
      <>
        <div ref={this.containerRef} className={pageHeaderStyles.signIn_wrapper}>
          <div className={loginStyle.picture_small} onClick={this.handleOpenOnClick}>
            <img src={profilePicture} alt='' />
          </div>
          {isOpen && (
            <div
              className={loginStyle.popup}
              style={{
                top: `${top}px`,
                left: `${left}px`,
              }}
            >
              <div className={loginStyle.signout}>
                <Link to={logoutPathInfo}>Sign Out</Link>
              </div>
              <div className={loginStyle.picture_medium}>
                <img src={profilePicture} alt='' />
              </div>
              <div className={loginStyle.identity_provider} title={title}>
                <img src={idpPicture} alt='' />
              </div>
              <div className={loginStyle.info}>
                <div>
                  <Link className={loginStyle.fullname} to={profilePath}>
                    {fullName}
                  </Link>
                </div>
                <div className={loginStyle.username}>
                  <Link to={profilePath}>{email}</Link>
                </div>
              </div>
              <div className={loginStyle.profile}>
                <Link to={profilePath}>View Profile</Link>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  anonymousView(registerPath: string, loginPath: string) {
    const { top, left } = this.position;
    const { profilePicture, isOpen } = this.state;
    const tooltip = 'Signin to access saved designs';
    return (
      <>
        <div ref={this.containerRef} className={pageHeaderStyles.signIn_wrapper}>
          <div className={loginStyle.picture_small} onClick={this.handleOpenOnClick} title={tooltip}>
            <img src={profilePicture} alt='' />
          </div>
          {isOpen && (
            <div
              className={loginStyle.popup}
              style={{
                top: `${top}px`,
                left: `${left}px`,
              }}
            >
              <div className={loginStyle.signin}>
                <Link to={loginPath}>Sign In</Link>
              </div>
              <div className={loginStyle.picture_medium}>
                <img src={profilePicture} alt='' />
              </div>
              <div className={loginStyle.info}>Not Signed In</div>
              <div className={loginStyle.register}>
                <Link to={registerPath}>Create Account</Link>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    }

    // else
    const profilePath = `${ApplicationPaths.Profile}`;
    const logoutPathInfo = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
    return this.authenticatedView(profilePath, logoutPathInfo);
  }
}
