// Краткая и понятная презентация о том как тестировать с Protractor
// http://ramonvictor.github.io/protractor/slides/

// Установка Protractor:
// sudo npm install protractor -g
// sudo webdriver-manager update

// Запуск сервера:
// webdriver-manager start

// Запуск тестов:
// protractor test/e2e/config.js
// или
// protractor test/e2e/config.js --suite login // (см. suites)

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',

    capabilities: {
        'browserName': 'chrome'
    },

    // This can be changed via the command line as:
    // --params.login.username 'ngrocks'
    params: {
        login: {
            username: 'apushkin',
            password: 'pass4test',
            lastname: 'Пушкин'
        }
    },

    suites: {
        login: './login/*.spec.js',
        lent: './lent/*.spec.js'
    },

    jasmineNodeOpts: {
        showColors: true
    }
};