function LentMessageController($http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location) {
    LentController.call(this, $http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location);
}

LentMessageController.prototype = Object.create(LentController.prototype);

LentMessageController.prototype.init = function($scope, $routeParams) {
    $scope.id = $routeParams.id;
};

angular.module('etwit').controller(
    'LentMessageController',
    ['$http', '$scope', '$rootScope', 'Socket', 'UserAuth', '$routeParams', 'apiBaseUrl', '$location', LentMessageController]
);