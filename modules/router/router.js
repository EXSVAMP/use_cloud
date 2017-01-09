'use strict';

/**
 * Route configuration for the RDash module.
 */
var login=require("login_page/login/login");
var register=require("login_page/register/register");
var manage=require("pages/manage/manage");
var regulation=require("pages/regulation/regulation");
var email=require("pages/email/email");
var project=require("pages/project/project");
var analysis=require("pages/analysis/analysis");
var subOrder=require("pages/subOrder/subOrder");
var myOrder=require("pages/myOrder/myOrder");

var app = angular.module('RDash');
app.config(function($stateProvider, $urlRouterProvider,$controllerProvider){
    var a=1234567890;
    console.log(a);
    $stateProvider.state('login', login)
        .state("register",register)
        .state("regulation",regulation)
        .state("manage",manage)
        .state("project",project)
        .state("analysis",analysis)
        .state("subOrder",subOrder)
        .state("myOrder",myOrder)
        .state("email",email);
    
    app.register = {
        controller: $controllerProvider.register
    };
})