angular.module('d3', [])
    .factory('d3', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
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

angular.module('d3App', ['d3']).
    directive('d3Test', ['d3', function (d3) {
        return {
            restrict: 'EA',
            scope:{},
            link: function(scope, element, attrs)
            {
                d3.d3().then(function(d3){
                    scope.nodes =
                    [{"name": "Travis", "sex": "M"},
                    {"name": "Rake", "sex": "M"},
                    {"name": "Diana", "sex": "F"},
                    {"name": "Rachel", "sex": "F"},
                    {"name": "Shawn", "sex": "M"},
                    {"name": "Emerald", "sex": "F"}];

                    scope.links =
                    [{"source": "Travis", "target": "Rake"},
                    {"source": "Diana", "target": "Rake"},
                    {"source": "Diana", "target": "Rachel"},
                    {"source": "Rachel", "target": "Rake"},
                    {"source": "Rachel", "target": "Shawn"},
                    {"source": "Emerald", "target": "Rachel"}];


                    var width = 960, height = 500, radius = 8;
                    var svg = d3.select(element [0])
                                .append('svg')
                                .attr('width', width)
                                .attr('height', height);

                    var simulation = d3.forceSimulation().nodes(scope.nodes);
                    var link_force = d3.forceLink(scope.links).id(function(d){ return d.name; });

                    simulation
                        .force("charge_force", d3.forceManyBody().strength(-200))
                        .force("center_force", d3.forceCenter(width/2, height/2))
                        .force("links", link_force);

                    simulation.on("tick", tickActions);

                    var g = svg.append("g")
                        .attr("class", "everything");

                    var link = g.append("g")
                        .attr("class", "link")
                        .selectAll("line")
                        .data(scope.links)
                        .enter().append("line")
                        .attr("stroke-width", 2)
                        .style("stroke", linkColour);

                    var node = g.append("g")
                       .attr("class", "node")
                       .selectAll("circle")
                       .data(scope.nodes)
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
                        .attr("r", radius)
                        .attr("fill", circleColour);

                    node
                        .append("text")
                        .text(texto);

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
            			if(d.sex == "F")
            			{
            				return tooltip
                    				.text("-"+d.name+"\n-"+d.sex)
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
            			if(d.sex == "M")
            			{
            				return d.name
            			}

            		}

            		function circleColour(d)
            	    {
            	    	if(d.sex == "M")
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
            	    	if(d.type == "E")
            	    	{
            	    		return "red";
            	    	}
            	    	else
            	    	{
            	    		return "green";
            	    	}
            	    }

            		function drag_start(d){
            			if(!d3.event.active) simulation.alphaTarget(0.3).restart();
            			tooltip.style("top",
            				    (d3.event.y-10)+"px").style("left",(d3.event.x+10)+"px");
            			d.fx = d.x;
            			d.fy = d.y;
            		}

            		function drag_drag(d)
            		{
            			tooltip.style("top",
            				    (d3.event.y-10)+"px").style("left",(d3.event.x+10)+"px");
            			d.fx = d3.event.x;
            			d.fy = d3.event.y;
            		}

            		function drag_end(d){
            			if(!d3.event.active) simulation.alphaTarget(0);
            			tooltip.style("top",
            				    (d3.event.y-10)+"px").style("left",(d3.event.x+10)+"px");
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
            }
        };
    }]);
