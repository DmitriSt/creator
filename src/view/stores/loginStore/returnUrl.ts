export default class ReturnUrl {
  private static getKey() {
    return 'login-returnurl';
  }

  static getUrl() {
    return localStorage.getItem(ReturnUrl.getKey()) || '';
  }

  static setUrl() {
    localStorage.setItem(ReturnUrl.getKey(), window.location.href);
  }
}
