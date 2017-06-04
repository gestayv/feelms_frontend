angular.module("d3v3")
    .factory("d3v3", ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
        console.log("Loading D3V3");
        var d = $q.defer();
        function onScriptLoad() {
          // Load client in the browser
          $rootScope.$apply(function() { d.resolve(window.d3); });
        }
        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.src = '/js/d3v3.js';
        scriptTag.onreadystatechange = function () {
          if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
          d3: function() { return d.promise; }
        };
    }]);

angular.module("nv")
    .factory("nv", ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
        var d = $q.defer();
        function onScriptLoad() {
          // Load client in the browser
          $rootScope.$apply(function() { d.resolve(window.nv); });
        }
        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.src = '/js/nv.d3.js';
        scriptTag.onreadystatechange = function () {
          if (this.readyState == 'complete') onScriptLoad();
          console.log("Esoty aqui");
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
          nv: function() { return d.promise; }
        };
    }]);

angular.module("feelms")
    .directive('graphnvd3', ['d3v3','nv', function(d3v3, nv) {
        return {
            restrict: 'EA',
            scope:{
                film1: '@',
                film2: '@',
                title1: '@',
                title2: '@'



            },
            link: function(scope, element, attrs)
            {
                var urlBase;
                d3v3.d3().then(function(d3)
                {
                    if(true){


                    nv.nv().then(function(nv)
                    {
                        var data1= [];
                        var data2= [];
                        var data = [];

                        urlBase = "http://131.221.33.124:8080/feelms/api/films/"+scope.film1+"/tweets/count/7";
                        urlBase2 = "http://131.221.33.124:8080/feelms/api/films/"+scope.film2+"/tweets/count/7";
                        console.log(urlBase);
                        console.log(urlBase2);

                            if(true)
                            {


                           d3.json(urlBase, function(error, data1) {

                            this.data1 = data1;
                            if(true)
                            {

                              d3.json(urlBase2, function(error, data2) {
                            this.data2 = data2;
                            if(true)
                            {

                                    var celda = [];
                                    var values = [];
                                    var data_obj = {};
                                
                                    //console.log(data1);
                                    //console.log(data2);

                                    for(i=0;i<data1.length;i++)
                                    {
                                        celda = [];
                                        celda.push(data1[i].date);
                                        celda.push(data1[i].count);
                                        values.push(celda);
                                    };
                                    //console.log(values);
                                    data_obj['key'] = scope.title1.split(" ")[0];
                                    data_obj['values'] = values;
                                    values = [];
                                    data.push(data_obj);
                                    data_obj = {};

                                    for(i=0;i<data2.length-1;i++)
                                    {
                                        celda = [];
                                        celda.push(data2[i].date);
                                        celda.push(data2[i].count);
                                        values.push(celda);
                                    };
                                    data_obj['key'] = scope.title2.split(" ")[0];
                                    data_obj['values'] = values;
                                    data.push(data_obj);
                                    values = [];
                                    //console.log(data);


                                count = 0;
                                nv.addGraph(function() {
                                  var chart = nv.models.lineChart()
                                    //.x(function(d) { return d[0] })
                                    .xScale(d3.time.scale())
                                    .x( function(d){ 
                                        return Date.parse(d[0]) ;} )
                                    //adjusting, 100% is 1.00, not 100 as it is in the data
                                    .y(function(d) { 
                                        //console.log(d[1]);
                                        return d[1] })
                                    .color(d3.scale.category10().range())
                                    .useInteractiveGuideline(true)
                                    ;
                                //chart.lines.xScale = d3.time.scale();
                                //chart.xScale(d3.time.scale());

                                chart.xAxis
                                .tickFormat(function(d) {
                                    return d3.time.format("%d %b")(new Date(d))
                                });
                                chart.yAxis
                                .tickFormat(function(d) {
                                    return d3.format(',.2f')(d);
                                });
                               

                                 /* chart.xAxis
                                    .tickFormat(function(d) {
                                      return d3.time.format('%x')(new Date(d))
                                    });
                                */
                                  //chart.yAxis.tickFormat(d3.format("d"));

                                 // chart.yAxis.tickFormat(d3.format("d"));

                                  d3.select('#chart svg')
                                    .datum(data)
                                    .transition().duration(500)
                                    .call(chart)
                                    ;

                                  nv.utils.windowResize(chart.update);

                                  return chart;
                                    });
                            };
                                });
                                };
                            });
                        };
                    }); //nv json
                    };
                });// d3 json
            }
        } // return 

    }]); //directive