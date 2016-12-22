var app = angular.module('RDash');
app.service("utils",function(){

    return{
        gettoken:function(){
            var timestamp=new Date().getTime();
            timestamp=timestamp.toString()
            timestamp=timestamp.substr(3,timestamp.length);
            return timestamp;
        }
    }
})
