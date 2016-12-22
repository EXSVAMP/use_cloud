var app = angular.module('RDash');
app.register.controller("loginCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope, utils) {
    var BaseUrl = baseUrl.getUrl();

    // console.log("<=====登入1234567=======>"+BaseUrl);
    // console.log("<===时间戳==>"+utils.token)
    $scope.Captcha_token = "";
    $scope.Captcha_token_temp="";
    $scope.phone_pattern=/^1[34578]\d{9}$/;
    $scope.state = {
        account: true,
        phone: false
    }
    // var timestamp=new Date().getTime();
    // alert(timestamp);
    $scope.flag = 1;
    $scope.toggle = function (status) {
        if (status == 1) {
            $scope.state.account = true;
            $scope.state.phone = false;
            $scope.flag = 1;

        }
        if (status == 2) {
            $scope.state.account = false;
            $scope.state.phone = true;
            $scope.flag = 2;

            $scope.Captcha_token = utils.gettoken();
            $scope.Captcha_token_temp=$scope.Captcha_token;
            $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";


        }
    }

    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp=$scope.Captcha_token;
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





    $scope.login_go = function (flag) {

        console.log("<==name=>" + $scope.person.username + "<====password===>" + $scope.person.password);
        if (flag == 1) {
            $http.post(BaseUrl + "/api/1/user/login", $scope.person).success(function (data) {
                if (data.code == '200') {

                } else {
                    $scope.showError = true;
                    $scope.loginResponse = data.message;
                }
            })
        }


        if (flag == 2) {
            if($scope.phone.number&&$scope.phone.msg_code){
                $scope.phone_params={
                    phone:$scope.phone.number,
                    pcaptcha:$scope.phone.msg_code
                }

                $http.post(BaseUrl+"/api/1/user/login/phone", $scope.phone_params).success(function(data){
                    if(data.code==200){
                       $scope.err_msg_state=false;

                    }else{
                        $scope.err_msg_state=true;
                        $scope.err_msg_state=data.message;
                    }
                })




            }

        }


    }

    
    $scope.err_validate_state=false;
    $scope.err_msg_state=false;
   $scope.send_msg=function(){

       console.log("<==手机号==>"+$scope.phone.number);
       console.log("<==验证码==>"+$scope.phone.validate_code);
        $scope.params={
            mobile:$scope.phone.number,
            action:"login",
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
   
})
