angular.module('etwit')
    .directive('twitMessage', ['$compile', function($compile) {
        return {
            required: 'LentController',
            restrict: 'E',
            scope: {
                message: '='
            },
            link: function (scope, element) {
                element.html(
                    scope.message
                        .replace(
                            /(#[a-zA-Zа-яА-ЯёЁ_]+)/gi,
                            '<span class="hash" ng-click="filterTag(\'$1\')" ' +
                                'ng-class="{highlight: existsTag(\'$1\')}">$1</span>'
                        ).replace(
                            /(@[a-zA-Zа-яА-ЯёЁ_]+)/gi,
                            '<span class="private" ng-click="filterTag(\'$1\')" ' +
                                'ng-class="{highlight: existsTag(\'$1\')}">$1</span>'
                        ).replace(
                            /(https?:\/\/([^\/:\t\r\n&#\? \x00]+\/?)+([?]([^\/:\t\r\n&#\? \xA0]+&?)*)?(#[^\/:\t\r\n&#\? \xA0]*)?)/gi,
                            function(match, p1, p2) {
                                if (p2.indexOf('etwit.net') > 0) {
                                    return '<a href="' + p1 + '">' + p1 + '</a>';
                                } else {
                                    return '<a href="' + p1 + '" target="_blank">' + p1 + '</a>';
                                }
                            }
                        )
                );

                $compile(element.contents())(scope.$parent);
            }
        };
    }]);