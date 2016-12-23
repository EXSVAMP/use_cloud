
var app = angular.module('RDash');
app.register.controller("registerCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    var BaseUrl = baseUrl.getUrl();
    $scope.phone_pattern=/^1[34578]\d{9}$/;
   // $scope.email_pattern=/^\w+([-+.]\w+)@\w+([-.]\w+)\.\w+([-.]\w+)*$/;
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
    $scope.email_error=false;
    
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
    $scope.register_suc={
        username:"",
        phone:"",
        email:"",
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


    $scope.$watch("detail.email",function(newValue,oldValue){
        if(newValue==""){
            $scope.email_error=false;
        }
    })

      $scope.complete_detail_registe=function(){
          // var security=$cookieStore.get("usecloud-token");
          $scope.datail_params={
              // "usecloud_token":security.token,
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
               $http.post(BaseUrl+"/api/1/user/profile",$scope.datail_params).success(function (data) {
                 if(data.code==200){
                     $scope.complete_first=true;
                     $scope.complete_second=true;
                     $scope.complete_third=false;
                     $scope.register_second=false;
                     $scope.register_third=true;

                     $scope.register_suc.username=data.data.username;
                     $scope.register_suc.phone=data.data.phone;
                     $scope.register_suc.email=data.data.email;

                     var toDo = function () {
                         $scope.count--;
                         if($scope.count == 1){
                             window.location.href = "/login.html";
                         }
                     };
                     $interval(toDo, 1000, 5);
                 }
               if(data.code==10012){
                   $scope.email_error=true
               }



               })


          }

      }


})
