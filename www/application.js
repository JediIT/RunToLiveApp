var application = angular.module('application', [
    /* --- Default --- */
    'ngTouch',
    'ngRoute',
    'leaflet-directive',
    /* --- Controllers --- */
    'cardControllers',
    'configuration'
]);

application.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        }).when('/addIncident', {
            templateUrl: 'views/addIncident.html',
            controller: 'cardController'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);

application.run(function ($rootScope, $location, $http, $templateCache, translate) {
    $rootScope.location = $location;
    $rootScope.cardID = null;
    document.addEventListener("deviceready", function () {
        $http.defaults.useXDomain = true;
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        $http.defaults.headers.common['Access-Control-Allow-Origin']='*';

        

        $rootScope.$on('$viewContentLoaded', function () {
            $templateCache.removeAll();
        });

        $rootScope.$on('$routeChangeStart', function () {
            // Keyboard.close();
        });

        $rootScope.getTranslate = function (section, index) {
            if (translate[$rootScope.language] && translate[$rootScope.language][section] && translate[$rootScope.language][section][index]) {
                return translate[$rootScope.language][section][index];
            }
        };

        document.addEventListener('backbutton', function (event) {
            navigator.app.backHistory();
        }, false);

        var push = PushNotification.init({
            android: {
                senderID: "412098334056",
                sound: true,
                vibrate: true
            },
            ios: {
                alert: true,
                badge: true,
                sound: true
            },
            windows: {}
        });

        push.on('registration', function (data) {
            $rootScope.deviceID = data.registrationId;
        });

        push.on('notification', function (data) {
            //alert(JSON.stringify(data));
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function (e) {
            // e.message
        });

    });

    document.addEventListener('deviceready', function () {
        //angular.element(document).ready(function () {
        //    angular.bootstrap(document);
        //});
        window.plugins.screensize.get(function (result) {
            $rootScope.height = result.width * 0.9;
        }, function (result) {
        });
        document.addEventListener('resume', function () {
            cordova.plugins.notification.local.cancelAll();
            window.moveView(false);
        }, false);

        document.addEventListener('offline', function () {
            angular.element(document.getElementsByClassName("notification")).attr('style', ' border:2px solid red;');
            document.getElementById('offline').style.display = 'block';
        }, false);

        document.addEventListener('online', function () {
            document.getElementById('offline').style.display = 'none';
        }, false);

        navigator.geolocation.getCurrentPosition(function (position) {
            window.global = {
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            };
        }, function () {
            $rootScope.infoShow('', $rootScope.getTranslate('notification.error', 2), true);
        });
    }, false);
});