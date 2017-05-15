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
	      	templateUrl: 'home.html'
	    })
	    .state('rank', {
	    	url: '/',
	    	templateUrl: 'rank.html'
	    })
	    .state('new-rp', {
	      url: '/film/:peliculaId',
	      templateUrl: 'film.html',
	      controller: 'filmController'
	    });
	};

	app.controller("filmController", function($scope, $stateParams) {
	    $scope.peliculaId = $stateParams.peliculaId;
	    this.peliculaId = $scope.peliculaId;
	    this.peliculas = peliculas;	// sólo para probar con datos de acá mismo
	});

	app.controller('topController', function() {
		this.peliculas = peliculas;	// sólo para probar con datos de acá mismo
	});

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