/**
 * Created by xx on 15/9/14.
 */
'use strict';

define([], function () {

    return ['factory', 'httpService', function ($http) {
        var _http = function (method, url, param) {
            document.getElementById("loading").style.display = "block";
            param = param || {};
            var rqParams = {
                method: method,
                url: url
            };
            if(method == "GET") {
                rqParams.params = param;
            } else{
                rqParams.data = param;
            }

            return $http(rqParams).then(function(data){
                  if(data.data) data = data.data;
                  document.getElementById("loading").style.display = "none";
                  return data;
            });
        };

        var httpGet = _http.bind(null, "GET");
        var httpPost = _http.bind(null, "POST");


        return {
            http:_http,
            storeProduction: httpPost.bind(null, "/api/production/store"),
            exportOrderExcel: httpPost.bind(null, "/api/order/export"),
            save: function(model, params){
                var url =  "/api/"+model;
                return _http("POST", url, params)
            },
            get: function(model, id){
                var url =  "/api/"+model;
                if(id && typeof id == "string"){
                    url= url+ "/"+id;
                    id = null;
                }
                return httpGet(url, id);
            },
            del: function(model, id){
                var url =  "/api/delete/"+model+"/"+id;
                return _http("POST", url)
            },
            removeParent: function(model, id){
                var url =  "/api/removeParent/"+model+"/"+id;
                return _http("POST", url)
            }
        }

    }]
});