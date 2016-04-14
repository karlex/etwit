/**
 * CTRL+ENTER hotkey
 */
angular.module('etwit')
    .directive('ctrlEnter', function () {
        return function (scope, element, attrs) {
            var ctrlIsPressed = false;

            element.bind('keydown', function(e) {
                if (e.which == 17) {
                    ctrlIsPressed = true;
                }
                else if (ctrlIsPressed && e.which == 13) {
                    ctrlIsPressed = false;
                    scope.$apply(function() {
                        scope.$eval(attrs.ctrlEnter);
                    });
                    e.preventDefault();
                }
            });

            element.on('keyup', function(e) {
                if (e.which == 17) {
                    ctrlIsPressed = false;
                }
            });
        };
    });