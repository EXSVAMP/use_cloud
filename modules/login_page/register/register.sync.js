
var app = angular.module('RDash');
app.register.controller("registerCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    var BaseUrl = baseUrl.getUrl();
    $scope.phone_pattern=/^1[34578]\d{9}$/;
    $scope.Captcha_token = utils.gettoken();
    $scope.Captcha_token_temp=$scope.Captcha_token;
    $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
    $scope.register_first=true;
    $scope.register_second=false;
    $scope.register_third=false;
    $scope.complete_first=false;
    $scope.complete_second=false;
    $scope.complete_third=false;
    $scope.count=5;
    
    $scope.phone = {
        number: "",
        validate_code: "",
        msg_code: ""
    }
    $scope.detail={
        username:'',
        password:'',
        repassword:'',
        email:'',
        company:'',
        web_site:''
    }
    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp=$scope.Captcha_token;
    }
    $scope.read_check=false;
    $scope.err_validate_state=false;
    $scope.err_msg_state=false;
    $scope.send_msg=function(){
        //
        // console.log("<==手机号==>"+$scope.phone.number);
        // console.log("<==验证码==>"+$scope.phone.validate_code);
        $scope.params={
            mobile:$scope.phone.number,
            action:"register",
            token:$scope.Captcha_token_temp,
            captcha:$scope.phone.validate_code
        }
        if($scope.phone.number&&$scope.phone.validate_code){
            $http.post(BaseUrl+"/api/1/user/sms/",$scope.params).success(function(data){
                if(data.code==200){
                    $scope.err_validate_state=false;
                  





                }else{
                    $scope.err_validate_state=true;
                    $scope.err_validate=data.message;
                }
            })
        }


    }
    $scope.register_go=function(){
       // alert($scope.read_check);
        if($scope.phone.number&&$scope.phone.msg_code&&$scope.read_check){
            $scope.phone_params={
                phone:$scope.phone.number,
                pcaptcha:$scope.phone.msg_code,
                agree:"1"
            }

            $http.post(BaseUrl+"/api/1/user/register", $scope.phone_params).success(function(data){
                if(data.code==200){
                    $scope.err_msg_state=false;
                    $scope.register_first=false;
                    $scope.register_second=true;
                    $scope.complete_first=true;
                    $cookieStore.put("usecloud-token",{
                        token: data.data.token
                    });
                    //完善资料
                    // $scope.complete_detail_register();

                }else{
                    $scope.err_msg_state=true;
                    $scope.err_msg_state=data.message;
                }
            })


        }

    }
      $scope.complete_detail_registe=function(){
          $scope.datail_params={
              username:$scope.detail.username,
              password:$scope.detail.password,
              repassword:$scope.detail.repassword,
              email:$scope.detail.email,
              company:$scope.detail.company,
              web_site:$scope.detail.web_site,
          }

          console.log($scope.detail.password);
          console.log($scope.detail.repassword);

          if($scope.detail.username&&$scope.detail.password&&$scope.detail.repassword){
               // $http.post(BaseUrl+"/api/1/user/profile",$scope.datail_params).success(function () {
               //
               // })

              $scope.complete_first=true;
              $scope.complete_second=true;
              $scope.complete_third=false;
              $scope.register_second=false;
              $scope.register_third=true;
              var toDo = function () {
                  $scope.countdown--;
                  if($scope.countdown1 == 1){
                      window.location.href = "/login.html";
                  }
              };
              $interval(toDo, 1000, 5);

          }


      }






})
app.factory('HttpInterceptor', ['$q','$injector',HttpInterceptor]);
function HttpInterceptor($q, $injector) {
    return {
        request: function(config){
            var security=$cookieStore.get("usecloud-token");
            request.headers["iotcloud-token"] =security.token;
            return config;
        },
        requestError: function(err){
            return $q.reject(err);
        },
        response: function(res){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(res.data.code){
                if(res.data.code!='200'){
                    ngDialog.open({
                        template: '<p style=\"text-align: center\">错误信息：' + res.data.message + '</p>',
                        plain: true
                    });
                };

            }
            return res;
        },
        responseError: function(err){
            var ngDialog;
            if(!ngDialog){
                ngDialog = $injector.get("ngDialog")
            }
            if(-1 === err.status) {
                // 远程服务器无响应
                // ngDialog.open({
                //     template:'<p style=\"text-align: center\">远程服务器无响应</p>',
                //     plain:true
                // });
            } else if(500 === err.status) {
                // 处理各类自定义错误
                ngDialog.open({
                    template:'<p style=\"text-align: center\">内部服务器错误</p>',
                    plain:true
                });
            } else if(501 === err.status) {
                // ...
            } else if(403 === err.status) {
                // window.location.href = "/login.html"
            }
            return $q.reject(err);
        }
    };
}

// 添加对应的 Interceptors
app.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push(HttpInterceptor);
}]);