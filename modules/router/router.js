'use strict';

/**
 * Route configuration for the RDash module.
 */
var login=require("login_page/login/login");

var app = angular.module('RDash');
app.config(function($stateProvider, $urlRouterProvider,$controllerProvider){
    var a=1234567890;
    console.log(a);
    $stateProvider.state('login', login);


    app.register = {
        controller: $controllerProvider.register
    };
})