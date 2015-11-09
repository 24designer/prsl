'use strict';

/**
 * @ngdoc function
 * @name presellFrontendApp.controller:ActivitygoodsCtrl
 * @description
 * # ActivitygoodsCtrl
 * Controller of the presellFrontendApp
 */
angular.module('presellFrontendApp')
  .controller('ActivitygoodsCtrl', function ($scope, $filter, $localStorage, $location, httpService, Categorys) {
    // 如果没有设置基本信息 就跳转回去
    if (!$localStorage.activity) { $location.path('/activity/base/0'); return;}
    $scope.prePageInfo = $localStorage.activity;
    // 模板
    $scope.template = 'views/selectgoods.html';
    $scope.process = 1; //当前的步骤
    $scope.isCollapsed = true;
    $scope.module = 'activity'; //当前的模块
    // 导航
    $scope.navs = [{name: '预售管理', active: true}, {name: '活动列表', href: '/'}, {name: '编辑基本信息', href: '/activity/base/c'}, {name: '选择商品', active: true}];

    // 搜索条件
    $scope.good = {orderBy: 'add_time', orderDesc: true, pageIndex: 1, pageSize: 20 };
    // 搜索
    var search = $scope.search = function() {
      // 传到后台搜索条件会发生改变,所以copy一份
      var condition = angular.copy($scope.good);

      if (condition.startPrice) {
        condition.startPrice *= 100;
      } else {
        delete condition.startPrice;
      }

      if (!condition.goodsId) {
        delete condition.goodsId;
      }

      if (condition.endPrice) {
        condition.endPrice *= 100;
      } else {
        delete condition.endPrice;
      }

      httpService.request('aa/search/skus', condition)
        .then(function(result) {
          if (!result) return;

          for (var i = 0; i < result.list.length; i++) {
            var l = result.list[i];
            l.selected = false;
            for (var j = 0; j < $scope.selecteds.length; j++) {
              if (parseInt($scope.selecteds[j].product_id) === parseInt(l.product_id)) {
                l.selected = true;
                break;
              }
            }
          }
          $scope.searchResult = result;
        });
    }

    // 已经选择的商品
    var goodids = [];
    // 表示已经生成了presell items
    if ($localStorage.activity.id && !$localStorage.accessedThree) {
      for (var i = 0; i < $localStorage.activity.reqParams.items.length; i++) {
        goodids.push($localStorage.activity.reqParams.items[i].id + '');
      }
      if (goodids.length > 0) {
        httpService.request('aa/getGoodsByIds', {goodsIds: goodids.join(',')})
          .then(function(response) {
            $scope.selecteds = response;
            search();
          });
      }
    } else {
        $scope.selecteds = $localStorage.goods ? $localStorage.goods : [];
        search();
    }

    // 查询的商品
    // 排序项
    $scope.sorts = [{name: '创建时间', value: 'add_time', desc: true}, {name: '价格', value: 'sale_price', desc: true}];
    // 排序
    $scope.sortBy = function(sort) {
      $scope.good.orderDesc = sort.desc;
      $scope.good.orderBy = sort.value;
      $scope.search();
    }
    // 全选
    $scope.toggleAll = function() {
      var unSelected = $filter('filter')($scope.searchResult.list, {selected: false});
      for (var i = 0; i < unSelected.length; i++) {
        $scope.selecteds.push(unSelected[i]);
        unSelected[i].selected = true;
      }
    }
    // 移除一个商品
    $scope.removeOne = function(g, index) {
      $scope.selecteds.splice(index, 1);
      for (var i = 0; i < $scope.searchResult.list.length; i++) {
        if (parseInt($scope.searchResult.list[i].product_id) === parseInt(g.product_id)) {
          $scope.searchResult.list[i].selected = false;
          break;
        }
      }
    }
    // 移除所有商品
    $scope.removeAll = function() {
      $scope.selecteds.length = 0;
      for (var i = 0; i < $scope.searchResult.list.length; i++) {
        $scope.searchResult.list[i].selected = false;
      }
    };
    // 添加或移除商品
    $scope.toggleOne = function(g){
      g.selected = !g.selected;
      if (g.selected) {
        $scope.selecteds.push(g);
      } else {
        for (var i = 0; i < $scope.selecteds.length; i++) {
          if ($scope.selecteds[i].id === g.id) {
            $scope.selecteds.splice(i,1);
            break;
          }
        }
      }
    };

    Categorys.categorys().then(function(res) {
       $scope.firstLevels = res;
    });

    $scope.secondLevels = [];
    $scope.thirdLevels = [];
    $scope.cates = {f: '', s: '', t: ''};
    $scope.changeItem = function(level) {
      if (level === 'f') {
        $scope.secondLevels = !$scope.cates.f ? [] : $scope.cates.f.list;
        $scope.thirdLevels.length = 0;
      } else if (level === 's') {
        $scope.thirdLevels = !$scope.cates.s ? [] : $scope.cates.s.list;
      }
      if ($scope.cates.t) {
        $scope.good.catId = parseInt($scope.cates.t.cat_id);
      } else if($scope.cates.s) {
        $scope.good.catId = parseInt($scope.cates.s.cat_id);
      } else if($scope.cates.f) {
        $scope.good.catId = parseInt($scope.cates.f.cat_id);
      } else {
        delete $scope.good.catId;
      }
    }


    // 下一步
    $scope.nextStep = function() {
      if ($scope.isCollapsed) {
        $scope.isCollapsed = false;
      }

      if ($scope.selecteds.length === 0) {
        alert('未选择商品');
        return;
      }

      var ids = [];
      for (var i = 0; i < $scope.selecteds.length; i++) {
        ids.push($scope.selecteds[i].product_id);
      }

      httpService.post('aa/validateByStep', {step: 2, activity: $localStorage.activity.id, productIds: ids.join(',')})
        .then(function(res) {
          if (res) {
            $localStorage.goods = $scope.selecteds;
            delete $localStorage.accessedThree;
            $location.path('/activity/setting');
          }
        });
    }
  });
