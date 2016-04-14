function LentAnswersController($http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location) {
    LentController.call(this, $http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location);
}

LentAnswersController.prototype = Object.create(LentController.prototype);

LentAnswersController.prototype.init = function($scope, $routeParams) {
    if ($routeParams.tags) {
        LentTagsController.prototype.init($scope, $routeParams);
    }
    $scope.selectedFeedTab = 'answers';
    $scope.path = 'answers';
};

angular.module('etwit').controller(
    'LentAnswersController',
    ['$http', '$scope', '$rootScope', 'Socket', 'UserAuth', '$routeParams', 'apiBaseUrl', '$location', LentAnswersController]
);