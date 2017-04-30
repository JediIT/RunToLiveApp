application.service('$map', ["$rootScope", "$http", "$q", '$location', 'request', function ($rootScope, $http, $q, $location, request) {

    var _position;
    var _markers=[];
    function updatePosition() {
        navigator.geolocation.getCurrentPosition(function (position) {
            _position = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            _markers = window.localStorage.getItem('markers');
            if (typeof _markers != typeof undefined)
                _markers = [{ lat: _position.latitude, lng: _position.longitude }];
        }, function () {
            $rootScope.infoShow('', $rootScope.getTranslate('notification.error', 2), true);
        });
    };
    updatePosition();

    function addMarker(_lat, _lng) {
        request.post('http://runtolive.info/api/points/add', {
            userId: 1,
            lat: _lat,
            lon: _lng,
            radius: 500,
            typeId: 1,
            photoId: 1
        }).then(function (response) {
            request.get('http://runtolive.info/api/points/get', {
                lat: _position.latitude,
                lon: _position.longitude,  
                radius: 500
            }).then(function (response) {
                $rootScope.markers = response.data;
            }, function (response) { });
        }, function (response) { });
        window.localStorage.removeItem('markers');
        window.localStorage.setItem('markers', _markers);
        _markers = window.localStorage.getItem('markers');
    }
    function removeMarker(index) {
        _markers.splice(index, 1);
        window.localStorage.removeItem('markers');
        window.localStorage.setItem('markers', _markers);
        _markers = window.localStorage.getItem('markers');
    }
    return {
        position: function () {
            updatePosition();
            return _position;
        },
        markers: function () { return _markers },
        add: addMarker,
        remove: removeMarker
    };
}]);