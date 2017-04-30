application.service('request', ["$rootScope", "$http", "$q", '$location', function ($rootScope, $http, $q, $location) {
    return {
        get: getMethod,
        post: postMethod
    };

    function getMethod(url) {
        return baseMethod('GET', url);
    }

    function postMethod(url, data) {
        return baseMethod('POST', url, data);
    }

    function baseMethod(method, _url, _data) {
        var defer = $q.defer();
        _data = _data ? _data : {};

        $http({
            method: method,
            data: _data,
            url: _url,
            contentType: 'application/json; charset=utf-8',
            responseType: 'json'
        }).then(function (response) {

            return defer.resolve(response);
        }, function (response) {
            return defer.reject(response);
        });
        return defer.promise;
    }
}]);