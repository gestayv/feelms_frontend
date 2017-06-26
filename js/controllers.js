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
      }, function(error){console.log(error)});
    }
    GET_Peliculas(GETService);

});

app.controller("searchResultsController", function($scope, $stateParams, $http, GETService) {

    function GET_Search_Results(query, limit) {

        GETService.GET_Search_Results(query, limit)
        .then(function(respuesta) {

            $scope.data_peliculas = respuesta.data;
        }, function(error){console.log(error)});

    }
    GET_Search_Results($stateParams.query, 3);


    $scope.query = $stateParams.query;
});

app.controller("searchController", function($scope, $state) {
    $scope.search = function() {
        if($scope.query != null) {
            $state.go("searchResults", {query: $scope.query});
            $scope.query = null;
        }
    }
});

app.controller("adminViewController", function($scope, $state) {
    $scope.showAdminView = function() {
        $state.go("admin");
    }
});

app.controller("filmsController", function($scope, $http, GETService) {
  function GET_Peliculas(GETService) {
    GETService.GET_Peliculas()
    .then(function(respuesta) {
      $scope.data_peliculas = respuesta.data;
    }, function(error){console.log(error)});
  }
  GET_Peliculas(GETService);
});

app.controller("subscribeController", function($scope, $http) {
    $scope.send = function(suscriptor) {
        var datos = JSON.stringify(suscriptor);
        console.log(datos);
        var req = {
            method: 'POST',
            url: 'http://131.221.33.124:8080/feelms/api/news/suscribe',
            headers: {
                'Content-Type': 'application/json'
            },
            data: datos
        }
        $http(req).then(function(response){
            console.log(response);
        }, function(response){
            console.log(response);
        });
        $("#confirmacion1").modal('show');
        if($scope.suscriptor.first_name != null) {
            $scope.suscriptor.first_name = null;
        }
        if($scope.suscriptor.last_name != null) {
            $scope.suscriptor.last_name = null;
        }
        if($scope.suscriptor.mail != null) {
            $scope.suscriptor.mail = null;
        }
    };

    $scope.unsuscribe = function(suscriptor) {
        $("#cancelar").modal('hide');
        $('.modal-backdrop').hide();
        var datos = JSON.stringify(suscriptor);
        console.log(datos);
        var req = {
            method: 'POST',
            url: 'http://131.221.33.124:8080/feelms/api/news/unsuscribe',
            headers: {
                'Content-Type': 'application/json'
            },
            data: datos
        }
        $http(req).then(function(response){
            console.log(response);
        }, function(response){
            console.log(response);
        });
        $("#confirmacion2").modal('show');
    };
});

app.controller('editFormController', function($scope, $http) {
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
    delete pelicula['keyterms'];
    $scope.pelicula = angular.copy(pelicula);
    $scope.pelicula.genres = angular.copy(genre);
    $scope.pelicula.director = angular.copy(director);
    $scope.pelicula.keywords = angular.copy(kt);
  };

  $scope.edit = function(pelicula) {
    if (pelicula.genres != null) {
      var to_list = pelicula.genres;
      to_list = to_list.split(",");
      pelicula.genres = to_list;
    }
    if (pelicula.keywords != null) {
      var to_list = pelicula.keywords;
      to_list = to_list.split(",");
      pelicula.keywords = to_list;
    }
    pelicula.length = parseInt(pelicula.length);
    pelicula.admin = parseInt(pelicula.admin);
    pelicula.director = parseInt(pelicula.director);
    pelicula.imgId = parseInt(pelicula.imgId);

     var wat = JSON.stringify(pelicula);
     var req = {
     method: 'POST',
     url: 'http://131.221.33.124:8080/feelms/api/admin/update/film',
     headers: {
       'Content-Type': 'application/json'
     },
     data: wat
    }
    $http(req).then(function(response){
      console.log(response);
    }, function(response){
      console.log(response);
    });
  };
});

app.controller('addFormController', function($scope, $http) {
  $scope.master = {};
  $scope.update = function(pelicula) {
    var to_list = pelicula.genres;
    to_list = to_list.split(",");
    for (var i = 0; i < to_list.length; i++) {
      to_list[i] = parseInt(to_list[i]);
    }
    pelicula.genres = to_list;
    pelicula.length = parseInt(pelicula.length);
    pelicula.admin = parseInt(pelicula.admin);
    pelicula.director = parseInt(pelicula.director);
    pelicula.imgId = parseInt(pelicula.imgId);
    var to_list = pelicula.keywords;
    to_list = to_list.split(",");
    pelicula.keywords = to_list;
    var wat = JSON.stringify(pelicula);
    var req = {
     method: 'POST',
     url: 'http://131.221.33.124:8080/feelms/api/admin/add/film',
     headers: {
       'Content-Type': 'application/json'
     },
     data: wat
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

app.controller('genresController',function($scope,$http,GETService){

    function GET_TOP_Genres(cant_genres, cant_dias){
        GETService.GET_TOP_Genres(cant_genres, cant_dias)
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
                $scope.data_genres_popularidad = respuesta.data;
            }
        }, function(error){console.log(error)});
    }

    GET_TOP_Genres(10, 1);
    GET_TOP_Genres(10, 7);
    GET_TOP_Genres(10, 30);

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

app.controller('loginController', function($scope, $http) {
    $scope.login_in = function(login) {
      console.log("ADASD");
      console.log(login.user);
      console.log(login.pass);  


      var req = {
       method: 'POST',
       url: 'http://131.221.33.124:8080/feelms/api/admin/login/'+login.user+'/'+login.pass,
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
});
