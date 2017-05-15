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

	app.controller("filmController", function($scope, $stateParams, $http) {
		 var urlBase = "https://localhost";
	    $scope.peliculaId = $stateParams.peliculaId;
	    this.peliculaId = $scope.peliculaId;
	    this.peliculas = peliculas;	// sólo para probar con datos de acá mismo


	    //Entrada : ID Pelicula
	    //Salida  : Array con los datos de la pelicuka
	    //Obtener información de la pelicula
	    $scope.GET_Info_Pelicula = function(id_pelicula){

	    	id_pelicula = 3;
	    	//Cambiar al finalizar debug
	    	var url = "http://localhost:8080/json_test/info_peli.json";
	    	//var url = urlBase + "/feelms/api/films/" + id_pelicula;

	    	$http.get(url).
	        then(function(respuesta) {
	            $scope.data_pelicula = respuesta.data;
	            console.log(respuesta.data);
	        });
	    }

	    $scope.GET_Info_Pelicula($scope.peliculaId);

	    //Entrada : ID pelicula, Cantidad de días
	    //Salida : Contador de tweets de la pelicula para cada dia señalado
	    // Ejemplo de llamado: /feelms/api/films/{film_id}/tweets/count/{days}
	    $scope.GET_Cant_Tweets_Pelicula = function(id_pelicula, cant_dias){


	    	//Cambiar al finalizar debug
	    	var url = "localhost:8080/json_test/cant_tweets.json";
	    	//var url = urlBase + "/feelms/api/films/" + id_pelicula + "/tweets/count/" + cant_dias;

	    	$http.get(url).
	        then(function(respuesta) {
	           $scope.data_tweets_pelicula = respuesta.data;
	        });
	    }

	    //Entrada : cant_dias, dias
	    //Salida : TOP X de peliculas a partir de cantidad de tweets en Y días
	    // Ejemplo de llamado: /feelms/api/top/{cantidad}/days/{days}
	    $scope.GET_TOP_Peliculas = function(cant_peliculas, cant_dias){


	    	//Cambiar al finalizar debug
	    	var url = "localhost:8080/json_test/top.json";
	    	//var url = urlBase + "/feelms/api/top/"+ cant_peliculas + "/days/" + cant_dias; 

	    	$http.get(url).
	        then(function(respuesta) {
	            $scope.data_tweets_pelicula = respuesta.data;
	        });
	    }

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