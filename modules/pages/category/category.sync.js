var app = angular.module('RDash');
app.register.controller("categoryCtr", function ($scope, $http, $location, $uibModal, $interval, $cookieStore, baseUrl, $rootScope, utils, PageHandle, $stateParams, $timeout, url_junction) {
    //console.log("主题2222项目管理控制台");
    //console.log('id',$stateParams.projectId)
    //console.log('name',$stateParams.projectName)

    //$scope.projectName = $stateParams.projectName;
    //$scope.projectId = $stateParams.projectId;

    var urlData = $location.search()
    console.log('urlData', urlData)
    $scope.projectName = urlData.projectName;
    $scope.projectId = urlData.projectId;

    console.log('id', $scope.projectId)
    console.log('name', $scope.projectName)

    $scope.$on('to-pare', function (d, data) {
        console.log(data);
        $scope.$broadcast('to-child', {id: $scope.projectId, name: $scope.projectName, tabName: 'category'});
    });

    $scope.optip = 'obj-hide'
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

    // console.log("<========>"+$location.path());
    $scope.categoryMain = true;
    $scope.categoryWatch = false;
    $scope.number = "10";
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.bigCurrentPage = 1;
    $scope.query_result = []
    $scope.category_nameTemp = ''
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
        $http.get(BaseUrl + "/api/1/topic/class/" + url_junction.getQuery({
                name: $scope.category_nameTemp,
                instance: $scope.projectId,
                index: $scope.bigCurrentPage,
                number: $scope.number,
                is_page: '1'

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

    $scope.searchBtn = function () {
        $scope.bigCurrentPage = 1;
        $scope.category_nameTemp = $scope.category_name;
        $scope.submit_search()
    }

    $scope.open = function (size, method, index) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalCategory',
            templateUrl: "myModalcategory.html",
            size: size,
            resolve: {
                items: function () {
                    console.log('$scope.query_result', $scope.query_result)
                    if (method == "add") {
                        return {
                            title: "添加硬件类别",
                            method: "add",
                            scope: $scope
                        }
                    } else if (method == "modify") {
                        return {
                            title: "编辑硬件类别",
                            method: "modify",
                            scope: $scope,
                            data: $scope.query_result[index]
                        }
                    } else if (method == "delete") {
                        return {
                            title: "删除硬件类别",
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

    $scope.wsFunc3 = function (username,password,port) {
        //var websocket_url = constant.websocket_url;
        //var websocket_userName = constant.websocket_userName;
        //var websocket_password = constant.websocket_password;
        //var websocket_port = constant.websocket_port;

        var websocket_url = '211.152.46.42';
        //var websocket_userName = 'eb50fc3e';
        //var websocket_password = 'eb50ff54';
        //var websocket_port = '1883';

        client = new Paho.MQTT.Client(constant.websocket_url, port, "myclientid_" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        //client.onSubscribeSuccess = onSubscribeSuccess;
        //client.onSubscribeFailure = onSubscribeFailure;

        // connect the client
        client.connect({
            onSuccess: onConnect,
            userName: username,
            password: password,
            mqttVersion: 3
        });

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");

            //client.subscribe("exingcai/iot/clould/storehouse/" + store_house_id + "/eventlog/warning", {
            //    onSuccess: onSubscribeSuccess,
            //    onFailure: onSubscribeFailure
            //});

            client.subscribe("", {
                onSuccess: onSubscribeSuccess,
                onFailure: onSubscribeFailure
            });


            // message = new Paho.MQTT.Message("Hello");
            // message.destinationName = "/World";
            // client.send(message);
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            console.log("responseObject.errorCode:" + responseObject.errorCode);

            if (responseObject.errorCode !== 0) {
                // client = new Paho.MQTT.Client(constant.websocket_url, constant.websocket_port, "myclientid_" + parseInt(Math.random() * 100, 10));

                client.connect({
                    onSuccess: onConnect,
                    userName: username,
                    password: password,
                    mqttVersion: 3
                });
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {

            console.log("onMessageArrived:" + message.payloadString);

        }

        function onSubscribeSuccess() {
            subscribed = true;
            console.log("subscribed", subscribed);
        };

        function onSubscribeFailure(err) {
            subscribed = false;
            console.log("subscribe fail. ErrorCode: %s, ErrorMsg: %s", err.errCode, err.errorMessage);
        };

    }

    //$scope.wsFunc3();

    $scope.watch = function (idx) {
        $scope.categoryMain = false;
        $scope.categoryWatch = true;
        //$scope.wsFunc3();
    };

    $scope.return = function () {
        $scope.categoryMain = true;
        $scope.categoryWatch = false;
    };

    $scope.resetWatchTopicBtn = function(){
        $http.get(BaseUrl + "/api/1/topic/class/mqtt/?topic=" +$scope.watchTopic).success(function (data) {
            if (data.code == 200) {
                data = data.data
                $scope.wsFunc3(data.username,data.password,data.port);

            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {

            }
        })
    }



})
