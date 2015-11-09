'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:PromotionsettingCtrl
 * @description
 * # PromotionsettingCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('PromotionsettingCtrl', function ($scope, $localStorage, $location, $uibModal, $filter, httpService) {
    // 跳回基本信息
    if (!$localStorage.promotion) {
      $location.path('/promotion/base/0');
      return;
    }

    // 跳回货物选择
    if (!$localStorage.goods) {
      $location.path('/promotion/goods');
      return;
    }

    $scope.template = 'views/promotionsetting.html';

    $scope.promotion = $localStorage.promotion;
    // 为了不改变本地存储的已选择的goods,copy一份
    $scope.goods = angular.copy($localStorage.goods);

    // input 最小输入的数字
    $scope.defaultbuynumber = 1;

    // 记录下已经访问过这个页面的标示到本地, 用于选择商品的页面
    $localStorage.accessedPromotionThree = true;

    // 当前进行到的步骤
    $scope.process = 2;
    $scope.navs = [{name: '限时促销', active: true}, {name: '活动列表', href: '/promotion/'}, {name: '编辑基本信息',
      href: '/promotion/base/c'}, {name: '选择商品', href: '/promotion/goods'},{name: '设置方案', active: true}];

    //将渠道的ID转换成文字.
    $scope.channels = [];
    var channelstmp = []; //该死的后台字段名称不统一
    for (var i = 0; i < $scope.promotion.channel.length; i++) {
      var c = $scope.promotion.channel[i];
      $scope.channels.push(['pc', 'app', 'h5'][parseInt(c) - 1]);
      channelstmp.push(['Pc', 'App', 'H5'][parseInt(c) - 1]);
    }

    // 判断是否储存了预售数组
    var limits;
    // 根据商品生成预售数组
    $localStorage.limits = limits = (function(goods) {
      // 设置是否推上首页 默认为false
      var homepages = [];
      for (var i = 0; i < $scope.promotion.channel.length; i++) {
        homepages.push('0');
      }
      var p = [];
      for (var i = 0; i < goods.length; i++) {
        var exist = false;
        var g = goods[i];
        // 在修改的时候 如果当前活动内存在items, 取商品和items的并集,优先添加item。
        if ($scope.promotion.reqParams.items) {
          for (var j = 0; j < $scope.promotion.reqParams.items.length; j++) {
            var e = $scope.promotion.reqParams.items[j];
            if (parseInt(e.id) === parseInt(g.product_id)) {
              e.imgurl = g.imgurl;
              exist = true;
              p.push(e);
              break;
            }
          }
        }

        if (exist) continue;

        var promotion = {
          id: g.product_id,
          name: g.product_name,
          price: parseFloat(g.sale_price),
          imgurl: g.imgurl,
          cat: g.cat_name,
          store: g.quantity,
          sortNum: i,
          belongUnitePrice: false
        }

        p.push(promotion);
      }
      return p;
    })($scope.goods);

    // 根据sortNum排序.
    $scope.limits = $filter('orderBy')(limits, 'sortNum');
    $scope.promotion.reqParams.items = $scope.limits;

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
      if ($scope.limits.length === 0) {
        alert('没有参加活动的商品');
        return;
      }
      for (var i = 0; i < $scope.limits.length; i++) {
        var p = $scope.limits[i];
        p.sortNum = i + 1;
      }
      // 如果没有勾选一项,默认为没有勾选
      if ($filter('filter')($scope.limits, {belongUnitePrice: true}).length === 0) {
        $scope.promotion.reqParams.setType = 0;
        resetUnitePrice();
      } else { //如果有勾选 但是未设置批量价 重置所有belongUnitePrice为false
        if ($scope.promotion.reqParams.setType === 0) {
          for (var i = 0; i < $scope.limits.length; i++) {
            $scope.limits[i].belongUnitePrice = false;
          }
        }
      }

      // 设置toolId;
      $scope.promotion.toolId = 2000;
      //暂时保存在本地.
      $localStorage.promotion = $scope.promotion;

      // 存在ID表示修改.
      if ($scope.promotion.id) {
        // 删除两个不必要的字段. 省的转换
        delete $scope.promotion.createTime;
        delete $scope.promotion.lastModify;
        httpService.post('aa/update', $scope.promotion)
          .then(function(result) {
            if (result) {
              $localStorage.$reset({ action: 'update' });
              $location.path('/promotion/finish/' + $scope.promotion.id);
            }
          });
      } else {
        httpService.post('aa/create', $scope.promotion)
         .then(function(result) {
           if (result) {
             $localStorage.$reset({ action: 'add' });
             $location.path('/promotion/finish/' + result.v);
           }
         });
      }
    }

    //弹出选择图片的modal
    $scope.open = function () {
      if ($filter('filter')($scope.limits, {belongUnitePrice: true}).length === 0) {
        alert('没有选择商品.');
        return;
      }
      var modalInstance = $uibModal.open({
        templateUrl: 'batchSetPrice.html',
        controller: 'BatchsetpriceCtrl',
        size: 'lg',
        resolve: {
          promotion: function() {
            return $scope.promotion;
          },
          channels: function() {
            return channelstmp;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result) {
          $scope.promotion.reqParams.setType = result.setType;
          switch (result.setType) {
            case 0:
              for (var i = 0; i < $scope.limits.length; i++) {
                $scope.limits[i].belongUnitePrice = false;
              }
              resetUnitePrice();
              break;
            case 1:
              $scope.promotion.reqParams.unitePcPrice = result.unitePcPrice;
              $scope.promotion.reqParams.uniteAppPrice = result.uniteAppPrice;
              $scope.promotion.reqParams.uniteH5Price = result.uniteH5Price;
              break;
            case 2:
              resetUnitePrice();
              $scope.promotion.reqParams.quota = result.quota;
              break;
            default:
          }
        }
      }, function () {
      });
    };

    $scope.allToggled = false;

    $scope.toggleAll = function(a) {
      for (var i = 0; i < $scope.limits.length; i++) {
        $scope.limits[i].belongUnitePrice = a;
      }
    }

    var resetUnitePrice = function() {
      delete $scope.promotion.reqParams.unitePcPrice;
      delete $scope.promotion.reqParams.uniteAppPrice;
      delete $scope.promotion.reqParams.uniteH5Price;
      delete $scope.promotion.reqParams.quota;
    }

    // 分页信息
    $scope.pagination = {
      size: 100,
      cpage: 1,
      total: $scope.limits.length
    }

    //最小pagesize
    $scope.pageMinSize = 1;

    // 分页页面改变
    $scope.pageChange = function() {
      var start = ($scope.pagination.cpage - 1) * $scope.pagination.size;
      var end = start + $scope.pagination.size;
      $scope.pagination.items = $scope.limits.slice(start, $scope.limits.length < end ? $scope.limits.length : end);
    }

    $scope.$watch('pagination.size', function(){
      $scope.pageChange();
    });

    // 删除
    $scope.removeOne = function(index) {
      var limitsIndex = ($scope.pagination.cpage - 1) * $scope.pagination.size + index;
      $scope.limits.splice(limitsIndex, 1);
      $scope.pagination.total = $scope.limits.length;
      $scope.pageChange();
    }
  });
