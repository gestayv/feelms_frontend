(function() {

	var GET_app = angular.module('GETService', []).


	controller('GETController', function($scope, $http) {

	    var urlBase = "https://localhost";


	    //Entrada : ID Pelicula
	    //Salida  : Array con los datos de la pelicuka
	    //Obtener información de la pelicula
	    $scope.GET_Info_Pelicula = function(id_pelicula){


	    	//Cambiar al finalizar debug
	    	var url = "localhost:8080/json_test/info_peli.json";
	    	//var url = urlBase + "/feelms/api/films/" + id_pelicula;

	    	$http.get(url).
	        then(function(respuesta) {
	            $scope.data_pelicula = respuesta.data;
	            console.log(respuesta.data);
	        });
	    }

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
	            console.log(respuesta.data);
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
	            console.log(respuesta.data);
	        });
	    }


	});

});