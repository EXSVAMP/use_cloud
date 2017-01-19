
var RDash_web = angular.module('RDash');
function RDashInterceptor() {

    this.config = {
        usecloud_token: 'usecloud-token',

    };

    this.$get = ['$log', '$cookieStore', '$q', '$location','$rootScope', function($log, $cookieStore, $q, $location,$rootScope) {
        var self = this;

        return {
            request: function(request) {
                var security = sessionStorage.getItem("user_token");
                if(security){
                    request.headers["usecloud-token"] =security;
                }else{

                }

                return request;
            },
            requestError: function(error) {
                return $q.reject(error);
            },
            response: function(response) {
                if (response.headers) {

                    var headers = response.headers();
                    var security = sessionStorage.getItem("user_token");
                    if (security) {
                        security = headers[self.config.usecloud_token];
                    }
                }
                return response;
            },
            responseError: function(response) {
                console.log("后台出错!")
              // window.location.href="/index.html"

                return $q.reject(response);
            }
        };
    }];

};
//loading
RDash_web.factory('timestampMarker', ["$rootScope", function ($rootScope) {
    var timestampMarker = {
        request: function (config) {
            $rootScope.loading = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
            // $rootScope.loading = false;
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}]);


RDash_web.provider('RDashInterceptor', RDashInterceptor);


RDash_web.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('RDashInterceptor');
    $httpProvider.interceptors.push('timestampMarker');
}]);
