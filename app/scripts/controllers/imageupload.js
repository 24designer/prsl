'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:ImageuploadCtrl
 * @description
 * # ImageuploadCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('ImageuploadCtrl', function ($scope, $modalInstance, method, Upload, $timeout) {

    $scope.method = method;
    $scope.successed = false;
    $scope.failed = false;

    var fulltime = function(){
      var thisTime = new Date();
      return thisTime.getFullYear() + '-' + (thisTime.getMonth() + 1)
           + '-' + thisTime.getDate() + ' ' + thisTime.getHours()
           + ':' + thisTime.getMinutes() + ':' + thisTime.getSeconds();
    };

    var url = 'http://115.29.209.148/index.php?method=upload_image&appkey=HTML65W23K7&sign_method=1&v=1&timestamp=' + fulltime();

    $scope.ok = function (file) {
      $scope.formUpload = true;
      if (file != null) {
        upload(file)
      }
    };

    var upload = function(file) {
      $scope.successed = false;
      $scope.failed = false;
      file.upload = Upload.upload({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': file.type
        },
        data: {updata:file}
      });
      file.upload.then(function (response) {
        if (response) {
          $scope.successed = true;
          $timeout(function() {
              $modalInstance.close(response.data.data);
          }, 1000);

        } else {
          $scope.failed = true;
        }
      }, function (response) {

      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        // file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
