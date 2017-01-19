var app = angular.module('RDash');
app.service("utils",function($http,$q,baseUrl,$timeout){
    var selections = {};
    return{
        gettoken:function(){
            var timestamp=new Date().getTime();
            timestamp=timestamp.toString()
            timestamp=timestamp.substr(3,timestamp.length);
            return timestamp;
        },
        getSelection:function(key){
            var deferred = $q.defer();
            if(selections[key]){
                $timeout(function(){
                    deferred.resolve(selections[key]);
                });
                return deferred.promise;
            }
            $http.get(baseUrl.getUrl()+'/api/1/common/choices/?key='+key).success(function(data){
                // angular.forEach(data.data,function(obj,key){
                //     var sel = {};
                //     angular.merge(sel,{'':'请选择'},obj);
                //     data.data[key]=sel;
                // });
                selections[key]=data.data;
                deferred.resolve(data.data);
            }).error(function(data){
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
})
