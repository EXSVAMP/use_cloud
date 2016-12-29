'use strict';

/**
 * Route configuration for the RDash module.
 */
var login=require("login_page/login/login");
var register=require("login_page/register/register")
var app = angular.module('RDash');
app.config(function($stateProvider, $urlRouterProvider,$controllerProvider){
    var a=1234567890;
    console.log(a);
    $stateProvider.state('login', login)
        .state("register",register);
    
    app.register = {
        controller: $controllerProvider.register
    };
})