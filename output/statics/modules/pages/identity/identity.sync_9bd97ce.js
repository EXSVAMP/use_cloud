define('pages/identity/identity.sync', function(require, exports, module) {


var app = angular.module('RDash');
app.register.controller("identityCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore, baseUrl, url_junction,$rootScope,utils,PageHandle) {
    var BaseUrl = baseUrl.getUrl();
    var urlData = $location.search();
    $scope.projectName = urlData.projectName;
    $scope.projectId = urlData.projectId;
    $scope.$on('to-pare', function(d,data) {
        $scope.$broadcast('to-child', {id:$scope.projectId,name:$scope.projectName,tabName:'identity'});
    });

    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;

    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            $scope.submit_search();
        } else
            $scope.index_sel = "";
    };



    $scope.submit_search = function () {
        $http.get(BaseUrl + "/api/1/topic/identity" + url_junction.getQuery({
                name:$scope.identity_name,
                instance:$scope.projectId,
                index: $scope.bigCurrentPage,
                number: $scope.number,
                is_page:'1'

            })).success(function (data) {
            if (data.code == 200) {
                $scope.query_result = data.data;
                $scope.bigTotalItems = data.pageinfo.total_number;
                $scope.total_page = data.pageinfo.total_page;
                $scope.currentPageTotal = $scope.query_result.length;


            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                BaseUrl.redirect()
            }
        })

    };
    $scope.submit_search();
    $scope.changePage = function () {
        $scope.submit_search();
    }
    $scope.setShowNum = function (number) {
        $scope.number = number;
        $scope.submit_search();
    }




    $scope.$on('addidentityclose',function(){
        $scope.cover='obj-hide'
    })
    $scope.cover="obj-hide";
   $scope.open=function(method,item){
       $scope.cover='obj-show';
       if(method=='add'){
           $scope.$broadcast('identityState', {method:'add',title:'添加身份',scope:$scope,projectId:$scope.projectId });
       }
       if(method=='edit'){
           $scope.$broadcast('identityState', {method:'edit',title:'编辑身份',item:item,scope:$scope,projectId:$scope.projectId});
       }
       if(method=='delete'){
           $scope.$broadcast('identityState', {method:'delete',title:"删除身份",item:item,scope:$scope,projectId:$scope.projectId});
       }

   }







})


});
