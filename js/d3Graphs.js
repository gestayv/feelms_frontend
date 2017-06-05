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
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.src = 'https://d3js.org/d3.v4.min.js';
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
                    urlBase = "http://131.221.33.124:8080/feelms/api/films/graph/1&2&3&4&5/from/2";
                    d3.json(urlBase, function(error, data) {
                        if (error) throw error;

                    var width = 960, height = 500;

                    var svg = d3.select(element[0])
                                .append('svg')
                                .attr('width', width)
                                .attr('height', height)
                                .attr('id', 'borde');

                    //d3.select("#chart").attr("align","center");

                    var simulation = d3.forceSimulation().nodes(data.nodes);
                    var link_force = d3.forceLink(data.links).id(function(d){ return d.name; });

                    simulation
                        .force("charge_force", d3.forceManyBody().strength(-50))
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
                            .attr("fill", circleColour);



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
                                return 15;
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
                                return "blue";
                            }
                            else
                            {
                                return "red";
                            }
                        }

                        function linkColour(d)
                        {
                            return "red";
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
    .directive('graficoTweets', ["d3_v4Service", function(d3_v4Service){
        return {
            restrict: 'EA',
            scope:{
                film: '@'
            },
            link: function(scope, element, attrs)
            {
                var urlBase;
                d3_v4Service.d3().then(function(d3)
                {

                    var width = 560, height = 360;

                    var margin = {top: 20, right: 20, bottom: 30, left: 40};

                    var svg = d3.select(element[0])
                                .append('svg')
                                .attr("padding", 0)
                                .attr('width', 620)
                                .attr('height', 420);

                    // Se  define el parseador de fecha (se altera el original con uno para mostrar día - mes)

                    var bisectDate = d3.bisector(function(d) { return d.year; }).left;
                    var date_format = d3.timeFormat("%d %b");


                    // Definimos la escala
                    var x = d3.scaleTime().range([0, width]);
                    var y = d3.scaleLinear().range([height, 0]);


                    // labels (por estudiar)
                    var g = svg.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    scope.$watch('film', function (newVal) {

                    urlBase = "http://131.221.33.124:8080/feelms/api/films/"+scope.film+"/tweets/count/7";
                    // Moldeamos los datos de entrada
                    d3.json(urlBase, function(error, data) {
                        if (error) throw error;

                        data.forEach(function(d) {
                          var fecha = new Date(Date.parse(d.date));
                          d.year = fecha;
                          d.value = +d.count;
                        });

                        //Definimos la linea
                        var line = d3.line()
                        .x(function(d) { return x(d.year); })
                        .y(function(d) { return y(d.value); });

                        //Definimos los dominios de X e Y

                        var minDate = data[0].year,
                            maxDate = (data[data.length-1].year);

                        //TODO : Falta implementar de que si la fecha de estreno está dentro del rango de tweets tomados, incrustar la fecha del estreno

                        var x = d3.scaleTime().domain([minDate, maxDate]).range([0, width - 20 ]);
                        var xAxis = d3.axisBottom()
                              .scale(x)
                              .tickFormat(date_format);


                        y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, d3.max(data, function(d) { return d.value; }) * 1.005]);

                        //Definimos el estilo de los labes y el comportamiento del mouse sobre el gráfico

                        g.append("g")
                            .attr("class", "xaxis axis")
                            .attr("transform", "translate(0," + height + ")")
                                .call(xAxis)

                        g.append("g")
                            .attr("class", "axis axis--y")
                            .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return parseInt(d); }))
                          .append("text")
                            .attr("class", "axis-title")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .attr("fill", "#5D6971")
                            .text("Cantidad de Tweets");

                        g.append("path")
                            .datum(data)
                            .attr("class", "line")
                            .attr("d", line);

                        var focus = g.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus.append("line")
                            .attr("class", "x-hover-line hover-line")
                            .attr("y1", 0)
                            .attr("y2", height);

                        focus.append("line")
                            .attr("class", "y-hover-line hover-line")
                            .attr("x1", width)
                            .attr("x2", width);

                        focus.append("circle")
                            .attr("r", 7.5);

                        focus.append("text")
                            .attr("x", 15)
                            .attr("dy", ".31em");

                        svg.append("rect")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function() { focus.style("display", null); })
                            .on("mouseout", function() { focus.style("display", "none"); })
                            .on("mousemove", mousemove);

                        function mousemove() {
                            var x0 = x.invert(d3.mouse(this)[0]),
                            i = bisectDate(data, x0, 1),
                            d0 = data[i - 1],
                            d1 = data[i];
                            var d = x0 - d0.year > d1.year - x0 ? d1 : d0;
                        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
                        focus.select("text").text(function() { return d.value; });
                        focus.select(".x-hover-line").attr("y2", height - y(d.value));
                        focus.select(".y-hover-line").attr("x2", width + width);
                        }
                });// d3 json
            });// test watch
            });//Fin promesa d3
        }
    };
    }]);
