

/* Given some church data in JSON format, plot a histogram of the results */
function show_comparison_query(dataObj, id) {

	// Parse the data, and determine what church property we're binning over
	var church_data = dataObj.churches;
	var property0 = dataObj.properties[0].value;
	var property1 = dataObj.properties[1].value;

	var xMin = $(id + ' .axis-range-1').slider('values', 0);
	var xMax = $(id + ' .axis-range-1').slider('values', 1);
    var yMin = $(id + ' .axis-range-2').slider('values', 0);
    var yMax = $(id + ' .axis-range-2').slider('values', 1);

	// Sort the data into bins according to the current grouping parameter (l1sort)
    var sortedData = getNestedData(church_data, dataObj.grouping);

	// For each of our l1sort groups, display a histogram for the churches in that group
	sortedData.forEach(function(group) {

		var xTickInterval = (xMax - xMin) / 10;
		var yTickInterval = (yMax - yMin) / 10;

		// x and y are our scaling functions to convert from data space to screen space
		var x = d3.scale.linear()
			.domain([xMin, xMax])
		var y = d3.scale.linear()
			.domain([yMin, yMax]);

		// Initialize the chart region
		var chart = initChart(id, 			// CSS selector
							  dataObj,
							  group.key,	// Title of our current (l1sort) group 
							  x, y, 		// Scaling functions
							  d3.range(xMin, xMax, xTickInterval), 	// x-axis tick values
							  function(tick) {							// x-axis tick formatting
								return d3.format(",.0f")(tick);
							  },
							  d3.range(yMin, yMax, yTickInterval),
							  function(tick) {
								return d3.format(",.0f")(tick);
							  });

		// Create a point for each data element
		var points = chart.object.selectAll("circle")
			.data(group.values)
			.enter().append("circle")
			.attr("class", "chart-element point")
			.attr("cx", function(el) { return x(el[property0]); })
			.attr("cy", function(el) { return y(el[property1]); })
			.attr("r", 3)
			.on("click", function(data) {
				$(id + " .selected")
					.attr("class", "chart-element point")
					.attr("r", 3);
				$(this)
					.attr("class", "chart-element point selected")
					.attr("r", 7);
				display_props_over_time([data], [property0, property1], id);
			});
	});
}





