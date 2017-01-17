
var app = angular.module('RDash');
app.register.controller("manageCtr", function ($scope, $http, $location, $uibModal,$interval,$cookieStore,$cookieStore, baseUrl, $rootScope,utils) {
    var BaseUrl = baseUrl.getUrl();
    var urlData = $location.search();
     $scope.projectName = urlData.projectName;
     $scope.projectId = urlData.projectId;
     $scope.params={
       orderCount:"",
   }

   $http.get(BaseUrl+"/api/1/work_order/?is_page=1").success(function(data){
       if(data.code==200){
           $scope.params.orderCount=data.pageinfo.total_number;
       }

   })








})
