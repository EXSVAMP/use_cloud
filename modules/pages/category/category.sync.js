
var app = angular.module('RDash');
app.register.controller("categoryCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore, baseUrl, $rootScope,utils,PageHandle,$stateParams,$timeout,url_junction) {
    //console.log("主题2222项目管理控制台");
    //console.log('id',$stateParams.projectId)
    //console.log('name',$stateParams.projectName)

    //$scope.projectName = $stateParams.projectName;
    //$scope.projectId = $stateParams.projectId;

    var urlData = $location.search()
    console.log('urlData',urlData)
    $scope.projectName = urlData.projectName;
    $scope.projectId = urlData.projectId;

    console.log('id',$scope.projectId)
    console.log('name',$scope.projectName)

    $scope.$on('to-pare', function(d,data) {
        console.log(data);
        $scope.$broadcast('to-child', {id:$scope.projectId,name:$scope.projectName,tabName:'category'});
    });

    $scope.optip = 'obj-hide'
    $scope.optipHide = function(){
        $timeout(function(){
            $scope.optip = 'obj-hide'
        },1000)
    }

    $scope.opttipShow = function(){
        $scope.optip = 'obj-show'
        $scope.optipHide()
    }

    // console.log("<========>"+$location.path());
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.bigCurrentPage = 1;
    var BaseUrl = baseUrl.getUrl();

    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            // $scope.submit_search();
        } else
            $scope.index_sel = "";
    };

    $scope.submit_search = function () {
        $http.get(BaseUrl + "/api/1/topic/class" + url_junction.getQuery({
                name:$scope.category_name,
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



    $scope.open=function(size,method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalCategory',
            templateUrl: "myModalcategory.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "add") {
                        console.log(12334)
                        return {
                            title: "添加硬件类别",
                            method: "add",
                            scope: $scope
                        }
                    }
                }


            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        })




    }






})
