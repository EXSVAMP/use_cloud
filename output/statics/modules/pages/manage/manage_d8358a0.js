define('pages/manage/manage', function(require, exports, module) {


module.exports = {
    url: '/manage',
    template: "<div class=\"manageControll\">\n    <div class=\"user_detail\">\n      <div class=\"img_wrap\">\n        <img src=\"/statics/lib/img/head_698cbad.svg\" class=\"user_img\" />\n        <div class=\"use_wrap\">\n            <span class=\"user_name\">DEVIC</span>\n            <img class=\"phone\" src=\"/statics/lib/img/phone_20862b8.svg\"/>\n            <span class=\"icon-icon_mail\"></span>\n        </div>\n          <div class=\"order_wrap\">\n              <span class=\"icon-icon_worksheet\"></span>\n              <p class=\"order_detail\">\n                  <span>工单</span>\n                  <span class=\"count\">（12）</span>\n              </p>\n          </div>\n          <div class=\"interval_line\"></div>\n          <div class=\"order_wrap\">\n              <span class=\"icon-icon_mail\"></span>\n              <p class=\"order_detail\">\n                  <span>站内信</span>\n                  <span class=\"count\">（2）</span>\n              </p>\n          </div>\n      </div>\n    </div>\n    <div class=\"service_detail\">\n       <div class=\"service_name\">\n          <span>所有服务</span>\n       </div>\n        <div class=\"service_wrap\">\n            <div class=\"service_detail_single\">\n               <span class=\"icon-icon_theme\"></span>\n                <p class=\"service_desc\">主题管理</p>\n                <p class=\"service_desc_count\">\n                    <span>实例总数</span>\n                    <span class=\"service_count\">（2）</span>\n                </p>\n            </div>\n            <div class=\"service_detail_single\">\n                <span class=\"icon-icon_theme\"></span>\n                <p class=\"service_desc\">主题管理</p>\n                <p class=\"service_desc_count\">\n                    <span>实例总数</span>\n                    <span class=\"service_count\">（2）</span>\n                </p>\n            </div>\n            <div class=\"service_detail_single\">\n                <span class=\"icon-icon_theme\"></span>\n                <p class=\"service_desc\">主题管理</p>\n                <p class=\"service_desc_count\">\n                    <span>实例总数</span>\n                    <span class=\"service_count\">（2）</span>\n                </p>\n            </div>\n            <div class=\"service_detail_single\">\n                <span class=\"icon-icon_theme\"></span>\n                <p class=\"service_desc\">主题管理</p>\n                <p class=\"service_desc_count\">\n                    <span>实例总数</span>\n                    <span class=\"service_count\">（2）</span>\n                </p>\n            </div>\n            <div class=\"service_detail_single\">\n                <span class=\"icon-icon_theme\"></span>\n                <p class=\"service_desc\">主题管理</p>\n                <p class=\"service_desc_count\">\n                    <span>实例总数</span>\n                    <span class=\"service_count\">（2）</span>\n                </p>\n            </div>\n            <div class=\"service_detail_single single_more\">\n                <span class=\"icon-icon_more\"></span>\n                <p class=\"service_desc wait\">敬请期待</p>\n                <p class=\"service_desc_count\">\n                    <span>更多服务</span>\n                </p>\n            </div>\n\n        </div>\n\n    </div>\n\n\n    <div style=\"clear: both\"></div>\n</div>\n\n",


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'manageCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require(['pages/manage/manage.sync'], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};

});
