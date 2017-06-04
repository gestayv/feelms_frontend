'use strict';

var app = angular.module("feelms",["ui.router", "d3v4","d3v3","nv"]);
angular.module('d3v4', []);
angular.module('d3v3', []);
angular.module('nv', []);




	app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', registerRoutes]);
	app.run(['$rootScope', '$location', function($rootScope, $location) {
	  $rootScope.$location = $location;
	}]);

	function registerRoutes($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
	  $sceDelegateProvider.resourceUrlWhitelist(['https://www.youtube.com/embed/*?rel=0', 'self']);
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
	    .state('genresRank', {
	    	url: '/',
	    	templateUrl: 'vistas/genres.html'
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
		.state('grafoPeliculas', {
	    	url: '/',
	    	templateUrl: 'vistas/grafo.html'
	    })
	    .state('comparison', {
	    	url: '/compare/:firstId/:secondId',
	    	templateUrl: 'vistas/compare.html',
				controller: 'comparisonController'
	    });
	};
