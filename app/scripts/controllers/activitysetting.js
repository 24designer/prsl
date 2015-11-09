'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:ActivitysettingCtrl
 * @description
 * # ActivitysettingCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('ActivitysettingCtrl', function ($scope, $localStorage, $location, $uibModal, $filter, httpService) {
    // 跳回基本信息
    if (!$localStorage.activity) {
      $location.path('/activity/base/0');
    }
    // 跳回货物选择
    if (!$localStorage.goods) {
      $location.path('/activity/goods');
    }

    $scope.template = 'views/activitysetting.html';

    $scope.activity = $localStorage.activity;

    // 为了不改变本地存储的已选择的goods,copy一份
    $scope.goods = angular.copy($localStorage.goods);

    // input 最小输入的数字
    $scope.defaultbuynumber = 1;

    // 记录下已经访问过这个页面的标示到本地, 用于选择商品的页面
    $localStorage.accessedThree = true;

    // 当前进行到的步骤
    $scope.process = 2;
    $scope.navs = [{name: '预售管理', active: true}, {name: '活动列表', href: '/'}, {name: '编辑基本信息',
      href: '/activity/base/c'}, {name: '选择商品', href: '/activity/goods'},
      {name: '设置团购', active: true}];

    //将渠道的ID转换成文字.
    $scope.channels = [];
    for (var i = 0; i < $scope.activity.channel.length; i++) {
      var c = $scope.activity.channel[i];
      $scope.channels.push(['pc', 'app', 'h5'][parseInt(c) - 1]);
    }

    // 判断是否储存了预售数组
    var presells;
    // 根据商品生成预售数组
    $localStorage.presells = presells = (function(goods) {
      // 设置是否推上首页 默认为false
      var homepages = [];
      for (var i = 0; i < $scope.activity.channel.length; i++) {
        homepages.push('0');
      }
      var p = [];
      for (var i = 0; i < goods.length; i++) {
        var exist = false;
        var g = goods[i];
        // 在修改的时候 如果当前活动内存在items, 取商品和items的并集,优先添加item。
        if ($scope.activity.reqParams.items) {
          for (var j = 0; j < $scope.activity.reqParams.items.length; j++) {
            var e = $scope.activity.reqParams.items[j];
            if (parseInt(e.id) === parseInt(g.product_id)) {
              for (var k = 0; k < $scope.channels.length; k++) {
                var imgurl = e[$scope.channels[k] + 'ImgUrl'];
                if (imgurl.indexOf('http') === 0) {
                    e[$scope.channels[k] + 'ImgUrl1'] = imgurl;
                }
                var hp = e[$scope.channels[k] + 'PlaceHomePage'];
                e[$scope.channels[k] + 'PlaceHomePage'] = hp ? '1' : '0';
              }
              exist = true;
              p.push(e);
              break;
            }
          }
        }

        if (exist) continue;

        var presellPrices = [];
        var price = g.sale_price;

        var presell = {
          id: g.product_id, name: g.product_name, price: price,
          appImgUrl: '', pcImgUrl: '', h5ImgUrl: '',
          homepages: angular.copy(homepages),
          mainTitle: '',
          maxActStock: g.quantity, minNumPerOrder: g.min_number ? g.min_number : 1,
          maxNumPerOrder: g.max_number,
          maxNumPerIDOneday: '', maxNumPerIDTotal: '',
          sortNum: i
        }

        angular.forEach($scope.channels, function(c) {
          presell[c + 'Price'] = price;
          presell[c + 'PlaceHomePage'] = '0';
        });
        p.push(presell);
      }
      return p;
    })($scope.goods);

    // 根据sortNum排序.
    $scope.presells = $filter('orderBy')(presells, 'sortNum');
    $scope.activity.reqParams.items = $scope.presells;

    $scope.products = {};
    $scope.getproducts = function(id) {
      if ($scope.products[id]) return;
      httpService.request('aa/getSkusByGoodsId', {goodsId: id})
        .then(function(result) {
          $scope.products[id] = result;
        });
    }


    // 下一步
    $scope.nextStep = function() {
      for (var i = 0; i < $scope.presells.length; i++) {
        var p = $scope.presells[i];
        p.sortNum = i + 1;
        for (var j = 0; j < $scope.channels.length; j++) {
          var c = $scope.channels[j];
          p[c + 'PlaceHomePage'] = parseInt(p[c + 'PlaceHomePage']) === 0 ?  false : true;
        }
      }
      $scope.activity.toolId = 12000;
      $localStorage.activity = $scope.activity;
      // 存在ID表示修改.
      if ($scope.activity.id) {
        delete $scope.activity.createTime;
        delete $scope.activity.lastModify;
        httpService.post('aa/update', $scope.activity)
          .then(function(result) {
            if (result) {
              $localStorage.$reset({ action: 'update' });
              $location.path('activity/finish/' + $scope.activity.id);
            }
          });
      } else {
        httpService.post('aa/create', $scope.activity)
         .then(function(result) {
           if (result) {
             $localStorage.$reset({ action: 'add' });
             $location.path('/activity/finish/' + result.v);
           }
         });
      }
    }

    //弹出选择图片的modal
    $scope.open = function (method, index) {
      var modalInstance = $uibModal.open({
        templateUrl: 'uploadimg.html',
        controller: 'ImageuploadCtrl',
        size: 'lg',
        resolve: {
          method: function () {
            return method;
          }
        }
      });
      modalInstance.result.then(function (data) {
        $scope.presells[index][method + 'ImgUrl'] = data.imageid;
        // 添加一个冗余字段来区别urlID和 真实url。
        $scope.presells[index][method + 'ImgUrl1'] = data.imageurl;
      }, function () {
      });
    };


    // 分页信息
    $scope.pagination = {
      size: 5,
      cpage: 1,
      total: $scope.presells.length
    }

    //最小pagesize
    $scope.pageMinSize = 1;

    // 分页页面改变
    $scope.pageChange = function() {
      var start = ($scope.pagination.cpage - 1) * $scope.pagination.size;
      var end = start + $scope.pagination.size;
      $scope.pagination.items = $scope.presells.slice(start, $scope.presells.length < end ? $scope.presells.length : end);
    }

    $scope.$watch('pagination.size', function(){
      $scope.pageChange();
    });


    // 删除
    $scope.removeOne = function(index) {
      var presellsIndex = ($scope.pagination.cpage - 1) * $scope.pagination.size + index;
      $scope.presells.splice(presellsIndex, 1);
      $scope.pagination.total = $scope.presells.length;
      $scope.pageChange();
    }
  });
