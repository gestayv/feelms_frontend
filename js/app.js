(function() {
	var app = angular.module("feelms",["ui.router"]);

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
	    });
	};

	app.controller("formController", function($scope,$http) {
	    $scope.master = {};
	    $scope.update = function(pelicula) {
	      var to_list = pelicula.genres;
	      to_list = to_list.split(",");
	      pelicula.genres = to_list;
	      var to_list = pelicula.keywords;
	      to_list = to_list.split(",");
	      pelicula.keywords = to_list;
	      $scope.master = angular.copy(pelicula);
	      var req = {
	       method: 'POST',
	       url: 'http://131.221.33.124:8080/feelms/api/admin/add/film',
	       headers: {
	         'Content-Type': 'application/json'
	       },
	       data: $scope.master
	      }
	      $http(req).then(function(response){
	        console.log(response);
	      }, function(response){
	        console.log(response);
	      });
	    };

	    $scope.reset = function() {
	      $scope.pelicula = angular.copy($scope.master);
	    };

	    $scope.list_genre = [];
	    //$scope.text_genre = 'hello';
	    $scope.submitgenres = function() {
	        if(angular.isArray($scope.pelicula.genre) == false)
	        {
	         $scope.pelicula.genre = [];
	        }
	        $scope.pelicula.genre.push(parseInt(this.text_genre));
	        $scope.list_genre.push(parseInt(this.text_genre));
	        $scope.text_genre = '';  
	    };

	    $scope.submitkeywords = function() {
	        if(angular.isArray($scope.pelicula.keywords) == false)
	        {
	         $scope.pelicula.keywords = [];
	        }
	        $scope.pelicula.keywords.push(parseInt(this.text_keywords));
	        $scope.list_genre.push(parseInt(this.text_keywords));
	        $scope.text_keywords = '';  
	    };
    //$scope.reset();
  	});

	app.controller("searchResultsController", function($scope, $stateParams, $http, GETService) {

		function GET_Search_Results(query, limit) {
			
			GETService.GET_Search_Results(query, limit)
			.then(function(respuesta) {

				$scope.data_peliculas = respuesta.data;
				console.log(respuesta.data);
			}, function(error){console.log(error)});

		}
		GET_Search_Results($stateParams.query, 3);


		console.log($stateParams);
		$scope.query = $stateParams.query;
		console.log($scope.query);
	});

	app.controller("searchController", function($scope, $state) {
		$scope.search = function() {
			if($scope.query != null) {
				$state.go("searchResults", {query: $scope.query});
				$scope.query = null;
			}		
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
        console.log($stateParams.peliculaId);
        $scope.ID = $stateParams.peliculaId;
        console.log($scope.ID);
	    GET_Info_Pelicula($stateParams.peliculaId);
	});

	app.controller('topController', function($scope, $http, GETService) {


		function GET_TOP_Peliculas(cant_peliculas, cant_dias){

	        GETService.GET_TOP_Peliculas(cant_peliculas, cant_dias)
	        .then(function(respuesta){
				if(cant_dias == 1)
				{
					$scope.ranking_diario = respuesta.data;
				}
				else if (cant_dias == 7)
				{
					$scope.ranking_semanal = respuesta.data;
				}
				else if(cant_dias == 30)
				{
					$scope.ranking_mensual = respuesta.data;
				}
				else
				{
					$scope.data_tweets_popularidad = respuesta.data;
				}
	            console.log(respuesta.data);
	        }, function(error){console.log(error)});

        }

		GET_TOP_Peliculas(10, 1);
		GET_TOP_Peliculas(10, 7);
		GET_TOP_Peliculas(10, 30);
		//	Que el ranking que se muestra en home sea anual.
		GET_TOP_Peliculas(5,365);
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
