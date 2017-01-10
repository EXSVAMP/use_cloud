
var app = angular.module('RDash');
app.register.controller("projectCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore,$state, baseUrl,url_junction, $rootScope,utils,PageHandle) {

    console.log("主题项目管理控制台");

    // console.log("<========>"+$location.path());
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;

    var BaseUrl = baseUrl.getUrl();
    $scope.setPage = function (pageNo) {
        if (PageHandle.setPageInput($scope.index_sel, $scope.total_page)) {
            $scope.bigCurrentPage = $scope.index_sel;
            $scope.index_sel = "";
            $scope.submit_search();
        } else
            $scope.index_sel = "";
    };

    $scope.submit_search = function () {
        $http.get(BaseUrl + "/api/1/topic/instance" + url_junction.getQuery({
                name:$scope.project_name,
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
      $scope.go=function(item){
          // $state.go('category',{projectId:item.id,projectName:item.name})
          $location.path('/category').search({projectId:item.id,projectName:item.name});
      }
    $scope.open=function(size,method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalProject',
            templateUrl: "myModalproject.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "add") {
                        return {
                            title: "添加项目",
                            method: "add",
                            scope: $scope
                        }
                    }
                    if(method=="delete"){
                        return{
                            title:"删除项目",
                            method:"delete",
                            id:index,
                            scope:$scope
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
