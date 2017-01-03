var app = angular.module('RDash');
app.register.controller("forgetPassWordCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, utils, $interval) {
    var BaseUrl = baseUrl.getUrl();

    // console.log("<=====登入12345678980808080=======>")
    $scope.phone_pattern = /^1[34578]\d{9}$/;
    $scope.Captcha_token = utils.gettoken();
    $scope.Captcha_token_temp = $scope.Captcha_token;
    $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
    $scope.state = {
        first: true,
        second: false
    }
    $scope.phone = {
        number: "",
        validate_code: '',
        msg_code: "",
        password: "",
        repassword: ""
    }
    $scope.count = 5;
    $scope.btn_active = false;

    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp = $scope.Captcha_token;
    }

    $scope.err_validate_state = false;
    $scope.err_msg_state = false;

    var wait = 60;
    $scope.send_msg_desc = "发送短信验证码";
    $scope.send_msg_btn = false;
    $scope.send_msg = function () {
        $scope.$watch("phone.number", function (newValue, oldValue) {
            if (newValue) {
                if ($scope.phone_pattern.test(newValue)) {
                    $scope.forget_phone_error = false;
                } else {
                    $scope.forget_phone_error = true;
                }

            } else {
                $scope.forget_phone_error = true;
            }
            if(newValue!=oldValue){
                $scope.err_user_state=false;
            }
        });
        $scope.$watch("phone.validate_code", function (newValue, oldValue) {
            if (newValue) {
                $scope.forget_validate_error = false;

            } else {
                $scope.forget_validate_error = true;
                $scope.err_validate_state = false;
            }
        });
        $scope.params = {
            mobile: $scope.phone.number,
            action: "reset_password",
            token: $scope.Captcha_token_temp,
            captcha: $scope.phone.validate_code
        }

        if ($scope.phone.number && $scope.phone.validate_code) {
            $http.post(BaseUrl + "/api/1/user/sms/", $scope.params).success(function (data) {
                if (data.code == 200) {
                    $scope.err_validate_state = false;
                    var time = function () {
                        if (wait == 0) {
                            $scope.send_msg_btn = false;
                            $scope.send_msg_desc = "重新发送验证码";
                            wait = 60;
                            $interval.cancel(timer)
                            $scope.send_msg_state=false;

                        } else {
                            $scope.send_msg_state=true;
                            $scope.send_msg_btn = true;
                            $scope.send_msg_desc ="验证码已发送("+wait+"s)";
                            wait--;
                        }
                    }
                    var timer = $interval(time, 1000);

                } else {
                    if(data.code==10001){
                        $scope.err_validate_state=true;
                        $scope.err_validate=data.message;
                    }
                    if(data.code==10003){
                        $scope.err_user_state=true;
                        $scope.err_user=data.message;
                    }
                    $scope.change_picture();
                }
            })
        }

    }

    //监控提交按钮
      $scope.watch_submit=function(){
          $scope.$watch("phone", function (newValue, oldValue) {
               if($scope.phone.number&&$scope.phone.validate_code&&$scope.phone.msg_code
                 &&$scope.phone.password&&$scope.phone.repassword&&$scope.phone.password==$scope.phone.repassword){
                   $scope.btn_active = true;
               }else{
                   $scope.btn_active = false;
               }
          },true);

      }

     $scope.watch_submit();
    //*************

    $scope.findPassword = function () {
        $scope.phone_params = {
            phone: $scope.phone.number,
            pcaptcha: $scope.phone.msg_code,
            password: $scope.phone.password,
            repassword: $scope.phone.repassword,
        }
        $scope.$watch("phone.number", function (newValue, oldValue) {
            if (newValue) {
                if ($scope.phone_pattern.test(newValue)) {
                    $scope.forget_phone_error = false;
                } else {
                    $scope.forget_phone_error = true;
                }

            } else {
                $scope.forget_phone_error = true;
            }
        });

        $scope.$watch("phone.validate_code", function (newValue, oldValue) {
            if (newValue) {
                $scope.forget_validate_error = false;

            } else {
                $scope.forget_validate_error = true;
            }
        });

        $scope.$watch("phone.msg_code", function (newValue, oldValue) {
            if (newValue) {
                $scope.forget_msgcode_error = false;
            } else {
                $scope.forget_msgcode_error = true;
                $scope.err_msg_state = false;
            }
        });

        $scope.$watch("phone.password", function (newValue, oldValue) {
            if (newValue == undefined || newValue == "") {
                $scope.forget_password_error = true;
            } else {
                $scope.forget_password_error = false;
            }
        })

        $scope.$watch("phone.repassword", function (newValue, oldValue) {
            if (newValue == "") {
                $scope.forget_repassword_error = true;
            } else {
                $scope.forget_repassword_error = false;
            }
        })


        if ($scope.phone.number && $scope.phone.msg_code &&
            $scope.phone.password && $scope.phone.repassword) {

            $http.post(BaseUrl + "/api/1/user/forget", $scope.phone_params).success(function (data) {

                if (data.code == 200) {
                    $scope.state.first = false;
                    $scope.state.second = true;
                    var toDo = function () {
                        $scope.count--;
                        if ($scope.count == 1) {
                            window.location.href = "/login.html";
                        }
                    };

                    $interval(toDo, 1000, 5);

                } else {
                    if (data.code == 10015) {
                        $scope.err_msg_state = true;
                        $scope.err_msg_desc = data.message;
                    }
                }


            })


        }

    }


})