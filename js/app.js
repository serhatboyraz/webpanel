var anketbazApp = angular.module('anketbazApp', ['ui.router', 'ui.bootstrap', 'chart.js']);

anketbazApp.run(function ($rootScope, WsProviderService, UserService, $state) {
    $rootScope.WsProviderService = WsProviderService;
    $rootScope.GetFieldTitle = GetFieldTitle;
    $rootScope.DateNow= new Date();
    $rootScope.CheckUser = function () {
        $rootScope.User = UserService.GetUser();
        if ($rootScope.User == null) {
            $state.go('login');
        }
    };
});

anketbazApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl:'templates/landing/index.html'
            //controller: 'RouterController'
        })
        .state('router', {
            url: '/router',
            controller: 'RouterController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('logout', {
            url: '/logout',
            controller: 'LogOutController'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterController'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            abstract: true
        })
        .state('dashboard.main', {
            url: '/main',
            templateUrl: 'templates/dashboard-main.html',
            controller: 'MainController'
        })
        .state('dashboard.createpoll', {
            url: '/createpoll',
            templateUrl: 'templates/dashboard-createpoll.html',
            controller: 'CreatePollController'
        })
        .state('dashboard.viewpoll', {
            url: '/viewpoll/:pollid',
            templateUrl: 'templates/viewpoll/dashboard-viewpoll.html',
            controller: 'ViewPollController'
        })
        .state('notfound', {
            url: '/notFound',
            templateUrl: 'templates/404.html'
        });
    $urlRouterProvider.otherwise('/router');
});


anketbazApp.filter('stringToDate', function () {
    return function (data) {
        return data.substring(6, 8) + "/" + data.substring(4, 6) + "/" + data.substring(0, 4);
    }
});

anketbazApp.filter('stringToTime', function () {
    return function (data) {
        if(data==undefined)return '00:00:00';
        return data.substring(0, 2) + ":" + data.substring(2, 4)+ ":" + data.substring(4, 6);
    }
});

