define('login_router', function(require, exports, module) {

'use strict';


var login = require("login_page/login/login");
var register = require("login_page/register/register");
var forgetPassWord = require("login_page/forgetPassWord/forgetPassWord");

var app = angular.module('RDash');
app.config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state("login", login)
     .state("register", register)
     .state("forgetPassWord",forgetPassWord);

    app.register = {
        controller: $controllerProvider.register
    };


})


});
