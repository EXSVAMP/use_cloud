
var app = angular.module('RDash');
app.register.controller("identityCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore, baseUrl, $rootScope,utils,PageHandle,$stateParams) {
    console.log($stateParams.projectId)

    $scope.$broadcast('tabSel',$stateParams.projectId)

    console.log("主题项目管理控制台");

    // console.log("<========>"+$location.path());
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.bigTotalItems =50;
    $scope.total_page = 7;

    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            // $scope.submit_search();
        } else
            $scope.index_sel = "";
    };



    //$scope.open=function(size,method,index){
    //    var modalInstance = $uibModal.open({
    //        animation: $scope.animationsEnabled,
    //        controller: 'ModalProject',
    //        templateUrl: "myModalproject.html",
    //        size: size,
    //        resolve: {
    //            items: function () {
    //                if (method == "add") {
    //                    return {
    //                        title: "添加项目",
    //                        method: "add",
    //                        scope: $scope
    //                    }
    //                }
    //            }
    //
    //
    //        }
    //    });
    //    modalInstance.result.then(function (selectedItem) {
    //        $scope.selected = selectedItem;
    //    }, function () {
    //    })
    //
    //
    //
    //
    //}




})
