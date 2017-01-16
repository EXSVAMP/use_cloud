var app = angular.module('RDash');
app.register.controller("regulationCtr", function (ngDialog,$scope, $http, $location, $uibModal, $interval, $cookieStore, baseUrl, $rootScope, utils, PageHandle, $stateParams, $timeout, url_junction) {

    var urlData = $location.search()
    console.log('urlData', urlData)

    $scope.optip = 'obj-hide'
    $scope.addstrategy = 'obj-hide'
    $scope.optipHide = function () {
        $timeout(function () {
            $scope.optip = 'obj-hide'
        }, 1000)
    }

    $scope.optipShow = function (iFlag, message) {
        $scope.$broadcast('optip', {flag: iFlag, msg: message});
        $scope.optip = 'obj-show'
        $scope.optipHide()
    }

    //add
    $scope.addStrategy = function(){
        $scope.addstrategy = 'obj-show'
        $scope.$broadcast('addstrategy', {method:'add',title:'添加规则',projectId:$scope.projectId,scope: $scope});
    }

    $scope.$on('addstrategyclose',function(){
        $scope.addstrategy = 'obj-hide'
    })

    //modify
    $scope.modifyStrategy = function (idx) {
        $scope.addstrategy = 'obj-show'
        $scope.$broadcast('addstrategy', {
            method: 'modify',
            title: '编辑规则',
            projectId: $scope.projectId,
            scope: $scope,
            data: $scope.query_result[idx]
        });
    }

    $scope.$on('addstrategyclose', function () {
        $scope.addstrategy = 'obj-hide'
    })

    //regulationDetail
    $scope.regulationDetail = false;
    $scope.detailIdx = 0
    $scope.regulationDetailFunc = function(idx){
        $scope.regulationDetail = true;
        $scope.detailIdx = idx;
        $http.get(BaseUrl + "/api/1/rule/"+$scope.query_result[idx].id+'/').success(function (data) {
            if (data.code == 200) {
                var data = data.data;
                $scope.detail_name = data.name;
                $scope.detail_instance = data.instance;
                $scope.detail_topic = data.topic;

            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                BaseUrl.redirect()
            }
        })
    }

    //return
    $scope.return = function(){
        $scope.regulationDetail = false;
    }

    // console.log("<========>"+$location.path());
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.bigCurrentPage = 1;
    $scope.query_result = []
    $scope.regulation_nameTmp = ''
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
        $http.get(BaseUrl + "/api/1/rule/" + url_junction.getQuery({
                name: $scope.regulation_nameTmp,
                index: $scope.bigCurrentPage,
                number: $scope.number,
                //descent:

            })).success(function (data) {
            if (data.code == 200) {
                $scope.query_result = data.data;
                //$scope.query_result = [{name: 'test', topic: 'test2', description: "test3", id: '123'}]
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

    $scope.searchBtn = function () {
        $scope.bigCurrentPage = 1;
        $scope.strategy_nameTemp = $scope.strategy_name;
        $scope.submit_search()
    }

    $scope.open = function (size, method, index) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalRegulation',
            templateUrl: "myModalregulation.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "add") {
                        return {
                            title: "添加规则",
                            method: "add",
                            scope: $scope
                        }
                    } else if (method == "modify") {
                        return {
                            title: "编辑规则",
                            method: "modify",
                            scope: $scope,
                            data: $scope.query_result[index]
                        }
                    } else if (method == "delete") {
                        return {
                            title: "删除规则",
                            method: "delete",
                            scope: $scope,
                            data: $scope.query_result[index]
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

