(function() {
    $(document.body).on('click', '[data-remodal-target-id]', function(e) {
        e.preventDefault();
        var id = $(this).data('remodal-target-id');
        $('[data-remodal-id="' + id + '"]').remodal({hashTracking: false}).open();
    });

    var loadScript = function (url) {
        var def = $.Deferred(), script = document.createElement('script');
        script.src = url;
        script.onload = def.resolve.bind(def);
        document.body.appendChild(script);
        return def;
    };

    var loadSite = function () {
        if (window.angular) return false;
        loadScript('//ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular.min.js').done(function () {
            $.when(
                loadScript('//cdn.socket.io/socket.io-1.2.1.js'),
                loadScript('//ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular-route.min.js'),
                loadScript('//ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular-sanitize.min.js'),
                loadScript('/libs/ng-infinite-scroll.min.js'),
                loadScript('/js/main.min.js?v@@{{VERSION}}')
            ).done(function () {
                // Инициализация приложения!
                $('[ng-view]').html('');
                angular.bootstrap(document, ['etwit']);
            });
        });
    };

    if (window.localStorage.user || window.sessionStorage.user) {
        loadSite();
    } else {
        $('#login-view').show();
        $('#spinner').hide();
        var $form = $('[ng-controller="LoginController as login"]');
        $form.on('submit', function (e) {
            e.preventDefault();
            $('#spinner').show();
            $.post('https://api.etwit.net/auth/get-token', {
                username: $form.find('[ng-model="username"]').val(),
                password: $form.find('[ng-model="password"]').val(),
                remember: $form.find('[ng-model="remember"]').val()
            }, null, 'json')
            .done(function (user) {
                if ($form.find('[ng-model="remember"]').is(':checked')) {
                    window.localStorage.user = JSON.stringify(user);
                } else {
                    window.sessionStorage.user = JSON.stringify(user);
                }
                window.location.hash = '';
                loadSite();
            })
            .fail(function(event) {
                $('#spinner').hide();
                $('[data-remodal-id="auth-error-'+ event.status +'"]').remodal({
                    hashTracking: false
                }).open();
            });
        });
    }
})();