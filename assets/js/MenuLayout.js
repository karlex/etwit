angular.module('etwit')
    .directive('menuLayout', ['UserAuth', '$rootScope', function(UserAuth, $rootScope) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                active: '@' // активный элемент меню
            },
            templateUrl: 'menu_layout.html',
            link: function (scope, element, attrs) {
                scope.user = UserAuth.getCurrentUser();

                scope.logout = function() {
                    UserAuth.logout();
                };

                $rootScope.$on('send-twit', function() {
                    var remodal = $.remodal.lookup[$('[data-remodal-id="write-twit"]').data('remodal')];
                    if (remodal) {
                        remodal.close();
                    }
                });
            }
        };
    }]);