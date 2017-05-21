(function() {
	var app = angular.module('feelms',['ui.router']);

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
	    	url: '/search/:keywords',
	    	templateUrl: 'vistas/searchResults.html',
	    	controller: 'searchResultsController'
	    })
	    .state('new-rp', {
	      url: '/film/:peliculaId',
	      templateUrl: 'vistas/film.html',
	      controller: 'filmController'
	    });
	};
	
	app.controller("searchResultsController", function($scope, $stateParams) {
		console.log($stateParams);
		$scope.keywords = $stateParams.keywords;
		console.log($scope.keywords);
	});

	app.controller("searchController", function($scope, $state) {
		$scope.search = function() {
			$state.go("searchResults", {keywords: $scope.keywords});
		}
	});

	app.controller("filmController", function($scope, $stateParams, $http, GETService) {

		function GET_Info_Pelicula(id_pelicula){

	        GETService.GET_Info_Pelicula(id_pelicula)
	        .then(function(respuesta){

	            $scope.data_pelicula = respuesta.data;
	            console.log(respuesta.data);
	        }, function(error){console.log(error)});

        }
	    GET_Info_Pelicula($stateParams.peliculaId);

	});
	
	app.controller('topController', function($scope, $http, GETService) {


		function GET_TOP_Peliculas(cant_peliculas, cant_dias){

	        GETService.GET_TOP_Peliculas(cant_peliculas, cant_dias)
	        .then(function(respuesta){

	            $scope.data_tweets_popularidad = respuesta.data;
	            console.log(respuesta.data);
	        }, function(error){console.log(error)});

        }

		GET_TOP_Peliculas(5,30);

	});

	app.controller('formController', ['$scope', function($scope) {
		$scope.master = {};
		$scope.update = function(pelicula) {
			console.log("que chucha");
			$scope.master = angular.copy(pelicula);
		};
		$scope.reset = function() {
			$scope.pelicula = angular.copy($scope.master);
		};
		console.log(pelicula);
	}]);

	app.directive('headerSection', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/header-section.html'
		};
	});

	app.directive('portfolioSection', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/portfolio-section.html'
		};
	});

	app.directive('aboutSection', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/about-section.html'
		};
	});	

	app.directive('contactSection', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/contact-section.html'
		};
	});

	app.directive('footerSection', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/footer-section.html'
		};
	});


	peliculas = [
		{
			id: 1,
			name: 'Alien: Covenant',
			pop: 250
		},
		{
			id: 2,
			name: 'Star Wars: The Last Jedi',
			pop: 225 
		},
		{	
			id: 3,
			name: 'Guardians of the Galaxy 2',
			pop: 198
		},
		{	
			id: 4,
			name: 'Un jefe en Pañales',
			pop: 100
		},
		{	
			id: 5,
			name: 'Shrek 9',
			pop: 54
		},
		{	
			id: 6,
			name: 'El Aro 5',
			pop: 46
		},
		{
			id: 7,
			name: 'Rápido y Furioso 9000',
			pop: 22
		},
		{	
			id: 8,
			name: 'Cars 4',
			pop: 15
		},
		{
			id: 9,
			name: 'Badilla',
			pop: 0
		},
		{
			id: 10,
			name: 'Faltaba una',
			pop: 0
		},
		{
			id: 11,
			name: 'Aliens vs Cowboys',
			pop: 140
		}
		];
})();