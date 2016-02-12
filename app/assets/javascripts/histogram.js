

/* Given some church data in JSON format, plot a histogram of the results */
function show_histogram_query(dataObj, id) {

	// Parse the data, and determine what church property we're binning over
	var church_data = dataObj.churches;
	var property = dataObj.properties[0].value;

	// Sort the data into bins according to the current grouping parameter (l1sort)
    var sortedData = getNestedData(church_data, dataObj.grouping);

	// For each of our l1sort groups, display a histogram for the churches in that group
	sortedData.forEach(function(group) {

		// Bin the data
		var binnedData = d3.layout.histogram()
			.value(function(d) { return d[property]; })
			.bins(get_hist_thresholds)(group.values);

		// TODO doesn't work by city

		var binWidth = binnedData[0].dx;
		var minValue = binnedData[0].x;
		var lastTick = binnedData[binnedData.length - 1].x;
		var maxValue = lastTick + binWidth;

		// x and y are our scaling functions to convert from data space to screen space
		var x = d3.scale.linear()
			.domain([minValue, maxValue])
		var y = d3.scale.linear()
			.domain([0, d3.max(binnedData, function(d) { return d.y; })]);

		var pName = $(id + ' .first-item a')[0].innerHTML;

		// Initialize the chart region
		var chart = initChart(id, 			// CSS selector
							  dataObj,
							  make_title(id, pName, group.key),	// Title of our current (l1sort) group 
							  x, y, 		// Scaling functions
							  d3.range(minValue, maxValue, binWidth), 	// x-axis tick values
							  function(tick) {							// x-axis tick formatting
								tick = d3.format(",.0f")(tick);
								if (tick == d3.format(",.0f")(lastTick))	
									tick = "≥" + tick;
								else if (tick == d3.format(",.0f")(maxValue)) tick = '';
								return tick;
							  });

		// Create a bar object for each 'bin' in our histogram
		var bar = chart.object.selectAll(".bar")
			.data(binnedData)
			.enter().append("g")
			.attr("class", "chart-element bar")
			.attr("transform", function(d, i) { 
				// The transform positions the top left of the bar
				return "translate(" + x(d.x) + "," + y(0.95 * d.y) + ")"; 
			})
			.on("click", function(data) {
				$(id + " .selected").attr("class", "chart-element bar");
				$(this).attr("class", "chart-element bar selected");
				display_bin(data, property, id);
			});

		// Each bar is actually displayed here by drawing a rectangle from top-left to bottom-right
		bar.append("rect")
			.attr("x", 1)
			.attr("width", x(minValue + binWidth) - 1)
			.attr("height", function(d) { return chart.height - y(0.95 * d.y); })

		// Add a label to the top of each bar to indicate the number of objects in the bin
		bar.append("text")
			.attr("x", x(minValue + binWidth) / 2)
			.attr("y", -10)
			.attr("dy", ".75em")
			.attr("class", "info")
			.text(function(d) { return d.y; });

		// Compute the median line and draw it on the graph
		var med_value = median(group.values.map(function(d) { return d[property]; }).sort());
		chart.object.append("line")
			.attr("x1", x(med_value))
			.attr("x2", x(med_value))
			.attr("y1", 15)
			.attr("y2", chart.height)
			.attr("stroke-width", 1)
			.attr("stroke-dasharray", "10,10")
			.attr("stroke", "black");

		chart.object.append("text")
			.attr("x", x(med_value) + 5)
			.attr("y", 25)
			.attr("class", "median info")
			.attr("text-anchor", "start")
			.text(d3.format(",.0f")(med_value));
	});
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



