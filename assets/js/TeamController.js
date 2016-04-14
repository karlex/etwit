angular.module('etwit')
    .controller('TeamController', ['$scope', '$http', 'apiBaseUrl', function($scope, $http, apiBaseUrl) {
        $scope.users = [];
        $http.get(apiBaseUrl + '/users').success(function(users) {
            $scope.users = users;
            $('#spinner').hide();
        })
    }]);