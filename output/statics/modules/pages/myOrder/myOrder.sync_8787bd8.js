define('pages/myOrder/myOrder.sync', function(require, exports, module) {

var app = angular.module('RDash');
app.register.controller("myOrderCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils,$timeout,listService) {
    $scope.title='工单管理／我的工单';
    $scope.params={
        date_start:'',
        date_end:'',
        state:''
    };
    listService.init($scope,'/api/1/work_order');
    $scope.selections={
          state:[{name:'test1',value:1},{name:'test2',value:2}]
    };
    // utils.getSelection('camera').then(function(data){
    //     console.log(data);
    // });
    $scope.detail=null;
    $scope.showDetail=function(data){
        $scope.detail=data;
        $scope.title = '工单管理／我的工单/工单详情';
    }
    $timeout(function(){
        $('.date-picker').datepicker({
            language: 'zh',
            orientation: "left",
            todayHighlight: true,
            autoclose:true,
            templates:{
                leftArrow: '<i class="fa fa-angle-left"></i>',
                rightArrow: '<i class="fa fa-angle-right"></i>'
            }
        });
    });
});


});
