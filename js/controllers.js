var app = angular.module("feelms");

app.controller("comparisonController", function($scope, $stateParams, $http, GETService) {
    $scope.id1 = $stateParams.firstId;
    $scope.id2 = $stateParams.secondId;
    function GET_Info_Pelicula(id_pelicula1,id_pelicula2){

        GETService.GET_Info_Pelicula(id_pelicula1)
        .then(function(respuesta){
          $scope.data_pelicula1 = respuesta.data;
        }, function(error){console.log(error)});


        GETService.GET_Info_Pelicula(id_pelicula2)
        .then(function(respuesta){
          $scope.data_pelicula2 = respuesta.data;
        }, function(error){console.log(error)});
    }
    //$scope.data_pelicula1 = GET_Info_Pelicula($stateParams.firstId);
    //$scope.data_pelicula2 = GET_Info_Pelicula($stateParams.secondId);
    GET_Info_Pelicula($stateParams.firstId, $stateParams.secondId);

});

app.controller("comparisonModalController", function($scope, $state, $http, GETService) {
    $scope.comparisonView = function(id1, id2) {
        $("#compare").modal('hide');
        $('.modal-backdrop').hide();
        $state.go("comparison", {firstId: id1, secondId: id2});
    }

    function GET_Peliculas(GETService) {
      GETService.GET_Peliculas()
      .then(function(respuesta) {
        $scope.data_peliculas = respuesta.data;
        console.log(respuesta.data);
      }, function(error){console.log(error)});
    }
    GET_Peliculas(GETService);

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
    $scope.firstID = $stateParams.peliculaId;
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
