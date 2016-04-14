angular.module('etwit')
    .filter("fromNow", function () {
        return function (value) {
            return moment(value).fromNow();
        }
    });