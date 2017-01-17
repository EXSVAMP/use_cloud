define('login_main', function(require, exports, module) {

angular.module("RDash", ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngDialog'])
require('login_router');
require('interceptor');
require('common/constant');
require('common/service/utils')
var app = angular.module('RDash');


app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});

app.controller("MasterCtrl", function ($scope,$cookieStore) {
    
    window.onresize = function () {
        $scope.$apply();
    }
});

app.service("baseUrl",function(constant){
    var url=constant.url;
    // var url="http://172.16.83.149:9011";
    return {
        getUrl:function(){
            return url;
        }
    }
})

});
