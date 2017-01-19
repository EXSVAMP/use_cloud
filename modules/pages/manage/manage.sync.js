
var app = angular.module('RDash');
app.register.controller("manageCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    var BaseUrl = baseUrl.getUrl();
    var urlData = $location.search();
     $scope.projectName = urlData.projectName;
     $scope.projectId = urlData.projectId;
     $scope.params={
       orderCount:"",
       emailCount:"",
   }

   $http.get(BaseUrl+"/api/1/work_order/?is_page=1").success(function(data){
       if(data.code==200){
           $scope.params.orderCount=data.pageinfo.total_number;
       }

   })
  $http.get(BaseUrl+"/api/1/message/count/?status=0").success(function(data){
      if(data.code==200){
          $scope.params.emailCount=data.data;
      }
  })
 $http.get(BaseUrl+"/api/1/user/login").success(function(data){
     if(data.code==200){
         $scope.user_name=data.data.username;
         $scope.email_active=data.data.email_is_active;
     }
 })

$http.get(BaseUrl+"/api/1/homepage/count").success(function(data){
    if(data.code==200){
        $scope.query_result=data.data;
    }
})




})
