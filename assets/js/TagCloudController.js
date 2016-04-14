angular.module('etwit')
    .controller('TagCloudController', ['$scope', '$http', '$rootScope', 'Socket', 'apiBaseUrl',
        function($scope, $http, $rootScope, Socket, apiBaseUrl) {
            $scope.collapsed = true;
            $scope.tags = null;

            $scope.toggle = function() {
                $scope.collapsed = !$scope.collapsed;
            };

            $scope.apply = function(tag) {
                $rootScope.$emit('append-tag', tag);
            };

            ($scope.refresh = function() {
                $http.get(apiBaseUrl + '/tags').success(function(data) {
                    if (Array.isArray(data)) {
                        $scope.tags = data;
                    }
                    $rootScope.$emit('tag-cloud-shown');
                });
            })();

            Socket.on('twit-new', $scope.refresh);
        }
    ]);