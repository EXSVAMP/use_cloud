define('pages/subOrder/subOrder', function(require, exports, module) {


module.exports = {
    url: '/subOrder',
    template: "<div class=\"main-area\">\n    <div class=\"main-top-bar\">\n        <p>{{title}}</p>\n    </div>\n    <div class=\"main-content flex-area\">\n        <div class=\"main-item\" ng-if=\"viewState==0||viewState==1\">\n            <span class=\"icon-icon_analysis icon-bg\" ng-style=\"viewState==1?{'font-size':'320px'}:{}\"></span>\n            <div class=\"item-title\">\n                物接入相关\n            </div>\n            <div class=\"item-content\" ng-if=\"viewState==0\">\n                <span class=\"item-text\">类别, 身份, 策略等物接入相关的问题</span>\n                <div class=\"btn-area-right\">\n                    <a class=\"btn-normal btn-blue-bg\" ng-click=\"step(1)\"><span class=\"icon-icon_question btn-icon\"></span>提问</a>\n                </div>\n            </div>\n            <div class=\"item-content\" ng-if=\"viewState==1\">\n                <div class=\"form-field-set\">\n                    <div class=\"form-row\" style=\"height:220px;\">\n                        <label><span class=\"font-red\">*</span>问题描述</label>\n                        <textarea ng-model=\"fieldSet.description\" placeholder=\"问题描述\">\n                        </textarea>\n                    </div>\n                    <div class=\"form-row\">\n                        <label><span class=\"font-red\">*</span>联系手机</label>\n                        <input ng-model=\"fieldSet.phone\" placeholder=\"联系手机\">\n                        </input>\n                    </div>\n                    <div class=\"form-row\">\n                        <label><span class=\"font-red\">*</span>联系邮箱</label>\n                        <input ng-model=\"fieldSet.email\" placeholder=\"联系邮箱\">\n                        </input>\n                    </div>\n                </div>\n                <div class=\"btn-area-center\">\n                    <a class=\"btn-normal btn-blue-bg\" ng-click=\"submit()\">提交</a>\n                    <a class=\"btn-normal btn-blue-border\" ng-click=\"step(0)\">取消</a>\n                </div>\n            </div>\n        </div>\n        <div class=\"main-item\" ng-if=\"viewState==0||viewState==2\">\n            <span class=\"icon-icon_rules icon-bg\" ng-style=\"viewState==2?{'font-size':'320px'}:{}\"></span>\n            <div class=\"item-title\">\n                规则引擎相关\n            </div>\n            <div class=\"item-content\" ng-if=\"viewState==0\">\n                <span class=\"item-text\">规则类型,规则维护等规则引擎相关的问题</span>\n                <div class=\"btn-area-right\">\n                    <a class=\"btn-normal btn-blue-bg\" ng-click=\"step(2)\"><span class=\"icon-icon_question btn-icon\"></span>提问</a>\n                </div>\n            </div>\n            <div class=\"item-content\" ng-if=\"viewState==2\">\n                <div class=\"form-field-set\">\n                    <div class=\"form-row\" style=\"height:220px;\">\n                        <label><span class=\"font-red\">*</span>问题描述</label>\n                        <textarea ng-model=\"fieldSet.description\" placeholder=\"问题描述\">\n                        </textarea>\n                    </div>\n                    <div class=\"form-row\">\n                        <label><span class=\"font-red\">*</span>联系手机</label>\n                        <input ng-model=\"fieldSet.phone\" placeholder=\"联系手机\">\n                        </input>\n                    </div>\n                    <div class=\"form-row\">\n                        <label><span class=\"font-red\">*</span>联系邮箱</label>\n                        <input ng-model=\"fieldSet.email\" placeholder=\"联系邮箱\">\n                        </input>\n                    </div>\n                </div>\n                <div class=\"btn-area-center\">\n                    <a class=\"btn-normal btn-blue-bg\" ng-click=\"submit()\">提交</a>\n                    <a class=\"btn-normal btn-blue-border\" ng-click=\"step(0)\">取消</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n",


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'subOrderCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require(['pages/subOrder/subOrder.sync'], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};

});
