(function() {
  var app = angular.module('feelms',[]);

  app.controller("filmsController", ["$scope", "$http", "GETService", function($scope, $http, GETService) {
    function GET_Peliculas(GETService) {
      GETService.GET_Peliculas()
      .then(function(respuesta) {
        $scope.data_peliculas = respuesta.data;
        console.log(respuesta.data);
      }, function(error){console.log(error)});
    }
    GET_Peliculas(GETService);
  }]);

  app.controller('editFormController', ['$scope','$http', function($scope, $http) {
    $scope.pelicula = {};
    $scope.master = {};

    $scope.showInfo = function(pelicula) {
      var generos = pelicula.genres;
      var director = pelicula.director.id.toString();
      var keyterms = pelicula.keyterms;
      
      if (generos.length >= 1) {  // Se verifica si es que posee generos o no (caso improbable, pero de suceder se podría todo)
        var genre = generos[0].id;
        for (var i = 1; i < generos.length; i++) {
          genre =  genre + "," + generos[i].id;
        }
      }
      
      if(keyterms.length >= 1) {  // Se verifica si es que posee keywords o no (caso improbable, pero de suceder se podría todo)
        var kt = keyterms[0].term;
        for (var i = keyterms.length - 1; i >= 1; i--) {
          kt = kt + ',' + keyterms[i].term;
        };
      }

      $scope.pelicula = angular.copy(pelicula);
      $scope.pelicula.genres = angular.copy(genre);
      $scope.pelicula.director = angular.copy(director);
      $scope.pelicula.keyterms = angular.copy(kt);
    };

    $scope.edit = function(pelicula) {
      var to_list = pelicula.genres;
      to_list = to_list.split(",");
      pelicula.genres = to_list;
      var to_list = pelicula.keyterms;
      to_list = to_list.split(",");
      pelicula.keyterms = to_list;
      $scope.master = angular.copy(pelicula);
      var req = {
       method: 'POST',
       url: 'http://131.221.33.124:8080/feelms/api/admin/update/film',
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

  }])  

  app.controller('addFormController', ['$scope','$http', function($scope, $http) {
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
  }]);

})();