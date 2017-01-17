define('router', function(require, exports, module) {

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
var category=require("pages/category/category");//类别管理
var identity=require("pages/identity/identity");//身份管理
var strategy=require("pages/strategy/strategy");//策略管理

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
        .state("email",email)
        .state("category",category)
        .state("identity",identity)
        .state("strategy",strategy);
    
    app.register = {
        controller: $controllerProvider.register
    };
})

});
