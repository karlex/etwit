angular.module('etwit')
    .directive('sendTwitForm',
        ['$http', '$rootScope', 'apiBaseUrl', function($http, $rootScope, apiBaseUrl) {
            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'send-twit-form.html',
                controller: ['$scope', function($scope) {
                    $scope.message = '';
                    $scope.anonymous = false;
                    $scope.busy = false;
                    $scope.send = function() {
                        if ($scope.message && !$scope.busy) {
                            $scope.busy = true;
                            $http.post(apiBaseUrl + '/twit', {
                                message: $scope.message,
                                anonymous: ($scope.anonymous ? 1 : 0)
                            })
                                .success(function(data) {
                                    $scope.message = '';
                                    $rootScope.$emit('send-twit', data);
                                    $scope.busy = false;
                                })
                                .error(function() {
                                    $scope.busy = false;
                                    $('[data-remodal-id="send-twit-error"]').remodal({hashTracking: false}).open();
                                });
                        }
                    }
                }]
            }
        }]
    );