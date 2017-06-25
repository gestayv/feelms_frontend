angular.module("d3_v4")
    .factory("d3_v4Service", ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
        console.log("Loading D3V4");
        var d = $q.defer();
        function onScriptLoad() {
          // Load client in the browser
          $rootScope.$apply(function() { d.resolve(window.d3); });
        }
        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded

        window.d3 = undefined;
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.src = '/js/d3.v4.js';
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

angular.module("feelms")
.directive('grafoTweets', ["d3_v4Service", function (d3_v4Service) {
        return {
            restrict: 'EA',
            scope:{},
            link: function(scope, element, attrs)
            {
                d3_v4Service.d3().then(function(d3){
                    console.log("ACA");
                    urlBase = "http://131.221.33.124:8080/feelms/api/films/graph/1&2&3&4&5/from/3";
                    d3.json(urlBase, function(error, data) {
                        if (error) throw error;

                        var width = 960, height = 500;

                        var svg = d3.select(element[0])
                                    .append('svg')
                                    .attr('width', width)
                                    .attr('height', height)
                                    .attr('id', 'borde');


                        var simulation = d3.forceSimulation().nodes(data.nodes);
                        var link_force = d3.forceLink(data.links).id(function(d){ return d.name; });

                        simulation
                            .force("charge_force", d3.forceManyBody().strength(-75))
                            .force("center_force", d3.forceCenter(width/2, height/2))
                            .force("links", link_force);

                        simulation.on("tick", tickActions);

                        var g = svg.append("g")
                            .attr("class", "everything");

                        var link = g.append("g")
                            .attr("class", "link")
                            .selectAll("line")
                            .data(data.links)
                            .enter().append("line")
                            .attr("stroke-width", 2)
                            .style("stroke", linkColour);

                        var node = g.append("g")
                           .attr("class", "node")
                           .selectAll("circle")
                           .data(data.nodes)
                           .enter()
                           .append("g")
                           .attr("transform",
                               function(d)
                               {
                                   return "translate(" + d.x + "," + d.y + ")";
                               })
                            .on("mouseover", hover_on)
                            .on("mousemove", hover_move)
                            .on("mouseout", hover_end);
                        node
                            .append("circle")
                            .attr("r", circleRadius)
                            .attr("fill", circleColour)
                            .on("click", redirectToNode);



                        var tooltip = d3.select("body")
                            .append("div")
                            .style("position", "absolute")
                            .style("z-index", "10")
                            .style("visibility", "hidden")
                            .attr("id", "rcorners6");

                        var drag_handler = d3.drag()
                                .on("start", drag_start)
                                .on("drag", drag_drag)
                                .on("end", drag_end);

                        drag_handler(node);

                        var zoom_handler = d3.zoom()
                            .on("zoom", zoom_actions);

                        zoom_handler(svg);

                        function redirectToNode(d)
                        {
                            if(d.type == "u")
                            {
                                var url = "https://twitter.com/"+d.name;
                                window.open(url);
                            }
                            else if (d.type == "m")
                            {
                                //Aca debería ir la ruta de la película dentro de la misma aplicación.
                                var url = "";
                                //window.open(url);
                            }
                        }

                        function hover_on(d)
                        {
                            if(d.type == "u")
                            {
                                return tooltip
                                            .text("Usuario: @"+d.name)
                                            .style("visibility", "visible");
                            }
                            else
                            {
                                return tooltip
                                            .text("Película: "+d.name)
                                            .style("visibility", "visible");
                            }
                        }

                        function hover_move(d)
                        {
                            return tooltip.style("top",
                                    (d3.event.y-10)+"px").style("left",(d3.event.x+10)+"px");
                        }

                        function hover_end(d)
                        {
                            return tooltip.style("visibility", "hidden");
                        }

                        function texto(d)
                        {
                            if(d.type == "m")
                            {
                                return d.name
                            }

                        }

                        function circleRadius(d)
                        {
                            if(d.type == "m")
                            {
                                return 20;
                            }
                            else
                            {
                                return 7;
                            }
                        }

                        function circleColour(d)
                        {
                            if(d.type == "m")
                            {
                                return "#FEFA0D";
                            }
                            else
                            {
                                return "#1276B2";
                            }
                        }

                        function linkColour(d)
                        {
                            return "#253036";
                        }

                        function drag_start(d){
                            if(!d3.event.active) simulation.alphaTarget(0.3).restart();
                            tooltip.style("visibility", "hidden");
                            d.fx = d.x;
                            d.fy = d.y;
                        }

                        function drag_drag(d)
                        {
                            tooltip.style("visibility", "hidden");
                            d.fx = d3.event.x;
                            d.fy = d3.event.y;
                        }

                        function drag_end(d){
                            if(!d3.event.active) simulation.alphaTarget(0);
                            tooltip.style("visibility", "hidden");
                            d.fx = null;
                            d.fy = null;
                        }

                        function zoom_actions(){
                            g.attr("transform", d3.event.transform)
                        }

                        function tickActions()
                        {
                            node
                                .attr("transform", function(d)
                                {
                                    return "translate(" + d.x + "," + d.y + ")";
                                });

                            link
                                .attr("x1", function(d) { return d.source.x; })
                                .attr("y1", function(d) { return d.source.y; })
                                .attr("x2", function(d) { return d.target.x; })
                                .attr("y2", function(d) { return d.target.y; });
                        }
                    });
                });
            }
        };
    }])

.directive('mapaTweets', ["d3_v4Service", function(d3_v4Service){
    return{
        restrict: 'EA',
        scope:{},
        link: function(scope, element, attrs)
        {
            var urlBase;
            d3_v4Service.d3().then(function(d3){


                d3.json("./json_test/world-countries.json", function(err, data){
                    var location = window.location.href;
                    var test = location.split("/");
                    var film = test[test.length-1];
                    var urlBase = "http://131.221.33.124:8080/feelms/api/films/"+film+"/map/30";
                    d3.json(urlBase, function(err2, data2){
                        // Definir rangos y colores de manera dinámica.
                        var mapa_labels = [];
                        var ext_mapa_domain = [0];
                        var valor;
                        for (var i = 0; i < data2.range.length; i++)
                        {
                            if(i == 0)
                            {
                                valor = "< "+data2.range[i];
                                mapa_labels.push(valor);
                                ext_mapa_domain.push(data2.range[i]);
                                valor = data2.range[i] + " +";
                                mapa_labels.push(valor);
                            }
                            else if(i == data2.range.length - 1)
                            {
                                valor = "> "+data2.range[i];
                                mapa_labels.push(valor);
                                ext_mapa_domain.push(data2.range[i]);
                            }
                            else
                            {
                                valor = data2.range[i] + " +";
                                mapa_labels.push(valor);
                                ext_mapa_domain.push(data2.range[i]);
                            }
                        }

                        var colorMap = d3.interpolateRgb("#C5ECFF", "#00557F");

                        var color2 = d3.scaleLog()
                            .domain(data2.range)
                            .range(["#FFB6AF", "#B21100"]);

                        var width = 960,
                            height = 500;

                        var zoom = d3.zoom()
                            .scaleExtent([1, 8])
                            .on("zoom", move);

                        var svg = d3.select(element[0])
                                    .append("svg")
                                    .attr("class", "mapaT")
                                    .attr("width", width)
                                    .attr("height", height)
                                    .call(zoom);

                        var g = svg.append("g");

                        var projection = d3.geoMercator()
                                        .scale(width / 2 / Math.PI)
                                        .translate([width/2, height/2]);

                        var path = d3.geoPath()
                                    .projection(projection);

                        var countries = topojson.feature(data, data.objects.countries1).features;
                        g.selectAll(".country")
                            .data(countries)
                            .enter().append("path")
                            .attr("class", "country")
                            .style("fill", testF)
                            .attr("d", path)
                            .on("mouseover", hover_on)
                            .on("mousemove", hover_move)
                            .on("mouseout", hover_out);

                        function testF(d)
                        {
                            var t = data2["countryData"];
                            for (var i = 0; i < t.length; i++) {
                                if(d["properties"]["Alpha-2"] == t[i]["id"])
                                {
                                    return color2(t[i]["count"]);
                                }
                            }
                            return "gray";
                        }

                        var legend = svg.selectAll(".legend")
                            .data(ext_mapa_domain)
                            .enter().append("g")
                            .attr("class", "legend");

                        var ls_w = 20, ls_h = 20;

                        legend.append("rect")
                            .attr("x", 20)
                            .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
                            .attr("width", ls_w)
                            .attr("height", ls_h)
                            .style("fill", function(d, i) { return color2(d); })
                            .style("opacity", 0.8);

                        legend.append("text")
                            .attr("x", 50)
                            .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
                            .text(function(d, i){ return mapa_labels[i]; });

                        var tooltip = d3.select("body")
                            .append("div")
                            .style("position", "absolute")
                            .style("z-index", "10")
                            .style("visibility", "hidden")
                            .attr("id", "rcorners6");

                        function hover_on(d)
                        {
                            var props= d["properties"];
                            return tooltip
                                    .text(props["name"]+" !")
                                    .style("visibility", "visible");
                        }

                        function hover_move(d)
                        {
                            var m = [0, 0];
                            m = d3.mouse(this);
                            return tooltip.style("top",
                                    (d3.event.y)+"px").style("left",(d3.event.x)+"px");
                        }

                        function hover_out(d)
                        {
                            return tooltip
                                    .style("visibility", "hidden");
                        }

                        function move()
                        {
                            g.attr("transform", d3.event.transform);
                        }
                    })
                })
            });
        }
    };
}])

.directive('graficoDep', ['d3v3','nv', function(d3v3, nv) {
    return {
        restrict: 'EA',
        scope:{
            film1: '@'
        },
        link: function(scope, element, attrs)
        {

            d3v3.d3().then(function(d3)
            {
                if(true)
                {
                    //Resolver conflicto

                    nv.nv().then(function(nv)
                    {
                        scope.$watch('film1', function(nval){

                        var urlBase = "http://131.221.33.124:8080/feelms/api/films/"+scope.film1+"/tweets/count/7";

                        if(true)
                        {
                            d3.json(urlBase, function(error, data1) {

                            var dataG= [];
                            var data = [];

                            dataG = data1;
                            if(true)
                            {

                                var celda = [];
                                var values = [];
                                var data_obj = {};

                                for(i=0;i<dataG.length;i++)
                                {
                                    celda = [];
                                    celda.push(dataG[i].date);
                                    celda.push(dataG[i].count);
                                    values.push(celda);
                                };
                                data_obj['key'] = "Tweets";
                                data_obj['values'] = values;
                                values = [];
                                data.push(data_obj);
                                data_obj = {};

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

                                chart.xAxis
                                    .tickFormat(function(d) {
                                    return d3.time.format("%d %b")(new Date(d))
                                    });
                                chart.yAxis
                                    .tickFormat(function(d) {
                                    return d3.format(',.2f')(d);
                                    });



                                d3.select(element[0])
                                    .append("svg")
                                    .attr("width", 500)
                                    .attr("height", 300)
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
                    }); //nv json
                };
            });// d3 json
        }
    } // return
}])

.directive('graficotorta', ['d3v3','nv', function(d3v3, nv) {
        return {
            restrict: 'EA',
            scope:{
                film: '@'
            },
            link: function(scope, element, attrs)
            {
                var urlBase;
                d3v3.d3().then(function(d3)
                {
                    if(true){

                        nv.nv().then(function(nv)
                        {
                            scope.$watch('film', function()
                            {
                                urlBase = "http://131.221.33.124:8080/feelms/api/films/"+scope.film+"/sentiments/7";
                                d3.json(urlBase, function(error, data){
                                    if(error) throw error;

                                    var datosReales =
                                    [
                                        {
                                            "label":"Tweets Positivos",
                                            "value":data.pos
                                        },
                                        {
                                            "label":"Tweets Negativos",
                                            "value":data.neg
                                        },
                                        {
                                            "label":"Tweets Neutros",
                                            "value":1-(data.pos+data.neg)
                                        }
                                    ];

                                    nv.addGraph(function() {
                                      var chart = nv.models.pieChart()
                                          .x(function(d) { return d.label })
                                          .y(function(d) { return d.value })
                                          .showLabels(true)
                                          .labelType("percent")
                                          .color(['green', 'red', 'gray']);

                                        d3.select("#chart1 svg")
                                            .datum(datosReales)
                                            .transition().duration(350)
                                            .call(chart);



                                      return chart;
                                    });
                                });
                            });
                        });
                    };
                });// d3 json
            }
        } // return

    }]);
