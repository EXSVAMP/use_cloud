define('login_page/login/login', function(require, exports, module) {

// require('service');

module.exports = {
    url: '/login',
    template: "<div class=\"login\">\n    <div class=\"login_head\">\n      <a href=\"/index.html\">\n          <img class=\"login_logo\"  src=\"/statics/lib/img/logo186+50_8bebede.svg\"/>\n      </a>\n        <img class=\"login_logo_desc\" src=\"/statics/lib/img/slogan_62f3bbd.svg\"/>\n    </div>\n    <div class=\"login_content\">\n        <div class=\"login_content_detail\"></div>\n        <div class=\"login_wrap\">\n            <div class=\"warp_content\">\n              <form  role=\"form\" name=\"login\" >\n               <div class=\"warp_content_head\">\n                   <div class=\"account_head login_active\" ng-class=\"{true:'toggel_active',false:'toggel_unactive'}[state.account]\" ng-click=\"toggle(1)\">\n                       <span class=\"login_account\">账号登录</span>\n                       <!--<span class=\"login_account_trangle\"  ></span>-->\n                   </div>\n                   <div class=\"phone_head\" ng-click=\"toggle(2,record)\" ng-class=\"{true:'toggel_active',false:'toggel_unactive'}[state.phone]\">\n                       <span class=\"login_phone\" >手机登录</span>\n                       <!--<span class=\"login_account_trangle\" ></span>-->\n                   </div>\n\n                 <!--<span class=\"login_account_trangle\" ></span>-->\n               </div>\n               <div class=\"warp_content_detail\">\n                 <div class=\"login_account_warp\" ng-show=\"state.account\" >\n                   <div class=\"form-group input-btn\">\n                       <span class=\"icon-icon_user icon\"></span>\n                       <input type=\"text\"  placeholder=\"邮箱／手机号／用户名\" ng-click=\"showError=false\" autocomplete=\"on\" required ng-model=\"person.username\"/>\n                   </div>\n                     <div class=\"form-group errorWrap\" ng-show=\"login_username_error\">\n                         <span class=\"errorInfo\" >请输入用户名</span>\n                     </div>\n                   <div class=\"form-group input-btn\">\n                       <span class=\"icon-icon_password icon\"></span>\n                       <input type=\"password\" placeholder=\"密码\" ng-click=\"showError=false\" autocomplete=\"on\" required ng-model=\"person.password\"/>\n                   </div>\n                     <div class=\"form-group errorWrap\">\n                         <span class=\"errorInfo\"   ng-bind=\"loginResponse\" ng-if=\"showError\"></span>\n                     </div>\n                     <div class=\"form-group errorWrap errorWrap_pass\" ng-show=\"login_password_error\">\n                         <span class=\"errorInfo\" >请输入密码</span>\n                     </div>\n                    <!--<div class=\"error_wrap\">-->\n                        <!--<span class=\"errorInfo\"   ng-bind=\"loginResponse\" ng-if=\"showError\"></span>-->\n                    <!--</div>-->\n                   <div class=\"form-password\">\n                       <input type=\"checkbox\" ng-model=\"remember_check\"/>\n                       <label>记住用户</label>\n                       <a href=\"#forgetPassWord\">忘记密码</a>\n                   </div>\n                 </div>\n                   <div class=\"login_phone_warp\" ng-show=\"state.phone\">\n                       <div class=\"form-group input-btn\">\n                           <span class=\"icon-icon_mobile icon\"></span>\n                           <input type=\"text\" placeholder=\"请输入手机号码\" name=\"phone_number\" required  ng-maxlength=\"11\"\n                                     ng-model=\"phone.number\"/>\n                       </div>\n                       <div class=\"form-group errorWrap\">\n                         <span class=\"errorInfo\" ng-show=\"login.phone_number.$touched&&login.phone_number.$error.required ||login_phone_error\">必填</span>\n                           <span class=\"errorInfo\" ng-show=\"\n                                 login.phone_number.$invalid&&login.phone_number.$touched ||login_phone_error\">\n                               请输入有效的11位手机号</span>\n                       </div>\n                       <div class=\"form-group errorWrap err_user\" ng-show=\"err_user_state\">\n                           <span class=\"errorInfo\" >{{err_user}}</span>\n\n                       </div>\n                       <div class=\"form-group input-btn\">\n                           <span class=\"icon-icon_verificationcode icon\"></span>\n                           <input type=\"text\" class=\"picture_validate\" placeholder=\"请输入图形验证码\" required ng-model=\"phone.validate_code\"/>\n                           <span class=\"validat_code\"><img ng-src=\"{{picture_src}}\" class=\"validat_mig\" ng-click=\"change_picture()\"/></span>\n                       </div>\n                       <div class=\"form-group errorWrap\" ng-show=\"err_validate_state\">\n                           <span class=\"errorInfo\" >{{err_validate}}</span>\n\n                       </div>\n\n                       <div class=\"form-group errorWrap\" ng-show=\"login_validate_error\">\n                           <span class=\"errorInfo\" >请输入图形验证码</span>\n                       </div>\n\n                       <div class=\"form-group input-btn\">\n                           <span class=\"icon-icon_verificationcode icon\"></span>\n                           <input type=\"text\" class=\"msg_validate\" placeholder=\"短信验证码\" required ng-model=\"phone.msg_code\"/>\n                           <button type=\"button\" class=\"msgBtn\" ng-disabled=\"send_msg_btn\" ng-class=\"{true:'msg_active',flase:'msg_unactive'}[send_msg_state]\"  ng-click=\"send_msg()\">{{send_msg_desc}}</button>\n                       </div>\n                       <div class=\"form-group errorWrap\" ng-show=\"err_msg_state\">\n                           <span class=\"errorInfo\" >{{err_msg_state}}</span>\n                       </div>\n                       <div class=\"form-group errorWrap\" ng-show=\"login_msgcode_error\">\n                           <span class=\"errorInfo\" >请输入短信验证码</span>\n                       </div>\n\n\n                   </div>\n\n\n\n\n                   <div class=\"form-login\">\n                       <button type=\"button\" class=\"loginBtn\" ng-class=\"{true:'btn_active',false:'btn_unactive'}[btn_active]\"   ng-click=\"login_go(flag)\">立即登录</button>\n                       <div class=\"login_desc\">\n                           <span class=\"login_desc_left\"></span>\n                           <span class=\"login_desc_content\">没有账号，怎么办？</span>\n                           <span class=\"login_desc_right\"></span>\n                           <p><a class=\"go_register\" href=\"#register\">来，注册一个吧!</a></p>\n                       </div>\n                   </div>\n\n               </div>\n              </form>\n            </div>\n\n        </div>\n    </div>\n    <div class=\"head_foot\">\n    <p>\n        Copyright 2015 - 2016. 湖北橙石电子商务有限公司 & 上海橙金信息科技有限公司 All Rights Reserved. 沪ICP备16024255号\n    </p>\n</div>\n</div>",


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'loginCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require(['login_page/login/login.sync'], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};

});
