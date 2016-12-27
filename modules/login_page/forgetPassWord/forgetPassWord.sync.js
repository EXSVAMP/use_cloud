var app = angular.module('RDash');
app.register.controller("forgetPassWordCtr", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,utils,$interval) {
    var BaseUrl = baseUrl.getUrl();

    // console.log("<=====登入12345678980808080=======>")
    $scope.phone_pattern=/^1[34578]\d{9}$/;
    $scope.Captcha_token = utils.gettoken();
    $scope.Captcha_token_temp=$scope.Captcha_token;
    $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
    $scope.state={
        first:true,
        second:false
    }
    $scope.phone = {
        number: "",
        validate_code:'',
        msg_code: "",
        password:"",
        repassword:""
    }
    $scope.count=5;

    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp=$scope.Captcha_token;
    }

    $scope.err_validate_state=false;
    $scope.err_msg_state=false;
    $scope.send_msg=function(){
        $scope.params={
            mobile:$scope.phone.number,
            action:"reset_password",
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

    $scope.findPassword=function(){
          $scope.phone_params={
              phone:$scope.phone.number,
              pcaptcha:$scope.phone.msg_code,
              password:$scope.phone.password,
              repassword:$scope.phone.repassword,
          }
        if($scope.phone.number&&$scope.phone.msg_code&&
            $scope.phone.password&&$scope.phone.repassword){

            $http.post(BaseUrl+"/api/1/user/forget",$scope.phone_params).success(function(data){

                if(data.code==200){
                     $scope.state.first=false;
                     $scope.state.second=true;
                    var toDo = function () {
                        $scope.count--;
                        if($scope.count == 1){
                            window.location.href = "/login.html";
                        }
                    };

                    $interval(toDo, 1000, 5);
                    
                }




            })


        }

    }




})