angular.module('etwit')
    .controller('LoginController', ['UserAuth', '$scope', '$location',
        function(UserAuth, $scope, $location) {
            $scope.username = '';
            $scope.password = '';
            $scope.remember = '';
            $scope.errorMessage = '';

            $('#spinner').hide();

            $scope.login = function() {
                $('#spinner').show();
                UserAuth.login($scope.username, $scope.password, $scope.remember)
                .success(function() {
                    $location.path('/');
                })
                .error(function(message, status) {
                    $('#spinner').hide();
                    $('[data-remodal-id="auth-error-'+ status +'"]').remodal().open();
                });
            };
        }
    ]);