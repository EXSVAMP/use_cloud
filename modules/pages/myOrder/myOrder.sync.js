var app = angular.module('RDash');
app.register.controller("myOrderCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore, baseUrl, $rootScope,utils,$timeout,listService,url_junction) {
    $scope.title = '工单处理／我的工单';
    $scope.params={
        date_start:'',
        date_end:'',
        state:'',
        pk:''
    };

    $scope.selections={
        order_state:{},
        order_type:{}
    }

    utils.getSelection('work_order').then(function(data){
        $scope.selections=data;
    });
    listService.init($scope,'/api/1/work_order/',{
        fieldSet:{
            message:''
        }
    });
    $scope.refresh();
    $scope.afterShowData = function(){
        $scope.title = '工单管理／我的工单/工单详情';
        $http.get(baseUrl.getUrl()+'/api/1/work_order/msg/'+url_junction.getQuery({order_id:$scope.detail.id,is_page:0})).success(function(data){
            $scope.msgs = data.data;
            $timeout(function(){
                var msgsView = angular.element('.detail-center-area.order-list');
                msgsView.scrollTop(msgsView[0].scrollHeight);
            });
        });
    }
    $scope.submit=function(){
        var params = $scope.fieldSet;
        params.order_id = $scope.detail.id;
        $http.post(baseUrl.getUrl()+'/api/1/work_order/msg/',params).success(function(res){
            $scope.afterShowData();
            $scope.reset();
        });
    }
    $scope.closeOrder = function(){
        $http.put(baseUrl.getUrl()+'/api/1/work_order/'+$scope.detail.id+'/',{pk:$scope.detail.id}).success(function(res){
            $scope.back();
        });
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
    $scope.loginId = sessionStorage.getItem("loginId");
    $scope.showImgs=function(imgs){
        utils.showImgs(imgs);
    }
});
