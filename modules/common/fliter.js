var app = angular.module('RDash');

app.filter("img", function () {
    return function (img) {
        return 'http://'+img;
    }
});