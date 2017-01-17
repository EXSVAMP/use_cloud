define('login_page/login/login.sync', function(require, exports, module) {

var app = angular.module('RDash');
app.register.controller("loginCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, $interval, utils) {
    var BaseUrl = baseUrl.getUrl();

    // console.log("<=====登入1234567=======>"+BaseUrl);
    // console.log("<===时间戳==>"+utils.token)
    $scope.Captcha_token = "";
    $scope.Captcha_token_temp = "";
    $scope.phone_pattern = /^1[34578]\d{9}$/;
    $scope.state = {
        account: true,
        phone: false

    }
    $scope.btn_active = false;
    // var timestamp=new Date().getTime();
    // alert(timestamp);
    $scope.flag = 1;
    $scope.record = 1;
    $scope.toggle = function (status) {
        if (status == 1) {
            $scope.state.account = true;
            $scope.state.phone = false;
            $scope.flag = 1;
            $scope.record = 1;
            $scope.watch_account();


        }
        if (status == 2) {
            $scope.state.account = false;
            $scope.state.phone = true;

            $scope.flag = 2;
            $scope.watch_phone();

            if ($scope.record != 2) {
                $scope.Captcha_token = utils.gettoken();
                $scope.Captcha_token_temp = $scope.Captcha_token;
                $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
            }
            $scope.record = 2;


        }
    }

    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp = $scope.Captcha_token;
    }

    $scope.person = {
        username: "",
        password: ""
    }

    $scope.phone = {
        number: "",
        validate_code: "",
        msg_code: ""
    }


    $scope.remember_check = false;
    if (sessionStorage.getItem("password")) {
        $scope.remember_check = true;
        $scope.person.username = sessionStorage.getItem("loginName");
        // $scope.person.password=sessionStorage.getItem("password");
    }
    //监控按钮
    $scope.watch_account = function () {
        $scope.$watch("person.password", function (newvalue, oldValue) {
            if ($scope.person.username && $scope.person.password) {
                $scope.btn_active = true;
            } else {
                $scope.btn_active = false;
            }

        })
        $scope.$watch("person.username", function (newvalue, oldValue) {
            if ($scope.person.username && $scope.person.password) {
                $scope.btn_active = true;
            } else {
                $scope.btn_active = false;
            }

        })
    }
    $scope.watch_account();


    $scope.watch_phone = function () {
        $scope.$watch("phone", function (newValue, oldValue) {
            if ($scope.phone.number && $scope.phone.validate_code && $scope.phone.msg_code) {
                $scope.btn_active = true;
            } else {
                $scope.btn_active = false;
            }

        },true);

    }
    $scope.watch_phone();

    //*******
    $scope.login_go = function (flag) {

        console.log("<==name=>" + $scope.person.username + "<====password===>" + $scope.person.password);
        if (flag == 1) {
            $scope.$watch("person.username", function (newValue, oldValue) {
                if (newValue) {
                    $scope.login_username_error = false;

                } else {
                    $scope.login_username_error = true;
                }
            });
            $scope.$watch("person.password", function (newValue, oldValue) {
                if (newValue) {
                    $scope.login_password_error = false;

                } else {
                    $scope.login_password_error = true;
                }
            });
            if ($scope.person.username && $scope.person.password) {
                $http.post(BaseUrl + "/api/1/user/login", $scope.person).success(function (data) {
                    if (data.code == '200') {
                        sessionStorage.setItem("loginName", data.data.username);

                        if ($scope.remember_check) {
                            sessionStorage.setItem("password", $scope.person.password);
                            $scope.remember_check = true;
                        } else {
                            sessionStorage.removeItem("password", $scope.person.password);
                        }

                        sessionStorage.setItem("user_token", data.data.token);
                        window.location.href = "/index.html";


                    } else {
                        $scope.showError = true;
                        $scope.loginResponse = data.message;
                    }
                })
            }
        }


        if (flag == 2) {

            $scope.$watch("phone.number", function (newValue, oldValue) {
                if (newValue) {
                    if ($scope.phone_pattern.test(newValue)) {
                        $scope.login_phone_error = false;
                    } else {
                        $scope.login_phone_error = true;
                    }

                } else {
                    $scope.login_phone_error = true;
                }
            });

            $scope.$watch("phone.validate_code", function (newValue, oldValue) {
                if (newValue) {
                    $scope.login_validate_error = false;
                } else {
                    $scope.login_validate_error = true;
                    $scope.err_validate_state = false;
                }
            });

            $scope.$watch("phone.msg_code", function (newValue, oldValue) {
                if (newValue) {
                    $scope.login_msgcode_error = false;
                } else {
                    $scope.login_msgcode_error = true;
                    $scope.err_msg_state = false;
                }
            });


            if ($scope.phone.number && $scope.phone.msg_code) {
                $scope.phone_params = {
                    phone: $scope.phone.number,
                    pcaptcha: $scope.phone.msg_code
                }

                $http.post(BaseUrl + "/api/1/user/login/phone", $scope.phone_params).success(function (data) {
                    if (data.code == 200) {
                        $scope.err_msg_state = false;
                        sessionStorage.setItem("loginName", data.data.username);
                        // sessionStorage.setItem("passwprd",$scope.person.password);
                        sessionStorage.setItem("user_token", data.data.token);
                        window.location.href = "/index.html";

                    } else {
                        $scope.err_msg_state = true;
                        $scope.err_msg_state = data.message;
                    }
                })


            }

        }


    }


    $scope.err_validate_state = false;
    $scope.err_msg_state = false;
    var wait = 60;
    $scope.send_msg_desc = "发送短信验证码";
    $scope.send_msg_btn = false;

    $scope.send_msg = function () {
        console.log("<==手机号==>" + $scope.phone.number);
        console.log("<==验证码==>" + $scope.phone.validate_code);


        $scope.$watch("phone.number", function (newValue, oldValue) {
            if (newValue) {
                if ($scope.phone_pattern.test(newValue)) {
                    $scope.login_phone_error = false;
                } else {
                    $scope.login_phone_error = true;
                }

            } else {
                $scope.login_phone_error = true;
                // $scope.err_user_state=false;
            }

            if (newValue != oldValue) {
                $scope.err_user_state = false;
            }

        });
        $scope.$watch("phone.validate_code", function (newValue, oldValue) {
            if (newValue) {
                $scope.login_validate_error = false;

            } else {
                $scope.login_validate_error = true;
                $scope.err_validate_state = false;
            }
        });


        $scope.params = {
            mobile: $scope.phone.number,
            action: "login",
            token: $scope.Captcha_token_temp,
            captcha: $scope.phone.validate_code
        }
        if ($scope.phone.number && $scope.phone.validate_code) {
            $http.post(BaseUrl + "/api/1/user/sms/", $scope.params).success(function (data) {
                if (data.code == 200) {
                    $scope.err_validate_state = false;
                    $scope.err_user_state = false;
                    var time = function () {
                        if (wait == 0) {
                            $scope.send_msg_btn = false;
                            $scope.send_msg_desc = "重新发送验证码";
                            wait = 60;
                            $interval.cancel(timer);
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
                    if (data.code == 10001) {
                        $scope.err_validate_state = true;
                        $scope.err_validate = data.message;
                    }
                    if (data.code == 10003) {
                        $scope.err_user_state = true;
                        $scope.err_user = data.message;
                    }
                    $scope.change_picture();

                }
            })
        }

    }

})


});
