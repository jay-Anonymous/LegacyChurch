
function get_hist_thresholds(range, values) {
	var fence_t = 2;

	var lower_fence = q1(values) - fence_t * iqr(values);
	var upper_fence = q3(values) + fence_t * iqr(values);

	for (i = 0; i < values.length; i++) {
		if (values[i] > lower_fence) break;
		values[i] = lower_fence;
	}

	for (i = values.length - 1; i >= 0; i--) {
		if (values[i] < upper_fence) break;
		values[i] = upper_fence;
	}

	var thresholds = [range[0]];

	var bin_size = (2 * iqr(values)) / Math.pow(values.length, 1/3);
	var curr = values[0] + bin_size;

	while (curr < upper_fence) {
		thresholds.push(curr);
		curr += bin_size;
	}
	thresholds.push(range[1]);

	return thresholds;
}

function show_histogram(church_data) {

	var raw = JSON.parse(church_data);
	var keys = Object.keys(raw[0]);
	var f_index = function(el) { return el[keys[keys.length - 1]]; };
	var format = d3.format(",.0f");
	var data = d3.layout.histogram()
		.value(f_index)
		.bins(get_hist_thresholds)(raw);

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
		.tickFormat(function(tick) {
			tick = format(tick);
			if (tick == format(data[data.length - 1].x + data[0].dx))
				tick = "";
			else if (tick == format(data[data.length - 1].x))
				tick = "≥" + tick;
			return tick;
		});

	var bar = chart.selectAll("g")
	    .data(data)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d, i) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
		.on("click", function(data) {
			d3.select(".selected").attr("class", "bar");
			d3.select(this).attr("class", "bar selected");
			display_selected_churches(data);
		});

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
	    .call(xAxis);

	var med_value = median(raw.map(f_index).sort());
	chart.append("line")
		.attr("x1", x(med_value))
		.attr("x2", x(med_value))
		.attr("y1", y(0))
		.attr("y2", y(height))
		.attr("stroke-width", 1)
		.attr("stroke-dasharray", "10,10")
		.attr("stroke", "black");

	chart.append("text")
		.attr("x", x(med_value) + 5)
		.attr("y", 0)
		.attr("class", "median")
		.attr("text-anchor", "start")
		.text(d3.format(",.0f")(med_value));
}

function display_selected_churches(data) {
	$(".data-table").empty();

	var keys = Object.keys(data[0]);
	keys.forEach(function(el) {
		$(".data-table").append("<th>" + el + "</th>\n");
	});

	data.forEach(function(el) {
		row = "<tr>"
		keys.forEach(function(key) {
			row += "<td>";
			if (key == "id") 
				row += "<a href=\"/churches/" + el[key] + "\">" + el[key] + "</a>";
			else row += el[key];
			row += "</td>";
		});
		row += "</tr>"
		$(".data-table").append(row);
	});
}
