

/* Given some church data in JSON format, plot a histogram of the results */
function show_comparison_query(dataObj, id) {

	// Parse the data, and determine what church property we're binning over
	var church_data = dataObj.churches;
	var property1 = dataObj.properties[0].value;
	var property2 = dataObj.properties[1].value;

	var xMin = $(id + ' .x-axis-range').slider('values', 0);
	var xMax = $(id + ' .x-axis-range').slider('values', 1);
    var yMin = $(id + ' .y-axis-range').slider('values', 0);
    var yMax = $(id + ' .y-axis-range').slider('values', 1);

	// Sort the data into bins according to the current grouping parameter (l1sort)
    var sortedData = getNestedData(church_data, dataObj.grouping);

	// For each of our l1sort groups, display a histogram for the churches in that group
	sortedData.forEach(function(group) {

		var xTickInterval = Math.ceil((xMax - xMin) / 10);
		var yTickInterval = Math.ceil((yMax - yMin) / 10);

		// x and y are our scaling functions to convert from data space to screen space
		var x = d3.scale.linear()
			.domain([xMin, xMax])
		var y = d3.scale.linear()
			.domain([yMin, yMax]);

		var p1Name = $(id + ' .first-item a')[0].innerHTML;
		var p2Name = $(id + ' .first-item a')[1].innerHTML;

		// Initialize the chart region
		var chart = initChart(id, 			// CSS selector
							  dataObj,
							  make_title(id, p1Name + " vs. " + p2Name, group.key),
							  x, y, 		// Scaling functions
							  d3.range(xMin, xMax, xTickInterval), 	// x-axis tick values
							  function(tick) {							// x-axis tick formatting
								return d3.format(",.0f")(tick);
							  },
							  d3.range(yMin, yMax, yTickInterval),
							  function(tick) {
								return d3.format(",.0f")(tick);
							  });

		function display_history(data){
			d3.select('.chart-element.history').remove();
			var line = d3.svg.line()
				.x(function(d) { return x(d[property1]); })
				.y(function(d) { return y(d[property2]); });
			chart.object.append("path")
				.datum(data)
				.attr("class", "chart-element history")
				.attr("d", line);	

			display_props_over_time(data, [property1, property2], id);
		}

		// Create a point for each data element
		var points = chart.object.selectAll("circle")
			.data(group.values)
			.enter().append("circle")
			.attr("class", "chart-element point")
			.attr("cx", function(el) { return x(el[property1]); })
			.attr("cy", function(el) { return y(el[property2]); })
			.attr("r", 3)
			.on("click", function(data) {
				$(id + " .selected")
					.attr("class", "chart-element point")
					.attr("r", 3);
				$(this)
					.attr("class", "chart-element point selected")
					.attr("r", 7);
				$.post("/get_history.json", 
					   {id: data.id, property1: property1, property2: property2, year: data.year},
					   display_history)
			});

		// Compute the median line and draw it on the graph
		var trend = least_squares(group.values, property1, property2);
		chart.object.append("line")
			.attr("x1", x(0))
			.attr("x2", x(xMax))
			.attr("y1", y(trend.b))
			.attr("y2", y(trend.m * xMax + trend.b))
			.attr("stroke-width", 1)
			.attr("stroke-dasharray", "10,10")
			.attr("stroke", "black");

		chart.object.append("text")
			.attr("x", x(xMax / 2))
			.attr("y", 25)
			.attr("class", "info")
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.html("r^2 = " + d3.format(".2f")(trend.rsq));
	});
}

/*function display_history() {
	display_props_over_time([data], [property1, property2], id);
}*/




