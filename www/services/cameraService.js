application.service('$camera', ["$rootScope", "$http", "$q", '$location', function ($rootScope, $http, $q, $location) {
    return {
        createPhoto: CreatePhoto
    };

    function CreatePhoto() {
        navigator.camera.getPicture(
            function (imageURI) {
                alert(imageURI);
                angular.element(document.getElementsByClassName("photo")).attr('background', 'url('+imageURI+') no-repeat 50% 50%;');
        },
            function () {

            });
    }
}]);