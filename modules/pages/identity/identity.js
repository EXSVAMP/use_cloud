
module.exports = {
    url: '/identity',
    template: __inline('./identity.html'),

    params:{projectId:null},
    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'identityCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'identity.sync'
            ], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};
