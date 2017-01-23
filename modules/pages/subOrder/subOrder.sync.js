
var app = angular.module('RDash');
app.register.controller("subOrderCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore,$timeout, baseUrl,utils) {
    $scope.title = '工单管理／提交工单';
    $scope.viewState = 0;
    $scope.step = function(step){
        $scope.reset();
        $scope.viewState=step;
        if(step==0){
            $scope.title = '工单管理／提交工单';
        }else if(step==1){
            $scope.title = '工单管理／提交工单/物接入相关';
            utils.getUploader('btn-upload-1',function(data,file){
                $scope.fieldSet.annex.push(data.key);
                $scope.$apply();
            });
        }else if(step==2){
            $scope.title = '工单管理／提交工单/规则引擎相关';
            utils.getUploader('btn-upload-2',function(data,file){
                $scope.fieldSet.annex.push(data.key);
                $scope.$apply();
            });
        }
    }
    $scope.phone_pattern = /^1[34578]\d{9}$/;
    $scope.email_pattern =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    $scope.fieldSet={
        description:'',
        phone:'',
        email:'',
        annex:[]
    }

    $scope.reset = function(){
        $scope.fieldSet={
            description:'',
            phone:'',
            email:'',
            annex:[]
        };
    }
     $scope.validta=function(params){
         var res="";
         if(params.description&&params.email&&params.phone&&
             $scope.phone_pattern.test(params.phone)
            &&$scope.email_pattern.test(params.email)){
             return {
                 result:true,
                 res:res
             }
         }else{
             if(params.description==""){
                 res="问题描述必填";
                 return {
                     result:false,
                     res:res
                 }
             }
             if(params.phone==""||!$scope.phone_pattern.test(params.phone)){
                 res="请填写有效手机号";
                 return {
                     result:false,
                     res:res
                 }
             }
             if(params.email==""||!$scope.email_pattern.test(params.email)){
                 res="请填写有效邮箱";
                 return {
                     result:false,
                     res:res
                 }
             }

         }

     }
    $scope.submit = function(){
        var params = angular.copy($scope.fieldSet);
        params.annex = angular.toJson(params.annex);
        if($scope.viewState==1){
            params.order_type='topic';
          if($scope.validta(params).result){
              $http.post(baseUrl.getUrl() + "/api/1/work_order/",params).success(function (data) {
                  if (data.code == 200) {
                      $scope.step(0);
                  }
              });
          }else{
              baseUrl.ngDialog($scope.validta(params).res)
          }

        }else if($scope.viewState==2){
            params.order_type='rule';
            $http.post(baseUrl.getUrl() + "/api/1/work_order/",params).success(function (data) {
                if (data.code == 200) {
                    $scope.step(0);
                }
            });
        }
    }

    $scope.getFileName=utils.getFileName;
});
