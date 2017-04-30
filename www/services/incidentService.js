application.service('$incidents', ["$rootScope", "$http", "$q", '$location', function ($rootScope, $http, $q, $location) {
    return {

        add: addIncident,
        get: getIncident
    };

    function addIncident() {
       
    };
    function getIncident() {

    };
}]);