

/* Given some church data in JSON format, plot a histogram of the results */
function show_comparison_query(church_data_json, id) {

	// Parse the data, and determine what church property we're binning over
	var church_data = JSON.parse(church_data_json);
	var property1 = $(id + ' .church-property1').val();
	var property2 = $(id + ' .church-property2').val();

	// Sort the data into bins according to the current grouping parameter (l1sort)
    var sortedData = getNestedData(church_data);

	// For each of our l1sort groups, display a histogram for the churches in that group
	sortedData.forEach(function(group) {

		var minXValue = d3.min(group.values, function(el) { return el[property1]; });
		var maxXValue = d3.max(group.values, function(el) { return el[property1]; });
		var minYValue = d3.min(group.values, function(el) { return el[property2]; });
		var maxYValue = d3.max(group.values, function(el) { return el[property2]; });
		var xTickInterval = (maxXValue - minXValue) / 10;
		var yTickInterval = (maxYValue - minYValue) / 10;

		// x and y are our scaling functions to convert from data space to screen space
		var x = d3.scale.linear()
			.domain([minXValue, maxXValue])
		var y = d3.scale.linear()
			.domain([minYValue, maxYValue]);

		// Initialize the chart region
		var chart = initChart(id, 			// CSS selector
							  group.key,	// Title of our current (l1sort) group 
							  x, y, 		// Scaling functions
							  d3.range(minXValue, maxXValue, xTickInterval), 	// x-axis tick values
							  function(tick) {							// x-axis tick formatting
								return d3.format(",.0f")(tick);
							  },
							  d3.range(minYValue, maxYValue, yTickInterval),
							  function(tick) {
								return d3.format(",.0f")(tick);
							  });

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
				display_props_over_time([data], [property1, property2], id);
			});
	});
}





