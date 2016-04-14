angular.module('etwit')
    .controller('SidebarUsersController', ['$http', '$scope', '$rootScope', 'Socket', 'apiBaseUrl',
        function($http, $scope, $rootScope, Socket, apiBaseUrl) {
            $scope.users = null;
            $scope.selected = '';
            $scope.search = '';

            $scope.userFilter = function(user) {
                var regexp = new RegExp('^' + $scope.search, 'i');
                return (regexp.test(user.surname) || regexp.test(user.first_name));
            };

            var refresh = function() {
                $scope.users = null;
                $http.get(apiBaseUrl + '/users', {
                    params: {
                        online: ($scope.selected === 'online' ? 1 : ($scope.selected === 'offline' ? 0 : null))
                    }
                }).success(function(users) {
                    $scope.users = users;
                    $rootScope.$emit('sidebar-users-shown');
                });
            };

            ($scope.select = function(selected) {
                $scope.selected = selected;
                refresh();
            })('online');

            $scope.twitUser = function(uid) {
                $rootScope.$emit('twit-user', uid + ' '); // добавляем пробел, чтобы при клике на имя, не нужно было это делать вручную
            };

            Socket.on('user-offline', refresh);
            Socket.on('user-online', refresh);
        }
    ]);