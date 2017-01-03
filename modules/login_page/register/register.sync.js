
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
    $scope.btn_active = false;
    $scope.detail_active=false;

    $scope.state = {
        first: true,
        second: false,
        third:false
    }


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


    //监控注册按钮
    
    $scope.watch_registerBtn=function(){
        $scope.$watch("phone",function(newValue,oldValue){
            if ($scope.phone.validate_code && $scope.phone.validate_code
                &&$scope.phone.msg_code&&$scope.read_check) {
                $scope.btn_active = true;
            } else {
                $scope.btn_active = false;
            }
        },true);


        $scope.$watch("read_check",function(newValue,oldValue){
            if ($scope.phone.validate_code && $scope.phone.validate_code
                &&$scope.phone.msg_code&&$scope.read_check) {
                $scope.btn_active = true;
            } else {
                $scope.btn_active = false;
            }
        });

    }
    
      $scope.watch_registerBtn();
    
    
    //监控完善资料按钮
    $scope.watch_detailBtn=function(){
        $scope.$watch("detail.username",function(newValue,oldValue){
            if ($scope.detail.username && $scope.detail.password
                &&$scope.detail.repassword) {
                $scope.detail_active=true;
            } else {
                $scope.detail_active=false;
            }

        })
        $scope.$watch("detail.repassword",function(newValue,oldValue){
            if ($scope.detail.username && $scope.detail.password
                &&$scope.detail.repassword&&$scope.detail.password==$scope.detail.repassword) {
                $scope.detail_active=true;
            } else {
                $scope.detail_active=false;
            }

        })
        $scope.$watch("detail.password",function(newValue,oldValue){
            if ($scope.detail.username && $scope.detail.password
                &&$scope.detail.repassword) {
                $scope.detail_active=true;
            } else {
                $scope.detail_active=false;
            }

            if(newValue==undefined){
                $scope.detail_password_error=true;
            }else{
                $scope.detail_password_error=false;
            }

        })

    }
    $scope.watch_detailBtn();
    

    
    
    
    $scope.change_picture = function () {
        $scope.Captcha_token = utils.gettoken();
        $scope.picture_src = BaseUrl + "/api/1/captcha/" + $scope.Captcha_token + ".jpeg?width=158&height=46";
        $scope.Captcha_token_temp=$scope.Captcha_token;
    }
    $scope.read_check=true;
    $scope.err_validate_state=false;
    $scope.err_msg_state=false;

    var wait=60;
    $scope.send_msg_desc="发送短信验证码";
    $scope.send_msg_btn=false;
    $scope.send_msg=function(){
        //
        // console.log("<==手机号==>"+$scope.phone.number);
        // console.log("<==验证码==>"+$scope.phone.validate_code);
        $scope.$watch("phone.number",function(newValue,oldValue){
            if(newValue){
                if($scope.phone_pattern.test(newValue)){
                    $scope.register_phone_error=false;
                }else{
                    $scope.register_phone_error=true;
                }

            }else{
                $scope.register_phone_error=true;
            }

            if(newValue!=oldValue){
                $scope.err_user_state=false;
            }



        });
        $scope.$watch("phone.validate_code",function(newValue,oldValue){
            if(newValue){
                $scope.register_validate_error=false;

            }else{
                $scope.register_validate_error=true;
                $scope.err_validate_state=false;
            }
        });

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
                 var  time=function(){
                      if(wait==0){
                          $scope.send_msg_btn=false;
                          $scope.send_msg_desc="重新发送验证码";
                          wait=60;
                          $interval.cancel(timer);
                          $scope.send_msg_state=false;

                      }else{
                          $scope.send_msg_state=true;
                          $scope.send_msg_btn=true;
                          $scope.send_msg_desc ="验证码已发送("+wait+"s)";
                          wait--;
                      }
                  }
                  var timer= $interval(time,1000);


                }else{
                    if(data.code==10001){
                        $scope.err_validate_state=true;
                        $scope.err_validate=data.message;
                    }
                    if(data.code==10002){
                        $scope.err_user_state=true;
                        $scope.err_user=data.message;
                    }

                }
            })
        }


    }

    // $scope.register_phone_error=false;
    // $scope.register_validate_error=false;
    // $scope.register_msgcode_error=false;


    $scope.register_go=function(){
        $scope.$watch("phone.number",function(newValue,oldValue){
            if(newValue){
                if($scope.phone_pattern.test(newValue)){
                    $scope.register_phone_error=false;
                }else{
                    $scope.register_phone_error=true;
                }

            }else{
                $scope.register_phone_error=true;
            }
        });
       // alert($scope.read_check);
        $scope.$watch("phone.validate_code",function(newValue,oldValue){
            if(newValue){
                $scope.register_validate_error=false;
            }else{
                $scope.register_validate_error=true;
            }
        });
        $scope.$watch("phone.msg_code",function(newValue,oldValue){
            if(newValue){
                $scope.register_msgcode_error=false;
            }else{
                $scope.register_msgcode_error=true;
                $scope.err_msg_state=false;
            }
        });
        $scope.$watch("read_check",function(newValue,oldValue){
            if(newValue){
                $scope.register_check_error=false;
            }else{
                $scope.register_check_error=true;
                
            }
        });






        // if($scope.phone.number){
        //     $scope.register_phone_error=false;
        // }else{
        //     $scope.register_phone_error=true;
        // }
       //  if($scope.phone.validate_code){
       //      $scope.register_validate_error=false;
       //  }else{
       //      $scope.register_validate_error=true;
       //  }
       // if($scope.phone.msg_code){
       //     $scope.register_msgcode_error=false;
       // }else{
       //     $scope.register_msgcode_error=true;
       // }




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
                    sessionStorage.setItem("usecloud-token",
                       data.data.token
                    );
                    sessionStorage.setItem("user_token",
                        data.data.token
                    );
                    //完善资料
                    // $scope.complete_detail_register();

                    $scope.state.second=true;
                    $scope.state.first=false;

                }else{
                    $scope.err_msg_state=true;
                    $scope.err_msg_desc=data.message;
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
          $scope.$watch("detail.username",function(newValue,oldValue){
              if(newValue){
                  $scope.detail_username_error=false;
              }else{
                  $scope.detail_username_error=true;
              }
              if(newValue!=oldValue){
                  $scope.err_username_state=false;
              }
          })
          $scope.$watch("detail.password",function(newValue,oldValue){
              if (newValue == undefined || newValue == "") {
                  $scope.detail_password_error = true;
              } else {
                  $scope.detail_password_error = false;
              }
          })






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

                     sessionStorage.setItem("loginName",data.data.username);
                     $scope.complete_first=true;
                     $scope.complete_second=true;
                     $scope.complete_third=false;
                     $scope.register_second=false;
                     $scope.register_third=true;

                     $scope.state.third=true;
                     $scope.state.first=false;
                     $scope.state.second=false;

                     $scope.register_suc.username=data.data.username;
                     $scope.register_suc.phone=data.data.phone;
                     $scope.register_suc.email=data.data.email;

                     var toDo = function () {
                         $scope.count--;
                         if($scope.count == 1){
                             window.location.href = "/index.html";
                         }
                     };
                     $interval(toDo, 1000, 5);
                 }
               if(data.code==10012){
                   $scope.email_error=true
               }
               if(data.code==10021){
                   $scope.err_username_state=true;
                   $scope.err_username=data.message;
               }



               })

               

          }

      }


})
