
function show_basic_query(church_data_json, property, id, args) {

	var church_data = parseData(church_data_json);
	var binnedData = d3.layout.histogram()
		.value(function(d) { return d[property]; })
		.bins(get_hist_thresholds)(church_data.data);

	var binWidth = binnedData[0].dx;
	var minValue = binnedData[0].x;
	var maxValue = binnedData[binnedData.length - 1].x + binWidth;

	var get_histogram_tick_label = function(tick) {
		tick = d3.format(",.0f")(tick);
		if (tick == d3.format(",.0f")(maxValue))
			tick = "";
		else if (tick == d3.format(",.0f")(binnedData[binnedData.length - 1].x))
			tick = "≥" + tick;
		return tick;
	};

	var x = d3.scale.linear()
		.domain([minValue, maxValue])
	var y = d3.scale.linear()
		.domain([0, d3.max(binnedData, function(d) { return d.y; })]);
	var chart = initChart(id, x, y, d3.range(minValue, maxValue, binWidth), get_histogram_tick_label);

	var bar = chart.object.selectAll(".bar")
	    .data(binnedData)
	    .enter().append("g")
	    .attr("class", "chart-element bar")
	    .attr("transform", function(d, i) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
		.on("click", function(data) {
			d3.select(id + " .selected").attr("class", "chart-element bar");
			d3.select(this).attr("class", "chart-element bar selected");
			display_bin(data, id);
		});

	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(binWidth) - 1)
	    .attr("height", function(d) { return chart.height - y(d.y); })

	bar.append("text")
	    .attr("x", x(binWidth) / 2)
	    .attr("y", -10)
	    .attr("dy", ".75em")
	    .text(function(d) { return d.y; });

	var med_value = median(church_data.data.map(function(d) { return d[property]; }).sort());
	chart.object.append("line")
		.attr("x1", x(med_value))
		.attr("x2", x(med_value))
		.attr("y1", y(0))
		.attr("y2", y(chart.height))
		.attr("stroke-width", 1)
		.attr("stroke-dasharray", "10,10")
		.attr("stroke", "black");

	chart.object.append("text")
		.attr("x", x(med_value) + 5)
		.attr("y", 0)
		.attr("class", "chart-element median")
		.attr("text-anchor", "start")
		.text(d3.format(",.0f")(med_value));
}

function display_bin(data, id) {
	$(id + " .query-results .data-details").remove();
	$(id + " .query-results").append('<div class="data-details">');
	var details = $(id + " .data-details");
	details.append("<table>");

	var keys = Object.keys(data[0]);
	keys.forEach(function(el) {
		details.append("<th>" + el + "</th>\n");
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
		details.append(row);
	});
	details.append("</table>");
	details.append("</div>");
}

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



