/**
 * Created by xx on 15/11/17.
 */

define([], function () {

    return ['fileUpload',  function() {

        console.log("Sssddgggkjkjjg");
        return {
            restrict: 'E',
            template: function(element, attrs) {
                var accept = attrs.accept || 'image/*';
                var htmlText = "<button class='btn btn-primary'  type='file' ngf-select='uploadFiles($file, $invalidFiles)'"+
                    "accept='"+accept+"' ngf-max-height='1000' ngf-max-size='10MB'>"+
                    "{{title}}</button>";
                return htmlText;
            },
            scope: {
                successCallback: '&onSuccess',
                title: '@',
                url:'@'
            },
            controller: ["$scope", "Upload", "$timeout", function($scope, Upload, $timeout) {
                var url = $scope.url || '/upload';
                $scope.uploadFiles = function(file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];
                    if (file) {
                        file.upload = Upload.upload({
                            url: url,
                            data: {file: file}
                        });

                        file.upload.then(function (response) {
                            console.log(response);
                            if(response.data && response.data.url ) {
                                $timeout(function () {
                                    $scope.successCallback({url:response.data.url});
                                });
                            }
                        }, function (response) {
                            console.log(response);
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };
            }],
        };



    }]
});