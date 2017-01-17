define('pages/analysis/analysis', function(require, exports, module) {


module.exports = {
    url: '/analysis',
    template: "<div class=\"expectBlock-wrap\">\n    <div class=\"expectBlock relative\">\n        <div class=\"expectBlockCont\">\n            <p class=\"expectBlockIcon icon-icon_smile\"></p>\n\n            <p class=\"expectBlockTip text-center margin-top-10\">敬请期待</p>\n        </div>\n    </div>\n</div>\n",


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'analysisCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require(['pages/analysis/analysis.sync'], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};


});
