var EtwitLoginPage = function() {
    this.usernameInput = element(by.model('username'));
    this.passwordInput = element(by.model('password'));
    this.loginButton = element(by.partialButtonText('Войти'));

    this.open = function() {
        // TODO browser.config.baseUrl
        return browser.get('http://localhost:9000/login');
    }
};
module.exports = EtwitLoginPage;