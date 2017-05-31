'use strict';

var app = angular.module("feelms",["ui.router", "d3"]);
angular.module('d3', []);

	app.config(['$stateProvider', '$urlRouterProvider', registerRoutes]);
	app.run(['$rootScope', '$location', function($rootScope, $location) {
	  $rootScope.$location = $location;
	}]);

	function registerRoutes($stateProvider, $urlRouterProvider) {
  	  $urlRouterProvider.otherwise('/');
	  $stateProvider
	    .state('home', {
	    	url: '/',
	      	templateUrl: 'vistas/home.html'
	    })
	    .state('rank', {
	    	url: '/',
	    	templateUrl: 'vistas/rank.html'
	    })
	    .state('admin', {
	    	url: '/',
	    	templateUrl: 'vistas/admin.html'
	    })
	    .state('searchResults', {
	    	url: '/search/:query',
	    	templateUrl: 'vistas/searchResults.html',
	    	controller: 'searchResultsController'
	    })
	    .state('new-rp', {
	      url: '/film/:peliculaId',
	      templateUrl: 'vistas/film.html',
	      controller: 'filmController'
	    })
		.state('test', {
	    	url: '/testD3',
	    	templateUrl: 'vistas/test.html'
	    });
	};
