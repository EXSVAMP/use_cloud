
var app = angular.module('RDash');
app.register.controller("myOrderCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    $scope.title='工单管理／我的工单';
    $scope.params={
        startTime:'',
        endTime:'',
        state:''
    };
    
});
