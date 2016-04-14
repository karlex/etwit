var EtwitLoginPage = require('./login.po.js');

describe('Etwit login page', function() {
    it('should login and then contain user lastname', function() {
        var loginParams = browser.params.login,
            loginPage = new EtwitLoginPage();

        loginPage.open();
        loginPage.usernameInput.sendKeys(loginParams.username);
        loginPage.passwordInput.sendKeys(loginParams.password);
        loginPage.loginButton.click();

        browser.wait(function() {
            return element(by.binding('user.surname')).isPresent();
        }, 1000);

        // TODO: разобраться
//        browser.wait(function() {
//            var deferred = protractor.promise.defer();
//            element(by.binding('user.surname')).isPresent()
//                .then(function (isPresent) {
//                    deferred.fulfill(!isPresent);
//                });
//            return deferred.promise;
//        }, 1000);

        //expect(surname.getText()).toEqual(loginParams.lastname);
    });
});