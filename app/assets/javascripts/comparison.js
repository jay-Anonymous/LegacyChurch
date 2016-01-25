

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

		// Create a bar object for each 'bin' in our histogram
		var points = chart.object.selectAll("circle")
			.data(group.values)
			.enter().append("circle");

		var pointAttrs = points
			.attr("class", "chart-element point")
			.attr("cx", function(el) { return x(el[property1]); })
			.attr("cy", function(el) { return y(el[property2]); })
			.attr("r", 3);
			/*.on("click", function(data) {
				d3.select(id + " .selected").attr("class", "chart-element point");
				d3.select(this).attr("class", "chart-element point selected");
				display_bin(data, id, property);
			});*/
	});
}

/* Display a list of the churches in a selected bin */
function display_bin(data, id, property) {
	$(id + " .data-details").remove();
	$(id).append('<div class="data-details">');
	var details = $(id + " .data-details");
	details.append("<table>");
	details.append("<th>Church ID</th>\n");
    details.append("<th>Name</th>");
    details.append("<th>District</th>");
    details.append("<th>Location</th>");
	details.append("<th>" + property + "</th>\n");

	data.forEach(function(el) {
		row = "<tr>"
		row += "<td><a href=\"churches/" + el.id + "\">" + el.id + "</a></td>";
		row += "<td>" + el.name + "</td>";
		row += "<td>" + el.district + "</td>";
		row += "<td>" + el.city + "</td>";
		row += "<td>" + el[property] + "</td>";
		row += "</tr>"
		details.append(row);
	});
	details.append("</table>");
	details.append("</div>");
}

/* Compute the histogram thresholds; we use the Freedman-Diaconis rule, which is based off
 * the interquartile range and seems to be a good balance of granularity versus compression */
function get_hist_thresholds(range, values) {
	var fence_t = 2;

	var lower_fence = q1(values) - fence_t * iqr(values);
	var upper_fence = q3(values) + fence_t * iqr(values);

	// Anything below the lower threshold or above the upper threshold gets set to the
	// threshold value so that the binning function puts them in the right place
	for (i = 0; i < values.length; i++) {
		if (values[i] > lower_fence) break;
		values[i] = lower_fence;
	}

	for (i = values.length - 1; i >= 0; i--) {
		if (values[i] < upper_fence) break;
		values[i] = upper_fence;
	}

	// Start at the lowest threshold, and add a new threshold for every bin-size
	// until we get to the upper threshold
	var thresholds = [range[0]];

	var bin_size = (2 * iqr(values)) / Math.pow(values.length, 1/3);
	var curr = values[0] + bin_size;

	while (curr < upper_fence) {
		thresholds.push(curr);
		curr += bin_size;
	}
	if (range[1] > upper_fence) thresholds.push(range[1]);

	return thresholds;
}



