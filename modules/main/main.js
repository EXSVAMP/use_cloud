angular.module("RDash", ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngDialog', 'cgBusy', 'truncate', 'ui.select', 'ngSanitize', 'angular-loading-bar', 'ngAnimate']);
require('router');
require('interceptor');
// require('common/service/listService');
require('common/constant');
require('common/service/utils');
require('components/opTip');
require('components/cover');
require('components/addStrategy');
require('components/addRegulation');


/**
 * Master Controller
 */
var app = angular.module('RDash');


app.config(function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

app.service("baseUrl", function (constant, ngDialog,$location) {
    var url = constant.url;
    return {
        getUrl: function () {
            return url;
        },
        getServerUrl: function () {
            //return 'http://' + $location.host() + ':' + $location.port() + "/";
            if ((typeof $location.port()) === 'number') {
                return 'http://' + $location.host() + ':' + $location.port() + "/";
            } else {
                return 'http://' + $location.host() + "/";
            }
        },
        ngDialog: function (sAlert) {
            ngDialog.open({
                template: '<p style=\"text-align: center\">' + sAlert + '</p>',
                plain: true
            });
        },
        dupInObjArr: function (key, objArr) {
            var isDup = 0;
            //key = 'name'
            //var test= [{name:'test',s:'pb'},{name:'test2',s:'pb8'},{name:'test',s:'pb7'}]
            var temp = []

            _.forEach(objArr, function (value) {
                if (_.find(temp, function (o) {
                        return o == value[key];
                    })) {
                    isDup = 1;
                    return isDup;
                } else
                    temp.push(value[key])
            });
            console.log(isDup)
            return isDup;

        },
        checkUrl: function(input){
            var str = input;
            //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
            var Expression=/http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            var objExp=new RegExp(Expression);
            if(str.indexOf("localhost")){
                str = str.replace("localhost","127.0.0.1");
            }
            if(objExp.test(str)==true){
                //alert("你输入的URL有效");
                return true;
            }else{
                //alert('你输入的URL无效');
                return false;
            }


        },
        checkTopic: function(input){ //英文 数字 ＃ ＊ 字数限制10
            input = _.trim(input)
            var res = {err:0,msg:''}
            if(input && input.length > 10){
                res = {err:1,msg:'主题输入最长为10'}
            }
            if(!(/^[a-zA-Z0-9#*/]+$/.test(input))){
                res = {err:1,msg:'主题限输入英文数字#＊/'}
            }
            return res;
        }

    }
}).service("url_junction", function () {
    return {
        getQuery: function (dic) {
            var query_url = '';
            for (var i in dic) {
                if (dic[i] && dic[i] != '-1') {
                    if (query_url == "") {
                        query_url += "?" + i + "=" + dic[i]
                    } else {
                        query_url += "&" + i + "=" + dic[i]
                    }
                }
            }
            return query_url
        },
        getDict: function (dic) {
            var ret_dic = {};
            for (var i in dic) {
                if (dic[i] && dic[i] != '-1') {
                    ret_dic[i] = dic[i];
                }
            }
            return ret_dic;
        }
    }
});
app.factory('PageHandle', function (ngDialog) {
    return {
        setPageInput: function (sPageInput, iMaxPage) {
            var isNum = /^\d+$/.test(sPageInput);
            if (!isNum) {
                ngDialog.open({
                    template: '<p style=\"text-align: center\">输入页码不正确</p>',
                    plain: true
                });
                return false;
            } else {
                sPageInput = parseInt(sPageInput);
                if (sPageInput == 0 || sPageInput > iMaxPage) {
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">输入页码不正确</p>',
                        plain: true
                    });
                    return false;
                }

            }
            return true;
        }
    }
});
app.filter("time_format", function () {
    return function (input) {

        if (input != undefined) {
            input = input.replace("T", " ");
        }
        return input;
    }
});
app.filter("pubsub", function () {
    return function (input) {

        if (input == 'pubsub') {
            input = 'sp';
        } else if (input == 'publish') {
            input = 'p';
        } else if (input == 'subscribe') {
            input = 's';
        } else {
            input = '';
        }
        return input;
    }
});

app.filter("booleanToString", function () {
    return function (input) {

        if (input) {
            input = '是';
        } else{
            input = '否';
        }
        return input;
    }
});

app.factory('HttpInterceptor', ['$q', '$injector', HttpInterceptor]);
function HttpInterceptor($q, $injector) {
    return {
        request: function (config) {
            return config;
        },
        requestError: function (err) {
            return $q.reject(err);
        },
        response: function (res) {
            var ngDialog;
            if (!ngDialog) {
                ngDialog = $injector.get("ngDialog")
            }
            if (res.data.code) {
                if (res.data.code != '200') {
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">错误信息：' + res.data.message + '</p>',
                        plain: true
                    });
                }
                ;

            }
            return res;
        },
        responseError: function (err) {
            var ngDialog;
            if (!ngDialog) {
                ngDialog = $injector.get("ngDialog")
            }
            if (-1 === err.status) {
                // 远程服务器无响应
                // ngDialog.open({
                //     template:'<p style=\"text-align: center\">远程服务器无响应</p>',
                //     plain:true
                // });
            } else if (500 === err.status) {
                // 处理各类自定义错误
                ngDialog.open({
                    template: '<p style=\"text-align: center\">内部服务器错误</p>',
                    plain: true
                });
            } else if (501 === err.status) {
                // ...
            } else if (403 === err.status) {
                // window.location.href = "/login.html"
            }
            return $q.reject(err);
        }
    };
}

// 添加对应的 Interceptors
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(HttpInterceptor);
}]);

app.controller("MasterCtrl", function ($scope, $cookieStore, $http, baseUrl, ngDialog, $rootScope, cfpLoadingBar) {

    var baseUrl = baseUrl.getUrl();
    cfpLoadingBar.start();
    cfpLoadingBar.complete();
    $rootScope.alert_pop = function (alert_info) {
        $rootScope.alert_info = alert_info;
        ngDialog.open({
            template: "alert.html",
            //className:'ngDialog-theme-default',
            preCloseCallback: function () {

            }
        })
    }

})


app.controller("headerCtrl", function ($scope, $cookieStore, $http, $uibModal, baseUrl, ngDialog, $rootScope) {

    $scope.state = {
        manage: false,
        register: true,
        login: true,
        user_name: false

    }
    var user_token = sessionStorage.getItem("user_token");
    if (user_token) {
        var username = sessionStorage.getItem("loginName");
        var password = sessionStorage.getItem("password");
        $scope.state.manage = true;
        $scope.username = username;
        $scope.state.register = false;
        $scope.state.login = false;
        $scope.state.user_name = true;

    }

    $scope.quit = function () {
        sessionStorage.removeItem("user_token");
        $scope.state.user_name = false;
        window.location.href = "/index.html";

    };

    $scope.nav_state = {
        first: true,
        second: false,
        third: false,
        fourth: false,
        fifth: false,
        second_detail: false
    }
    $scope.toggle = function (state) {
        for (i in $scope.nav_state) {
            if (i == state) {
                $scope.nav_state[i] = true;
            } else {
                $scope.nav_state[i] = false
            }
        }
    }
    $scope.detail = function(){
        for (i in $scope.nav_state) {
            if (i == 'second_detail') {
                $scope.nav_state[i] = true;
            } else {
                $scope.nav_state[i] = false
            }
        }
    }

    //devdoc
    $scope.current_devdoc_btn = '0'
    $scope.devdoc_btn = {
        0:true,
        1:false,
        2:false,
        3:false,
        4:false,
        5:false

    }

    $scope.devdoc_btn_click = function(idx){
        if($scope.current_devdoc_btn != idx){
            for (i in $scope.devdoc_btn) {
                if (i == idx) {
                    $scope.devdoc_btn[i] = true;
                } else {
                    $scope.devdoc_btn[i] = false
                }
            }

            $scope.devdoc_tab_click('0')
            $scope.current_devdoc_btn = idx;
        }
    }

    $scope.devdoc_tab = {
        0:true,
        1:false,
        2:false,
        3:false,
        4:false,
        5:false,
        6:false

    }

    $scope.devdoc_tab_click = function(idx){
        for (i in $scope.devdoc_tab) {
            if (i == idx) {
                $scope.devdoc_tab[i] = true;
            } else {
                $scope.devdoc_tab[i] = false
            }
        }
    }

})


app.controller('headerManageCtrl', function ($scope, $cookieStore, $http, $uibModal, baseUrl, ngDialog, $rootScope) {
    var username = sessionStorage.getItem("loginName");
    if (username) {
        $scope.user_name = username;
    }
    ;

    $scope.open = function (size, method) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalHeader',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if (method == "quit") {
                        return {
                            title: "退出IOT云",
                            method: "quit",
                            scope: $scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    }

})

app.controller('ModalHeader', function ($scope, $cookieStore, $uibModalInstance, $http, items, baseUrl, url_junction, ngDialog) {
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if ($scope.item.method == 'quit') {
        $scope.ok = function () {
            $http.get(baseUrl + "/api/1/user/logout").success(function (data) {
                if (data.code == "200") {
                    sessionStorage.removeItem("user_token");
                    window.location.href = "/index.html"
                }
            }).error(function () {
                ngDialog.open({
                    template: '<p style=\"text-align: center\">退出出错:' + data.description + '</p>',
                    plain: true
                });
            });
            $uibModalInstance.close();
        }
    }


})


app.controller("sideBarCtrl", function ($scope, $cookieStore, $http, $uibModal, $location, baseUrl, ngDialog, $rootScope) {
    console.log("<=====管理控制台首页sidebar=====>")
    console.log("<==地址===>" + $location.path());
    var username = sessionStorage.getItem("loginName");
    if (username) {
        $scope.user_name = username;
    }
    if ($location.path() == "") {
        console.log("<====地址为空===>");
    }
    $scope.status = {
        "subject": false,
        "object": false,
        'work_order': false
    }
    $scope.toggle = function (name) {
        if (name) {
            $scope.status[name] = !$scope.status[name];
        }

    }
})


app.controller('ModalProject', function ($scope, $cookieStore, $uibModalInstance, $http, items, baseUrl, url_junction, ngDialog) {
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.state = {
        add: false,
        delete: false
    }
    // console.log("<==项目名称====>"+$scope.project_name);
    if ($scope.item.method == 'add') {
        $scope.state.add = true;
        $scope.state.delete = false;
        $scope.ok = function () {
            $scope.params = {
                name: $scope.project_name
            }
            // console.log("<==项目名称====>"+$scope.project_name);
            $http.post(baseUrl + "/api/1/topic/instance", $scope.params).success(function (data) {
                if (data.code == "200") {
                    items.scope.submit_search();
                }
            }).error(function () {
                ngDialog.open({
                    template: '<p style=\"text-align: center\">添加失败:' + data.description + '</p>',
                    plain: true
                });
            });
            $uibModalInstance.close();
        }
    }


    if($scope.item.method=='delete'){
        $scope.state.add=false;
        $scope.state.delete=true;
        $scope.ok=function(){
            $scope.pk=items.id;
            $http.delete(baseUrl+"/api/1/topic/instance/"+$scope.pk+"/").success(function(data){
                if(data.code=="200"){

                    items.scope.submit_search();
                }

            }).error(function () {
                alert("有点故障！")
            });
            $uibModalInstance.close();
        }


    }


})

app.controller('projectTabCtr', function ($scope, $cookieStore, $http, baseUrl, url_junction, ngDialog, $location) {
    //baseUrl = baseUrl.getUrl();
    //$scope.item = items;
    //console.log(10)
    $scope.item = {
        id: '',
        name: '',
        category: false,
        identity: false,
        strategy: false
    }
    $scope.$on('to-child', function (d, data) {

        console.log("projectId", data);
        $scope.item.id = data.id;
        $scope.item.name = data.name;
        $scope.item[data.tabName] = true;

        console.log($scope.item.category);

    });

    $scope.$emit('to-pare', 'ok');

    $scope.go = function (tab) {
        $location.path('/' + tab).search({projectId: $scope.item.id, projectName: $scope.item.name});
    }


})

app.controller('opTipCtr', function ($scope, $cookieStore, $http, baseUrl, url_junction, ngDialog) {

    $scope.$on('optip', function (d, data) {

        $scope.flag = data.flag;
        $scope.optipText = data.msg;

    });
})


app.controller('coverCtr', function ($scope, $cookieStore, $http, baseUrl, url_junction, ngDialog) {
    baseUrl = baseUrl.getUrl();
    $scope.item = {};
    $scope.numbers = [10, 20, 30, 40, 50];
    $scope.state={
        pointer:false,
        strategy:false,
        secret:false,
        undelete:false,
        delete:false
    };
    $scope.params={};
    var instance="";
    $scope.$on("identityState",function(event,data){
        console.log(data);
        instance=data.projectId;
        if(data.method=='add'||data.method=='edit'){
            $scope.state.undelete=true;
            $scope.state.delete=false;
            $scope.params={
                identity_name:"",
                strategyId:"",
                description:""

            }

          //下拉框
            $scope.strategy_list=[];
            $scope.params.strategyId=-1;
            $scope.class_list=[];
            $scope.params.classId=-1;

            $scope.get_strategyList=function(){
                $http.get(baseUrl + "/api/1/topic/strategy?instance="+instance).success(function (data) {
                    if (data.code == 200) {
                        $scope.strategy_list = data.data;
                        $scope.strategy_list.push({id: '-1', name: '-------------'});
                    }
                })
            }
          $scope.get_classList=function(){
              $http.get(baseUrl + "/api/1/topic/class?instance="+instance).success(function (data) {
                  if (data.code == 200) {
                      $scope.class_list = data.data;
                      $scope.class_list.push({id: '-1', name: '-------------'});
                  }
              })
          }


            $scope.get_strategyList();
            $scope.get_classList();

            //选择策略
            $scope.select_strategy=function(strategyId){
                $scope.params.strategyId=strategyId;
                console.log("<===策略ID===>"+strategyId);
            }
            //选择实例
            $scope.select_class=function(classId){
                $scope.params.classId=classId;
                console.log("<===实例ID===>"+classId);
            }


           //添加项目操作
            if(data.method=='add'){


                //保存
                $scope.ok=function(){
                    var query_url = url_junction.getDict({
                        name:$scope.params.identity_name,
                        instance:instance ,
                        strategy:$scope.params.strategyId,
                        description:$scope.params.description,

                    });
                    $http.post(baseUrl+"/api/1/topic/identity",query_url).success(function(data){
                        if(data.code==200){
                            $scope.item.scope.submit_search();
                            $scope.cancel();
                        };
                    }).error(function(){
                        alert("error")
                    });

                }

            }
                $scope.ok_strategy=function(){
                    var query_url={
                        name:$scope.params.strategy_name,
                        classification:$scope.params.classId,
                        description:$scope.params.strategy_desc,
                        instance:instance,
                        topic:[]

                    }

                        _.forEach($scope.addTopicList, function (value) {

                            var pubsub = value['pubsub'];
                            if (/ps/.test(pubsub)) {
                                pubsub = 'pubsub'
                            } else if (/p/.test(pubsub)) {
                                pubsub = 'publish'
                            } else if (/s/.test(pubsub)) {
                                pubsub = 'subscribe'
                            }

                            query_url.topic.push({name: value['name'], pubsub: pubsub})

                        });

                    query_url.topic = JSON.stringify(query_url.topic);
                    $http.post(baseUrl + "/api/1/topic/strategy ", query_url).success(function (data) {
                                if (data.code == "200") {
                                    $scope.params.strategyId=data.data.id;
                                    $scope.get_strategyList();
                                    $scope.cancel_strategy();

                                }
                            })




                }



            if(data.method=="edit"){
                $scope.identity_id=data.item.id;
                $scope.params.identity_name=data.item.name;
                $scope.params.strategyId=data.item.strategy;
                $scope.params.description=data.item.description;
                var temp_secret=data.item.secret_key;
                $scope.edit={
                    showBtn:true,
                    hideBtn:false,
                    resetBtn:true
                }

                // $scope.show_reset=true;
                $scope.show_secrect=function(){
                    $scope.params.secret_key=temp_secret;
                    $scope.edit.showBtn=false;
                    $scope.edit.hideBtn=true;
                }
                $scope.hide_secrect=function(){
                    $scope.edit.showBtn=true;
                    $scope.edit.hideBtn=false;
                    $scope.params.secret_key="";

                }
                $scope.reset_secrect=function(id){
                    $http.put(baseUrl+"/api/1/topic/identity/reset/"+id+"/").success(function(data){
                            if(data.code==200){
                                if($scope.edit.hideBtn){
                                    $scope.params.secret_key=data.data.secret_key;
                                    // $scope.show_reset=false;
                                    temp_secret=data.data.secret_key;
                                }

                            }
                    })

                }
                $scope.ok=function(){
                    var query_url = url_junction.getDict({
                        strategy:$scope.params.strategyId,
                        description:$scope.params.description,

                    });
                    $http.put(baseUrl+"/api/1/topic/identity/"+$scope.identity_id+"/",query_url).success(function(data){
                         if(data.code==200){
                             $scope.item.scope.submit_search();
                             $scope.cancel();
                         }
                    })
                }

                console.log($scope.params);
            }





        }
        if(data.method=="delete"){
            $scope.state.delete=true;
            $scope.state.undelete=false;
            $scope.identity_id=data.item.id;

        }

        if(data.method=="edit"){
            $scope.state.secret=true;




        }else{
            $scope.state.secret=false;
        }
        $scope.item = data;
    })



    //删除
    $scope.delete=function(id){
        $http.delete(baseUrl+"/api/1/topic/identity/"+id+"/").success(function(data){
            if(data.code=="200"){
                $scope.item.scope.submit_search();
                $scope.cancel();
            }

        }).error(function(){
            alert("有点故障！")
        });


    }
    $scope.cancel = function(){
        $scope.$emit('addidentityclose','close')
    };

    // $scope.point_add_strategy=function(){
    //    $scope.params.strategy_name="123444555";
    // }

    //选择添加策略
    $scope.selectAdd = function () {
        $scope.state.pointer = true;
        $scope.state.strategy = true;
        $(".identity_warp").width(1010)
        // $scope.point_add_strategy();
        $scope.addTopicList=[];
        $scope.addTopicList.push({p: false, s: false, name: '', pubsub: ''});
        $scope.remainTopicToAddCount = 4;

    }


   $scope.cancel_strategy=function(){
       $scope.state.pointer=false;
       $scope.state.strategy=false;
       $(".identity_warp").width(480)
   }



    $scope.addTopicList = [{p:false,s:false,pubsub:'',name:''}]; //{p:false,s:false}
    $scope.remainTopicToAddCount = 4;
    $scope.addTopicFunc = function () {
        $scope.remainTopicToAddCount--;
        $scope.addTopicList.push({p: false, s: false, name: '', pubsub: ''})
        console.log($scope.addTopicList)
    }
    $scope.delTopicFunc = function (idx) {
        $scope.remainTopicToAddCount++;
        _.pullAt($scope.addTopicList, [idx]);
    }
    $scope.addPS = function (idx, type) {
        $scope.addTopicList[idx][type] = !$scope.addTopicList[idx][type];
        var reg = new RegExp(type)
        if (reg.test($scope.addTopicList[idx]['pubsub'])) {
            $scope.addTopicList[idx]['pubsub'] = $scope.addTopicList[idx]['pubsub'].replace(type, '')
        } else {
            $scope.addTopicList[idx]['pubsub'] += type
        }

        console.log($scope.addTopicList[idx]['pubsub'])
    }

})


app.controller('ModalCategory', function ($scope, $cookieStore, $uibModalInstance, $http, items, baseUrl, url_junction, ngDialog) {
    var url = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    // console.log("<==项目名称====>"+$scope.project_name);
    if ($scope.item.method == 'add') {
        $scope.ok = function () {
            var isValid = true;
            if (!$scope.name) {
                isValid = false;
                baseUrl.ngDialog('请填写类别名称')
            }
            if(isValid){
                var checkTopicRes = baseUrl.checkTopic($scope.topic);
                if(checkTopicRes.err == 1){
                    isValid = false;
                    baseUrl.ngDialog(checkTopicRes.msg)
                }
            }
            if (isValid) {
                $scope.params = {
                    name: $scope.name,
                    topic: $scope.topic,
                    description: $scope.description,
                    instance: items.scope.projectId
                }

                console.log("<======>", $scope.params);
                $http.post(url + "/api/1/topic/class/", $scope.params).success(function (data) {
                    if (data.code == "200") {
                        items.scope.optipShow(1, '操作成功')
                        items.scope.submit_search();
                    }
                }).error(function () {
                    //ngDialog.open({
                    //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                    //    plain: true
                    //});
                    items.scope.optipShow(0, '操作失败,' + data.description)
                });
                $uibModalInstance.close();

            }
        }
    } else if ($scope.item.method == 'modify') {
        var data = items.data;
        console.log('data', data)
        $scope.name = data.name;
        $scope.topic = data.topic;
        $scope.description = data.description;

        var cateName = $scope.name;
        $scope.ok = function () {
            var isValid = true;
            if (!$scope.name) {
                isValid = false;
                baseUrl.ngDialog('请填写类别名称')
            }
            if(isValid){
                var checkTopicRes = baseUrl.checkTopic($scope.topic);
                if(checkTopicRes.err == 1){
                    isValid = false;
                    baseUrl.ngDialog(checkTopicRes.msg)
                }
            }
            if (isValid) {
                $scope.params = {
                    name: cateName,
                    //topic: $scope.topic,
                    description: $scope.description
                }

                if (cateName == $scope.name) {
                    cateName = '';
                    delete $scope.params.name;
                }

                console.log("<======>", $scope.params);
                console.log("<======>", data.id);
                $http.put(url + "/api/1/topic/class/" + data.id + "/", $scope.params).success(function (data) {
                    if (data.code == "200") {
                        items.scope.optipShow(1, '操作成功')
                        items.scope.submit_search();
                    }
                }).error(function () {
                    //ngDialog.open({
                    //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                    //    plain: true
                    //});
                    items.scope.optipShow(0, '操作失败,' + data.description)
                });
                $uibModalInstance.close();
            }//end ok
        }

    } else if ($scope.item.method == 'delete') {
        $scope.ok = function () {
            var data = items.data;
            $http.delete(url + "/api/1/topic/class/" + data.id + "/", {}).success(function (data) {
                if (data.code == "200") {
                    items.scope.optipShow(1, '操作成功')
                    items.scope.submit_search();
                }
            }).error(function () {
                //ngDialog.open({
                //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                //    plain: true
                //});
                items.scope.optipShow(0, '操作失败,' + data.description)
            });
            $uibModalInstance.close();

        }
    }


})

app.controller('ModalStrategy', function ($scope, $cookieStore, $uibModalInstance, $http, items, baseUrl, url_junction, ngDialog) {
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if ($scope.item.method == 'delete') {
        var data = items.data;
        console.log('data', data)
        $scope.ok = function () {
            $http.delete(baseUrl + "/api/1/topic/strategy/" + data.id + "/", {}).success(function (data) {
                if (data.code == "200") {
                    items.scope.optipShow(1, '操作成功')
                    items.scope.submit_search();
                }
            }).error(function () {
                items.scope.optipShow(0, '操作失败,' + data.description)
            });
            $uibModalInstance.close();
        }
    }


})

app.controller('addStrategyCtr', function ($scope, $cookieStore, $http, baseUrl, url_junction, ngDialog, $timeout) {
    var url = baseUrl.getUrl();

    $scope.numbers = [];
    $scope.item = {};
    $scope.classification = {}
    $scope.classificationTemp = ''
    $scope.cancel = function () {
        //console.log($scope.addTopicList[0])
        $scope.$emit('addstrategyclose', 'close')
    };

    var getCategoryList = function(sProjectId,sSelProjectId){
        $scope.numbers = [];
        $http.get(url + "/api/1/topic/class" + url_junction.getQuery({
                name: '',
                instance: sProjectId,
                index: 1,
                number: 10,
                is_page: '0'

            })).success(function (data) {
            if (data.code == 200) {
                $scope.categoryList = data.data;
                if(!sSelProjectId){
                    $scope.classification = {}
                    //$scope.classification.name = null;
                    $scope.classificationTemp = ''
                }
                _.forEach($scope.categoryList, function(value) {
                    $scope.numbers.push({name:value.name,id:value.id})
                    if(sSelProjectId && sSelProjectId == value.id){
                        $scope.classification.name = {name:value.name,id:value.id}
                        $scope.classificationTemp = value.id
                    }
                });
                //$scope.bigTotalItems = data.pageinfo.total_number;
                //$scope.total_page = data.pageinfo.total_page;
                //$scope.currentPageTotal = $scope.query_result.length;


            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                BaseUrl.redirect()
            }
        })

        $scope.numbers.push({name:'---------',id:''})
        //$scope.numbers.push('---------')

        //if(!sSelProjectId){
        //    $scope.classification = {}
        //    $scope.classificationTemp = ''
        //}
    }

    $scope.setShowNum = function(category){
        //console.log(category.name+','+category.id)
        console.log('test',category)
        $scope.classificationTemp = category.id;
    }

    $scope.$on('addstrategy', function (q, data) {
        $scope.item = data;
        var isValid = true;
        var invalidMsg = ''
        var nameTemp = ''
        var init = function () {
            $scope.addTopicList = []; //{p:false,s:false,name:'',pubsub:''}
            $scope.remainTopicToAddCount = 5;
            $scope.addstrategy_content_topzero = "";
            if($scope.item.data) {
                getCategoryList(data.projectId,$scope.item.data.classification)
            }
            else{
                getCategoryList(data.projectId,'')
            }
        }
        if ($scope.item.method == 'add') {
            init()
            $scope.name = '';
            //$scope.classification = {};
            //$scope.topic = data.topic;
            $scope.description = '';

            $timeout(function () {
                if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                    $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
                }
            }, 100)

        } else if ($scope.item.method == 'modify') {
            init()
            var data = $scope.item.data;
            $scope.name = data.name;
            nameTemp = $scope.name;
            //$scope.classificationTemp = data.classification;
            //$scope.topic = data.topic;
            $scope.description = data.description;
            $scope.remainTopicToAddCount = $scope.remainTopicToAddCount - data.topics.length;
            _.forEach(data.topics, function (value) {
                var topicItem = {p: false, s: false, pubsub: '', name: ''}
                if (value['pubsub']) {
                    var pubsub = value['pubsub'];
                    if (/pubsub/.test(pubsub)) {
                        pubsub = 'ps'
                        topicItem['p'] = true;
                        topicItem['s'] = true;
                    } else if (/publish/.test(pubsub)) {
                        pubsub = 'p'
                        topicItem['p'] = true;
                    } else if (/subscribe/.test(pubsub)) {
                        pubsub = 's'
                        topicItem['s'] = true;
                    }

                    topicItem['pubsub'] = pubsub;
                }

                topicItem['name'] = value['value'];
                $scope.addTopicList.push(topicItem)
            });

            $timeout(function () {
                if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                    $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
                }
            }, 100)

        }
        if ($scope.item.method == 'add' || $scope.item.method == 'modify') {
            $scope.ok = function () {
                $scope.params = {
                    name: $scope.name,
                    //classification:$scope.classification,
                    //classification:'23',
                    classification: $scope.classificationTemp,
                    description: $scope.description,
                    instance: $scope.item.projectId,
                    topic: []
                };
                if (!$scope.name) {
                    isValid = false;
                    invalidMsg = '策略名称不能为空'
                }
                else if ($scope.item.method == 'modify' && nameTemp == $scope.name) {
                    delete $scope.params.name;
                }
                var topicEmpty = function () {
                    var isTopicInvalid = true;
                    _.forEach($scope.addTopicList, function (value) {
                        console.log('value', value['name'])
                        if (isTopicInvalid && !value['name']) {
                            isValid = false;
                            invalidMsg = '主题不能为空'
                            isTopicInvalid = false
                        }
                        if(isTopicInvalid && value['name']){
                            var checkTopicRes = baseUrl.checkTopic(value['name']);
                            if(checkTopicRes.err == 1){
                                isValid = false;
                                invalidMsg = checkTopicRes.msg
                                isTopicInvalid = false
                            }
                        }
                    });
                }

                if (isValid) {
                    topicEmpty()
                }

                if (isValid && baseUrl.dupInObjArr('name', $scope.addTopicList)) {
                    isValid = false;
                    invalidMsg = '主题不能重复'
                }

                if (!isValid) {
                    baseUrl.ngDialog(invalidMsg)
                }

                if (isValid) {
                    _.forEach($scope.addTopicList, function (value) {
                        //console.log(value.name);
                        //var pubsub = ''
                        //if($scope.addTopicList[key]['p'] && $scope.addTopicList[key]['s']){
                        //    pubsub = 'ps'
                        //}else if($scope.addTopicList[key]['p']){
                        //    pubsub = 'p'
                        //}else if($scope.addTopicList[key]['s']){
                        //    pubsub = 's'
                        //}
                        var pubsub = value['pubsub'];
                        if (/ps/.test(pubsub)) {
                            pubsub = 'pubsub'
                        } else if (/p/.test(pubsub)) {
                            pubsub = 'publish'
                        } else if (/s/.test(pubsub)) {
                            pubsub = 'subscribe'
                        }

                        $scope.params.topic.push({name: value['name'], pubsub: pubsub})

                    });

                    $scope.params.topic = JSON.stringify($scope.params.topic);
                    if ($scope.item.method == 'add') {
                        $http.post(url + "/api/1/topic/strategy/", $scope.params).success(function (data) {
                            if (data.code == "200") {
                                $scope.item.scope.optipShow(1, '操作成功')
                                $scope.item.scope.submit_search();
                            }
                        }).error(function () {
                            //ngDialog.open({
                            //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                            //    plain: true
                            //});
                            $scope.item.scope.optipShow(0, '操作失败,' + data.description)
                        });
                    }//end if
                    else {
                        $http.put(url + "/api/1/topic/strategy/" + $scope.item.data.id + "/", $scope.params).success(function (data) {
                            if (data.code == "200") {
                                $scope.item.scope.optipShow(1, '操作成功')
                                $scope.item.scope.submit_search();
                            }
                        }).error(function () {
                            //ngDialog.open({
                            //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                            //    plain: true
                            //});
                            $scope.item.scope.optipShow(0, '操作失败,' + data.description)
                        });
                    }

                    //$uibModalInstance.close();
                    $scope.$emit('addstrategyclose', 'close')
                }

            }
        }//end if
    })

    $scope.addTopicList = []; //{p:false,s:false,name:'',pubsub:''}
    $scope.remainTopicToAddCount = 5;
    $scope.addstrategy_content_topzero = "";
    $scope.addPS = function (idx, type) {
        $scope.addTopicList[idx][type] = !$scope.addTopicList[idx][type];
        //if(type == 'p' && /p/.test($scope.addTopicList[idex]['pubsub'])){
        //    $scope.addTopicList[idex]['pubsub'] = $scope.addTopicList[idex]['pubsub'].replace('p','')
        //}else if(type == 'p'){
        //    $scope.addTopicList[idex]['pubsub'] += 'p'
        //}else if(type == 's' && /s/.test($scope.addTopicList[idex]['pubsub'])){
        //    $scope.addTopicList[idex]['pubsub'] = $scope.addTopicList[idex]['pubsub'].replace('s','')
        //}else if(type == 'p'){
        //    $scope.addTopicList[idex]['pubsub'] += 's'
        //}

        var reg = new RegExp(type)
        if (reg.test($scope.addTopicList[idx]['pubsub'])) {
            $scope.addTopicList[idx]['pubsub'] = $scope.addTopicList[idx]['pubsub'].replace(type, '')
        } else {
            $scope.addTopicList[idx]['pubsub'] += type
        }

        console.log($scope.addTopicList[idx]['pubsub'])
    }
    $scope.addTopicFunc = function () {
        $scope.remainTopicToAddCount--;
        $scope.addTopicList.push({p: false, s: false, name: '', pubsub: ''})
        $timeout(function () {
            if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
            }
        }, 100)

    }
    $scope.delTopicFunc = function (idx) {
        $scope.remainTopicToAddCount++;
        _.pullAt($scope.addTopicList, [idx]);
        $timeout(function () {
            if (angular.element('#addstrategy-content').height() < angular.element(window).height()) {
                $scope.addstrategy_content_topzero = ""
            }
        }, 100)
    }
    $scope.setModel = function (idx) {
        return 'topic' + idx;
    }


})

app.controller('ModalRegulation', function ($scope, $cookieStore, $uibModalInstance, $http, items, baseUrl, url_junction, ngDialog) {
    baseUrl = baseUrl.getUrl();
    $scope.item = items;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if ($scope.item.method == 'delete') {
        var data = items.data;
        console.log('data', data)
        $scope.ok = function () {
            $http.delete(baseUrl + "/api/1/rule/" + data.id + "/", {}).success(function (data) {
                if (data.code == "200") {
                    items.scope.optipShow(1, '操作成功')
                    items.scope.submit_search();
                }
            }).error(function () {
                items.scope.optipShow(0, '操作失败,' + data.description)
            });
            $uibModalInstance.close();
        }
    }


})

app.controller('addRegulationCtr', function ($scope, $cookieStore, $http, baseUrl, url_junction, ngDialog, $timeout) {
    var url = baseUrl.getUrl();
    $scope.username = sessionStorage.getItem('loginName');
    console.log('username',$scope.username)
    $scope.numbers = [];
    $scope.rule_typeArr = [{id:'Rabbitmq',name:'Rabbitmq'},{id:'Api',name:'Api'}];
    $scope.methodArr = [{id:'GET',name:'GET'},{id:'POST',name:'POST'},{id:'PUT',name:'PUT'},{id:'DELETE',name:'DELETE'},{id:'OPTION',name:'OPTION'}];
    $scope.item = {};
    $scope.instance = {}
    $scope.instanceTemp = ''
    $scope.instanceTempName = ''
    $scope.cancel = function () {
        //$scope.instance = {}
        $scope.$emit('addstrategyclose', 'close')
    };

    var getProjectList = function(sSelProjectId){
        $scope.numbers = [];
        $http.get(url + "/api/1/topic/instance" + url_junction.getQuery({
                index: 1,
                number: 10,
                is_page: '0'

            })).success(function (data) {
            if (data.code == 200) {
                $scope.projectList = data.data;
                _.forEach($scope.projectList, function(value) {
                    $scope.numbers.push({name:value.name,id:value.id})
                    if(sSelProjectId && sSelProjectId == value.id){
                        //$scope.instance = {'name':value.name,'id':value.id}
                        //$scope.instance = $scope.numbers[$scope.numbers.length-1]
                        $scope.instance.name = {'name':value.name,'id':value.id}
                        $scope.instanceTemp = value.id
                        $scope.instanceTempName = value.name
                    }
                });

            } else {
                console.log(data)
            }
        }).error(function (data, state) {
            if (state == 403) {
                BaseUrl.redirect()
            }
        })

        $scope.numbers.push({name:'---------',id:''})
        //$scope.numbers.push('---------')

        if(!sSelProjectId){
            console.log('sSelProjectId',sSelProjectId)
           $scope.instance = {}
            $scope.instanceTemp = ''
            $scope.instanceTempName = ''
        }
    }

    $scope.setShowNum = function(instance){
        //console.log(category.name+','+category.id)
        console.log('test',instance)
        $scope.instanceTemp = instance.id;
        $scope.instanceTempName = instance.name;

    }

    $scope.$on('addstrategy', function (q, data) {
        $scope.item = data;
        var isValid = true;
        var invalidMsg = ''
        var nameTemp = ''
        $scope.regulationShow = ''
        function instanceTopicChang(){
            var instanceTemp2 = $scope.instanceTempName
            if(instanceTemp2){
                instanceTemp2 = '.'+instanceTemp2
            }
            var topicNameTemp = $scope.topicName
            if(topicNameTemp){
                topicNameTemp = '.'+topicNameTemp
            }
            return instanceTemp2+topicNameTemp
        }
        $scope.$watch('topicName',function(){
            $scope.regulationShow = 'cn.useonline.iotcloud.'+$scope.username+instanceTopicChang();

        })

        $scope.$watch('instanceTemp',function(){
            $scope.regulationShow = 'cn.useonline.iotcloud.'+$scope.username+instanceTopicChang();
        })
        var init = function () {
            //$scope.rule_type = {id:'Rabbitmq',name:'Rabbitmq'};
            $scope.addTopicList = []; //{exchange:'',queue:false,persist:true,rule_type:''}
            $scope.remainTopicToAddCount = 5;
            $scope.addstrategy_content_topzero = "";
            if($scope.item.data) {
                getProjectList($scope.item.data.instance)
            }
            else{
                getProjectList()
            }
        }
        if ($scope.item.method == 'add') {
            init()
            $scope.name = '';
            $scope.instanceTemp = '';
            $scope.topicName = '';

            $timeout(function () {
                if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                    $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
                }
            }, 100)

        } else if ($scope.item.method == 'modify') {
            init()
            var data = $scope.item.data;
            $scope.name = data.name;
            nameTemp = $scope.name;
            //$scope.instanceTemp = data.instance;
            $scope.topicName = data.topic;
            //$scope.description = data.description;
            if(data.actuator){
                $scope.remainTopicToAddCount = $scope.remainTopicToAddCount - data.actuator.length;
            }else{
                data.actuator = []
            }

            _.forEach(data.actuator, function (value) {
                //{exchange:'',queue:'',persist:true,rule_type:{id:'Rabbitmq',name:'Rabbitmq'}},{"api":"","method":{id:'GET',name:'GET'},"header":"","rule_type":{id:'Api',name:'Api'}}
                var topicItem = value;
                topicItem['rule_type'] = {id:value['rule_type'],name:value['rule_type']};
                if(value['rule_type'] == 'Api'){
                    topicItem['method'] = {id:value['method'],name:value['method']};
                }
                $scope.addTopicList.push(topicItem)
            });
            $timeout(function () {
                if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                    $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
                }
            }, 100)

        }
        if ($scope.item.method == 'add' || $scope.item.method == 'modify') {
            $scope.ok = function () {
                $scope.params = {
                    name: $scope.name,
                    //classification:$scope.classification,
                    //classification:'23',
                    instance: $scope.instanceTemp,
                    //topicName: $scope.topicName,
                    topic: $scope.topicName,
                    actuator: []
                };
                console.log('name',$scope.name)
                if ($scope.name == '' || $scope.name == null || typeof($scope.name) == 'undefined') {
                    isValid = false;
                    invalidMsg = '规则名称不能为空'
                }
                else if ($scope.item.method == 'modify' && nameTemp == $scope.name) {
                    delete $scope.params.name;
                }

                //if (isValid && baseUrl.dupInObjArr('name', $scope.addTopicList)) {
                //    isValid = false;
                //    invalidMsg = '主题不能重复'
                //}

                if (isValid && !$scope.instanceTemp) {
                    isValid = false;
                    invalidMsg = '请选择物接入实例'
                }

                if(isValid && $scope.topicName){
                    var checkTopicRes = baseUrl.checkTopic($scope.topicName);
                    if(checkTopicRes.err == 1){
                        isValid = false;
                        invalidMsg = checkTopicRes.msg
                    }
                }

                var actuatorCheck = function () {
                    _.forEach($scope.addTopicList, function (value) {
                        if(value['api'] && !baseUrl.checkUrl(value['api'])){
                            isValid = false;
                            invalidMsg = '请输入正确的api';
                        }
                    });
                }

                if (isValid) {
                    actuatorCheck()
                }

                if (!isValid) {
                    baseUrl.ngDialog(invalidMsg)
                }

                if (isValid) {
                    _.forEach($scope.addTopicList, function (value) {
                        //{exchange:'',queue:'',persist:true,rule_type:{id:'Rabbitmq',name:'Rabbitmq'}},{"api":"","method":{id:'GET',name:'GET'},"header":"","rule_type":{id:'Api',name:'Api'}}
                        var item = value;
                        console.log('item',item)
                        if(value['exchange']){
                            console.log(12334)
                           item['exchange'] = $scope.regulationShow
                           item['rule_type'] = value['rule_type']['id']

                       }else{
                            item['method'] = value['method']['id']
                            item['rule_type'] = value['rule_type']['id']
                       }
                        console.log($scope.regulationShow)
                        $scope.params.actuator.push(item)

                    });

                    $scope.params.actuator = JSON.stringify($scope.params.actuator);
                    console.log('test',$scope.params.actuator)
                    if ($scope.item.method == 'add') {
                        $http.post(url + "/api/1/rule/", $scope.params).success(function (data) {
                            if (data.code == "200") {
                                $scope.item.scope.optipShow(1, '操作成功')
                                $scope.item.scope.submit_search();
                            }
                            //}else{
                            //    $scope.item.scope.optipShow(0, '操作失败,' + data.message)
                            //}
                        }).error(function () {
                            //ngDialog.open({
                            //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                            //    plain: true
                            //});
                            $scope.item.scope.optipShow(0, '操作失败,' + data.description)
                        });
                    }//end if
                    else if ($scope.item.method == 'modify') {
                        $http.put(url + "/api/1/rule/" + $scope.item.data.id + "/", $scope.params).success(function (data) {
                            if (data.code == "200") {
                                $scope.item.scope.optipShow(1, '操作成功')
                                $scope.item.scope.submit_search();
                            }
                        }).error(function () {
                            //ngDialog.open({
                            //    template: '<p style=\"text-align: center\">添加失败:'+data.description+'</p>',
                            //    plain: true
                            //});
                            $scope.item.scope.optipShow(0, '操作失败,' + data.description)
                        });
                    }

                    //$uibModalInstance.close();
                    $scope.$emit('addstrategyclose', 'close')
                }

            }
        }//end if
    })

    $scope.addTopicList = []; //{exchange:'',queue:'',persist:true,rule_type:{id:'Rabbitmq',name:'Rabbitmq'}},{"api":"","method":{id:'GET',name:'GET'},"header":"","rule_type":{id:'Api',name:'Api'}}
    $scope.remainTopicToAddCount = 5;
    $scope.addstrategy_content_topzero = "";
    //选择存储类型
    $scope.setRuleType = function(rule_type,idx){

        if(rule_type.id == 'Rabbitmq'){
            $scope.addTopicList[idx] = {exchange:'cn.useonline.iotcloud.'+$scope.username,queue:'',persist:true,rule_type:{id:'Rabbitmq',name:'Rabbitmq'}};
        }else if(rule_type.id == 'Api'){
            $scope.addTopicList[idx] = {"api":"","method":{id:'GET',name:'GET'},"header":"","rule_type":{id:'Api',name:'Api'}};
        }

    }

    //选择调用方式
    $scope.setMethod = function(method,idx){
        console.log('test',$scope.addTopicList[idx]['method'])
    }

    $scope.addPersist = function (idx, type) {
        $scope.addTopicList[idx][type] = !$scope.addTopicList[idx][type];
    }
    $scope.addTopicFunc = function () {
        if($scope.instanceTemp){
        $scope.remainTopicToAddCount--;
        $scope.addTopicList.push({exchange:'cn.useonline.iotcloud.'+$scope.username,queue:'',persist:true,rule_type:{id:'Rabbitmq',name:'Rabbitmq'}})
        $timeout(function () {
            if (angular.element('#addstrategy-content').height() >= angular.element(window).height()) {
                $scope.addstrategy_content_topzero = "addstrategy-content-topzero"
            }
        }, 100)
        }else{
            baseUrl.ngDialog('请先选择物接入实例')
        }

    }
    $scope.delTopicFunc = function (idx) {
        $scope.remainTopicToAddCount++;
        _.pullAt($scope.addTopicList, [idx]);
        $timeout(function () {
            if (angular.element('#addstrategy-content').height() < angular.element(window).height()) {
                $scope.addstrategy_content_topzero = ""
            }
        }, 100)
    }
    $scope.setModel = function (idx) {
        return 'topic' + idx;
    }


});

$.fn.datepicker.dates['zh'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
    meridiem: ["上午", "下午"],
    //suffix:      ["st", "nd", "rd", "th"],
    today: "今天"
};











