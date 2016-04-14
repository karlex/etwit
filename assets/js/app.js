// For prevent CORS run Chrome by follow command:
// open -a /Applications/Google\ Chrome.app/ --args --disable-web-security

angular.module('etwit', ['ngRoute', 'ngSanitize', 'infinite-scroll'])
    .value('apiBaseUrl', 'https://api.etwit.net')
    .factory('httpErrorResponseInterceptor', ['$q', '$location', '$window',
        function($q, $location, $window) {
            return {
                request: function (config) {
                    // Токен нужно отправлять только на указанный домен, иначе могут возникнуть проблемы,
                    // например, при запросе шаблонов с другого домена
                    if (
                        /^https?:\/\/api\.etwit./.test(config.url) &&
                        ($window.localStorage.user || $window.sessionStorage.user)
                    ) {
                        var user = JSON.parse($window.localStorage.user || $window.sessionStorage.user);
                        if (user && user.access_token) {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + user.access_token;
                        }
                    }
                    return config;
                },
                response: function(responseData) {
                    return responseData;
                },
                responseError: function error(response) {
                    switch (response.status) {
                        case 401:
                            $location.path('/login');
                            break;
                    }

                    return $q.reject(response);
                }
            };
        }
    ])
    .config(['$httpProvider', '$routeProvider', '$locationProvider', '$compileProvider',
        function($httpProvider, $routeProvider, $locationProvider, $compileProvider) {
            $httpProvider.interceptors.push('httpErrorResponseInterceptor');

            $locationProvider.html5Mode(true);

            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype):/);

            // TODO: разобраться с настройками сервера и этими параметрами
            //$httpProvider.defaults.withCredentials = true;
            //$httpProvider.defaults.headers.Authorization = 'Basic YXB1c2hraW46cGFzczR0ZXN0==';

            $routeProvider
                .when('/', {
                    templateUrl: 'lent.html',
                    controller: 'LentController'
                })
                .when('/message/:id', {
                    templateUrl: 'lent.html',
                    controller: 'LentMessageController'
                })
                .when('/tags/:tags', {
                    templateUrl: 'lent.html',
                    controller: 'LentTagsController'
                })
                .when('/answers/:tags?', {
                    templateUrl: 'lent.html',
                    controller: 'LentAnswersController'
                })
                .when('/login', {
                    templateUrl: 'login.html'
                })
                .when('/about', {
                    templateUrl: 'about.html',
                    controller: function() {
                        $('#spinner').hide();
                    }
                })
                .when('/team', {
                    templateUrl: 'team.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ])
    .run(['$rootScope', function($rootScope) {
        $rootScope.$on('$routeChangeStart', function() {
            $('#spinner').show();
        });
    }]);