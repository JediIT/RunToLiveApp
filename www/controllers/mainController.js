application.controller('mainController', [
    '$rootScope', '$scope', '$window', '$location', '$route', '$http', 'server', 'request', '$map', '$camera',
    function ($rootScope, $scope, $window, $location, $route, $http, server, request, $map, $camera) {
        $rootScope.screenWidth = window.screen.width;
        $scope.position = {
            latitude: 46,
            longitude:48
        };
   
        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.position.latitude = pos.coords.latitude;
            $scope.position.longitude = pos.coords.longitude;

            request.post('http://runtolive.info/api/points/get', {
                lat: $scope.position.latitude,
                lon: $scope.position.longitude,
                radius: 500
            }).then(function (response) {
                $rootScope.markers = response.data;
            }, function (response) { });
        }, function () {
            $rootScope.infoShow('', $rootScope.getTranslate('notification.error', 2), true);
        });

        angular.extend($scope, {
            here: {
                lat: $scope.position.latitude,
                lng: $scope.position.longitude,
                zoom: 8
            },
            events: {},
            tiles: {
                url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
            },
            markers: $rootScope.markers,
            events: {
                map: {
                    enable: ['click'],
                    logic: 'emit'
                }
            }
        });

        window.moveView = $rootScope.moveView = function (status) {
            angular.element(document.querySelectorAll('[ng-view]')).css({
                top: status ? '-25%' : '0%'
            });
        };
        $rootScope.push = function (header, body) {
            cordova.plugins.notification.local.schedule({
                id: 1,
                title: header,
                text: body
            });
        };
        $rootScope.showSideBar = function () {
            angular.element(document.getElementsByClassName("view")).attr('style', ' position:absolute;');
        }
        $rootScope.showSideBar = function () {
            angular.element(document.getElementsByClassName("view")).attr('style', ' position:relative;');
        }

        $rootScope.backHistory = function () {
            $window.history.back();
        };
        window.setInterval(function () {
            request.post('http://runtolive.info/api/points/ping', {
                lat: $scope.position.latitude,
                lon: $scope.position.longitude,
                radius: 500
            }).then(function (response) {
                if (response.lenght != 0)
                    cordova.plugins.notification.local.schedule({
                        id: 1,
                        title: "Attention",
                        text: "Be careful!Save your life"
                    });
            }, function (response) {

            });
        }, 30000);
        $rootScope.takePhoto = function () {
            $camera.createPhoto();
        }
        //==========Окна=========

        $rootScope.preloader = false;
        $rootScope.preloaderShow = function (show) {
            if (show) {
                $rootScope.preloader = true;
                return;
            }
            $rootScope.preloader = false;
        };

        $rootScope.info = false;
        $rootScope.infoShow = function (header, body, error, time) {
            time = time ? time : 1000;
            $rootScope.info = true;
            $rootScope.infoHeader = header;
            $rootScope.infoBody = body;

            if (error)
                angular.element(document.getElementsByClassName("notification")).attr('style', ' border:2px solid red;');
            else
                angular.element(document.getElementsByClassName("notification")).attr('style', ' border:2px solid green;');

            $timeout(function () {
                $rootScope.infoHeader = '';
                $rootScope.infoBody = '';
                $rootScope.info = false;
            }, 1000);

            //window.setTimeout(function () {
            //    $rootScope.infoHeader = '';
            //    $rootScope.infoBody = '';
            //    $rootScope.info = false;
            //}, 1000);
        };

        $scope.$on('leafletDirectiveMap.click', function (event, args) {
            $map.add(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
            angular.extend($scope, {
                markers: $map.markers()
            });
        });
    }
]);

application.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 9) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});