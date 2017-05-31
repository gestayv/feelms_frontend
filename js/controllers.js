var app = angular.module("feelms");

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
        }, function(error){console.log(error)});

    }
    $scope.ID = $stateParams.peliculaId;
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
        }, function(error){console.log(error)});

    }

    GET_TOP_Peliculas(10, 1);
    GET_TOP_Peliculas(10, 7);
    GET_TOP_Peliculas(10, 30);
    //	Que el ranking que se muestra en home sea anual.
    GET_TOP_Peliculas(10,365);
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
