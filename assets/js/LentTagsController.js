function LentTagsController($http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location) {
    LentController.call(this, $http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location);
}

LentTagsController.prototype = Object.create(LentController.prototype);

LentTagsController.prototype.init = function($scope, $routeParams) {
    $scope.tags = $routeParams.tags.split(',').map(function(tag) {
        if (tag.substr(0, 1) === '@') {
            return tag;
        } else {
            return '#' + tag;
        }
    });
    $scope.sym = 'tags';
};

angular.module('etwit').controller(
    'LentTagsController',
    ['$http', '$scope', '$rootScope', 'Socket', 'UserAuth', '$routeParams', 'apiBaseUrl', '$location', LentTagsController]
);