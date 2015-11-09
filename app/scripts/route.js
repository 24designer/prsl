angular
  .module('presellFrontendApp')
  .config(function ($routeProvider) {
    $routeProvider
      /** ***********预售************* **/
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/:type/step3/:id', {
        controller: 'StepthreeCtrl',
        templateUrl: 'views/about.html',//这里制定一个空页面以便于完成跳转
      })
      .when('/activity/base/:editId', {
        templateUrl: 'views/pagestructure.html',
        controller: 'ActivitybaseCtrl'
      })
      .when('/activity/goods', {
        templateUrl: 'views/pagestructure.html',
        controller: 'ActivitygoodsCtrl'
      })
      .when('/activity/setting', {
        templateUrl: 'views/pagestructure.html',
        controller: 'ActivitysettingCtrl'
      })
      .when('/activity/finish/:id', {
        templateUrl: 'views/pagestructure.html',
        controller: 'ActivityfinishCtrl'
      })
      .when('/presell/:id', {
        templateUrl: 'views/presell.html',
        controller: 'PresellCtrl'
      })
      /** ***********限时促销************* **/
      .when('/promotion', {
        templateUrl: 'views/promotion.html',
        controller: 'PromotionCtrl'
      })
      .when('/promotion/base/:editId', {
        templateUrl: 'views/pagestructure.html',
        controller: 'PromotionbaseCtrl'
      }).when('/promotion/goods', {
        templateUrl: 'views/pagestructure.html',
        controller: 'PromotiongoodsCtrl'
      }).when('/promotion/setting', {
        templateUrl: 'views/pagestructure.html',
        controller: 'PromotionsettingCtrl'
      }).when('/promotion/finish/:id', {
        templateUrl: 'views/pagestructure.html',
        controller: 'PromotionfinishCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
