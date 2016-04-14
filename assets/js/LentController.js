function LentController($http, $scope, $rootScope, Socket, UserAuth, $routeParams, apiBaseUrl, $location) {
    $scope.tags = [];
    $scope.newTwits = [];
    $scope.twits = [];
    $scope.selectedFeedTab = 'all';
    $scope.busy = false;
    $scope.path = 'tags';
    $scope.sym = 'lent';
    var limit = 20;

    this.init($scope, $routeParams);

    $scope.nextPage = function() {
        if ($scope.busy) return;
        $scope.busy = true;

        var offset = $scope.twits.length + $scope.newTwits.length;

        queryTwits(offset).success(function(twits) {
            if (twits.length > 0) {
                $scope.twits = $scope.twits.concat(twits);
                offset += limit;
            }
            $scope.busy = false;
        });
    };

    $scope.formatTime = function(time) {
        return moment(time).fromNow(true);
    };

    $scope.existsTag = function(tag) {
        return $scope.tags.indexOf(tag) >= 0;
    };

    function applyTags() {
        var url = '/' + $scope.path + '/' + $scope.tags.map(function(tag) {
            if (tag.substr(0, 1) === '#') {
                return tag.substr(1);
            } else {
                return tag;
            }
        }).join(',');

        if ($location.path().indexOf($scope.path) === 1) {
            //history.pushState(null, '', url);
            $scope.refresh();
        } else {
            $location.path(url);
        }
    }

    $scope.removeTag = function(index) {
        $scope.tags.splice(index, 1);
        applyTags();
        //$scope.refresh();
    };

    $scope.filterTag = function(tag) {
        console.log($scope.sym);
        if (tag.length > 1) {
            var tagIndex = $scope.tags.indexOf(tag);
            console.log('filter', this, tag, tagIndex);
            if (tagIndex < 0) {
                $scope.tags.push(tag);
                applyTags();
                //$scope.refresh();
            } else {
                $scope.removeTag(tagIndex);
            }
        }
    };

    $scope.showNew = function() {
        $scope.twits = $scope.newTwits.concat($scope.twits);
        $scope.newTwits = [];
    };

    $rootScope.$on('twit-user', function(event, uid) {
        $('[ng-model="message"]').val('@' + uid).focus();
    });

    var queryTwits = function(offset) {
        var params;
        if ($scope.id) {
            params = {id: $scope.id};
        } else {
            params = {tags: [], users: [], offset: offset, limit: limit};
            for (var i = 0; i < $scope.tags.length; i++) {
                var tag = $scope.tags[i];
                if (tag[0] === '#') {
                    params.tags.push(tag.substr(1));
                } else if (tag[0] === '@') {
                    params.users.push(tag.substr(1));
                }
            }

            // Костыль для вкладки "Ответы"
            if ($scope.selectedFeedTab === 'answers') {
                params.noticed_users = [UserAuth.getCurrentUser().uid];
            }
        }

        return $http.get(apiBaseUrl + '/twit', {params: params});
    };

    var defLent = ($scope.refresh = function() {
        $scope.newTwits = [];
        $scope.twits = [];
        document.body.scrollTop = 0;
        $scope.nextPage();
    })();

    $rootScope.$on('send-twit', function(event, twit) {
        $scope.twits.unshift(twit);
    });

    function onNewTwit() {
        return queryTwits(0).success(function(twits) {
            // Оставляем только новые твиты
            if ($scope.twits.length > 0) {
                var count = 0;
                for (var i = 0; i < twits.length; i++) {
                    if (twits[i].id == $scope.twits[0].id) {
                        count = i;
                        break;
                    }
                }
                twits = twits.splice(0, count);
            }
            // Добавляем новые твиты...
            if (twits.length > 0) {
                var offset = $(window).scrollTop() - $('.feed').offset().top;
                // ... под плашку
                if (offset > 100 || $scope.newTwits.length > 0) {
                    $scope.newTwits = twits.concat($scope.newTwits);
                }
                // ... в ленту
                else {
                    $scope.twits = twits.concat($scope.twits);
                    $scope.newTwits = [];
                }
            }
        });
    }

    var lastNewTwitsPromise = null;
    Socket.on('twit-new', function (twit) {
        if (twit.author.id != UserAuth.getCurrentUser().id) {
            lastNewTwitsPromise = $.when(lastNewTwitsPromise).done(onNewTwit);
        }
    });

    $rootScope.$on('append-tag', function(event, tag) {
        $scope.filterTag(tag);
    });

    var defTagCloud = new $.Deferred();
    $rootScope.$on('tag-cloud-shown', function() {
        if (defTagCloud.state() !== "resolved") {
            defTagCloud.resolve();
        }
    });

    var defSidebarUsers = new $.Deferred();
    $rootScope.$on('sidebar-users-shown', function() {
        if (defSidebarUsers.state() !== "resolved") {
            defSidebarUsers.resolve();
        }
    });

    jQuery.when(defLent, defTagCloud, defSidebarUsers).done(function() {
        $('#spinner').hide();
    });
}

LentController.prototype.init = function() {};

angular.module('etwit')
    .controller(
        'LentController',
        ['$http', '$scope', '$rootScope', 'Socket', 'UserAuth', '$routeParams', 'apiBaseUrl', '$location', LentController]
    );