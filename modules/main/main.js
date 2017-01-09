angular.module("RDash",['ui.bootstrap','ui.router','ngCookies','ngDialog','cgBusy','truncate','ui.select','ngSanitize','angular-loading-bar','ngAnimate']);
require('router');
require('common/constant');
require('common/service/utils');





/**
 * Master Controller
 */
var app = angular.module('RDash');


app.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

app.service("baseUrl",function(constant){
    var url=constant.url;
    return {
        getUrl:function(){
            return url;
        }
    }
}).service("url_junction", function(){
    return {
        getQuery:function(dic){
            var query_url = '';
            for(var i in dic){
                if(dic[i] && dic[i]!='-1'){
                    if(query_url==""){
                        query_url+="?"+i+"="+dic[i]
                    }else{
                        query_url+="&"+i+"="+dic[i]
                    }
                }
            }
            return query_url
        },
        getDict:function(dic){
            var ret_dic = {};
            for(var i in dic){
                if(dic[i] && dic[i]!='-1'){
                    ret_dic[i] = dic[i];
                }
            }
            return ret_dic;
        }
    }
});

app.factory('HttpInterceptor', ['$q','$injector',HttpInterceptor]);
function HttpInterceptor($q, $injector) {
    return {
        request: function(config){
            return config;
        },
        requestError: function(err){
            return $q.reject(err);
        },
        response: function(res){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(res.data.code){
                if(res.data.code!='200'){
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">错误信息：' + res.data.message + '</p>',
                        plain: true
                    });
                };

            }
            return res;
        },
        responseError: function(err){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(-1 === err.status) {
                // 远程服务器无响应
                // ngDialog.open({
                //     template:'<p style=\"text-align: center\">远程服务器无响应</p>',
                //     plain:true
                // });
            } else if(500 === err.status) {
                // 处理各类自定义错误
                ngDialog.open({
                    template:'<p style=\"text-align: center\">内部服务器错误</p>',
                    plain:true
                });
            } else if(501 === err.status) {
                // ...
            } else if(403 === err.status) {
                // window.location.href = "/login.html"
            }
            return $q.reject(err);
        }
    };
}

// 添加对应的 Interceptors
app.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push(HttpInterceptor);
}]);

app.controller("MasterCtrl",function($scope, $cookieStore, $http, baseUrl, ngDialog, $rootScope,cfpLoadingBar ){

    var baseUrl = baseUrl.getUrl();
    cfpLoadingBar.start();
    cfpLoadingBar.complete();
    $rootScope.alert_pop = function(alert_info){
        $rootScope.alert_info = alert_info;
        ngDialog.open({
            template:"alert.html",
            //className:'ngDialog-theme-default',
            preCloseCallback: function() {

            }
        })
    }

})



app.controller("headerCtrl",function($scope, $cookieStore, $http, $uibModal, baseUrl, ngDialog, $rootScope){

    $scope.state={
        manage:false,
        register:true,
        login:true,
        user_name:false

    }
    var user_token=sessionStorage.getItem("user_token");
    if(user_token){
        var username=sessionStorage.getItem("loginName");
        var password=sessionStorage.getItem("password");
        $scope.state.manage=true;
        $scope.username=username;
        $scope.state.register=false;
        $scope.state.login=false;
        $scope.state.user_name=true;

    }

    $scope.quit=function(){
        sessionStorage.removeItem("user_token");
        $scope.state.user_name=false;
        window.location.href="/index.html";

    };

    $scope.nav_state={
        first:true,
        second:false,
        third:false,
        fourth:false,
        fifth:false

    }
    $scope.toggle=function(state){
        for(i in $scope.nav_state){
            if(i==state){
                $scope.nav_state[i]=true;
            }else{
                $scope.nav_state[i]=false
            }
        }
    }

})


app.controller('headerManageCtrl',function($scope, $cookieStore, $http, $uibModal, baseUrl, ngDialog, $rootScope){
    $scope.open=function(size, method){
        var modalInstance=$uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalHeader',
            templateUrl: "myModalContent.html",
            size: size,
            resolve:{
                items:function(){
                    if(method=="quit"){
                        return {
                            title:"退出IOT云",
                            method:"quit",
                            scope:$scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    }

})

app.controller('ModalHeader',function($scope,$cookieStore, $uibModalInstance,$http,items,baseUrl,url_junction,ngDialog){
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };
    if($scope.item.method=='quit'){
        $scope.ok=function(){
            $http.get(baseUrl+"/api/1/user/logout").success(function(data){
                if(data.code=="200"){
                    sessionStorage.removeItem("user_token");
                    window.location.href = "/index.html"
                }
            }).error(function(){
                ngDialog.open({
                    template: '<p style=\"text-align: center\">退出出错:'+data.description+'</p>',
                    plain: true
                });
            });
            $uibModalInstance.close();
        }
    } 
    
    
})


app.controller("sideBarCtrl",function($scope, $cookieStore, $http, $uibModal,$location, baseUrl, ngDialog, $rootScope){
    console.log("<=====管理控制台首页sidebar=====>")
    console.log("<==地址===>"+$location.path());
    if($location.path()==""){
        console.log("<====地址为空===>");
    }
    $scope.status={
        "subject":false,
         "object":false,
         'work_order':false
    }
    $scope.toggle=function(name){
        if(name){
            $scope.status[name]=!$scope.status[name];
        }

    }
})








