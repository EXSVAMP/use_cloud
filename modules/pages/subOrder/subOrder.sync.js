
var app = angular.module('RDash');
app.register.controller("subOrderCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    $scope.title = '工单管理／提交工单';
    $scope.viewState = 0;
    $scope.step = function(step){
        $scope.reset();
        $scope.viewState=step;
        if(step==0){
            $scope.title = '工单管理／提交工单';
        }else if(step==1){
            $scope.title = '工单管理／提交工单/物接入相关';
        }else if(step==2){
            $scope.title = '工单管理／提交工单/规则引擎相关';
        }
    }

    $scope.fieldSet={
        description:'',
        phone:'',
        email:''
    }

    $scope.reset = function(){
        $scope.fieldSet={
            description:'',
            phone:'',
            email:''
        };
    }

    $scope.submit = function(){
        if($scope.viewState==1){
            var params = $scope.fieldSet;
            $http.post(baseUrl.getUrl() + "/api/1/work_order",params).success(function (data) {
                if (data.code == 200) {
                    $scope.step(0);
                }
            });
        }else if($scope.viewState==2){
            var params = $scope.fieldSet;
            $http.post(baseUrl.getUrl() + "/api/1/work_order",params).success(function (data) {
                if (data.code == 200) {
                    $scope.step(0);
                }
            });
        }
    }
})
