
function get_hist_thresholds(raw, index) {
	var fence_t = 2;

	var data = [];
	raw.forEach(function (entry) {
		data.push(entry[index]);
	});
	data.sort;

	var lower_fence = q1(data) - fence_t * iqr(data);
	var upper_fence = q3(data) + fence_t * iqr(data);

	for (i = 0; i < raw.length; i++) {
		if (data[i] > lower_fence) break;
		data[i] = lower_fence;
	}

	for (i = raw.length - 1; i >= 0; i--) {
		if (data[i] < upper_fence) break;
		data[i] = upper_fence;
	}

	var thresholds = [data[0]];

	var bin_size = (2 * iqr(data)) / Math.pow(data.length, 1/3);
	var curr = data[0] + bin_size;

	while (curr < upper_fence) {
		thresholds.push(curr);
		curr += bin_size;
	}
	thresholds.push(data[data.length - 1]);

	return thresholds;
}

function show_histogram(church_data, index) {

	var raw = JSON.parse(church_data);
	var data = d3.layout.histogram()
		.bins(get_hist_thresholds)(raw, index);

	var margin = {top: 15, right: 20, bottom: 30, left: 5},
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

	var x = d3.scale.linear()
		.domain([data[0].x, data[data.length - 1].x + data[0].dx])
		.range([0, width])
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])
		.range([height, 0]);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickValues(d3.range(data[0].x, data[data.length - 1].x + data[0].dx, data[0].dx))
		.tickFormat(d3.format(",.0f"))

	var bar = chart.selectAll("g")
	  .data(data)
	  .enter().append("g")
	  .attr("transform", function(d, i) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
	  .attr("x", 1)
	  .attr("width", x(data[0].dx) - 1)
	  .attr("height", function(d) { return height - y(d.y); })

	bar.append("text")
	  .attr("x", x(data[0].dx) / 2)
	  .attr("y", -10)
	  .attr("dy", ".75em")
	  .text(function(d) { return d.y; });

	chart.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
}


