var app = angular.module('RDash');
app.service("utils",function($http,$q,baseUrl){

    return{
        gettoken:function(){
            var timestamp=new Date().getTime();
            timestamp=timestamp.toString()
            timestamp=timestamp.substr(3,timestamp.length);
            return timestamp;
        },
        getSelection:function(key){
            var deferred = $q.defer();
            $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key='+key).success(function(data){
                console.log(data);
                deferred.resolve(data);
            }).error(function(data){
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
})
