angular.module('feelms')
	.service('GETService', function($http) {

		var urlBase = "http://131.221.33.124:8080";

	    //Entrada : ID Pelicula
	    //Salida  : Array con los datos de la pelicuka
	    //Obtener información de la pelicula
	    this.GET_Info_Pelicula = function(id_pelicula){

	    	//Cambiar al finalizar debug
	    	//var url = "http://localhost:8080/json_test/info_peli.json";
	    	var url = urlBase + "/feelms/api/films/" + id_pelicula;

	    	return $http.get(url);

	    }
	    //Entrada : ID pelicula, Cantidad de días
	    //Salida : Contador de tweets de la pelicula para cada dia señalado
	    // Ejemplo de llamado: /feelms/api/films/{film_id}/tweets/count/{days}
	    this.GET_Cant_Tweets_Pelicula = function(id_pelicula, cant_dias){


	    	//Cambiar al finalizar debug
	    	//var url = "localhost:8080/json_test/cant_tweets.json";
	    	var url = urlBase + "/feelms/api/films/" + id_pelicula + "/tweets/count/" + cant_dias;

	    	return $http.get(url);
	    }

	    //Entrada : cant_dias, dias
	    //Salida : TOP X de peliculas a partir de cantidad de tweets en Y días
	    // Ejemplo de llamado: /feelms/api/top/{cantidad}/days/{days}
		this.GET_TOP_Peliculas = function(cant_peliculas, cant_dias){

	   		var url = urlBase + "/feelms/api/top/"+ cant_peliculas + "/days/" + cant_dias;

	    	return $http.get(url);

	    }


	    //Entrada: Busqueda ingresada (query)
	    //Salida: Cantidad "limit" de peliculas coincidentes con la busqueda (query) ingresada
	   	// Ejemplo de llamado: /feelms/api/search/{query}/{limit}
	   	this.GET_Search_Results = function(query, limit) {
	   		var url = urlBase + "/feelms/api/search/" + query + "/" + limit;

	   		return $http.get(url);
	   	}

	   	//Entrada: None
	    //Salida: Todas las películas en la BD
	   	// Ejemplo de llamado: /feelms/api/films
	   	this.GET_Peliculas = function() {
	   		var url = urlBase + "/feelms/api/films";

	   		return $http.get(url);
	   	}

	});
