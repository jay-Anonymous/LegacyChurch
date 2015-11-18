
function show_time_series_query(church_data, id) {

	var data = JSON.parse(church_data);
	var keys = Object.keys(data[0]);
	var index = keys[keys.length - 1];
	var f_index = function(el) { return el[keys[keys.length - 1]]; };

	var chart = initChart(id);

	var x = d3.scale.linear()
		.domain(d3.extent(data, function(d) { return d.year; }))
		.range([0, 600])
	var y = d3.scale.linear()
		.domain([-0.5, 3])
		.range([300, 0]);
/*	var xAxis = d3.svg.axis()
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
		});*/

	var line = d3.svg.line()
		.x(function(d) { return x(d.year); })
		.y(function(d) { return y(d[index]); });

	var sortedData = d3.nest()
		.key(function(el) { return el.id; })
		.sortValues(function(e1, e2) {
			return e1.year < e2.year ? -1 :
				   e1.year == e2.year ? 0 :
				   1;
		})
		.entries(data);

	sortedData.forEach(function(el) {
		var normal = el.values[0][index];
		el.values.map(function(val) { val[index] = val[index] / normal });
		chart.append("path")
			.datum(el.values)
			.attr("class", "line")
			.attr("d", line);
	});

/*	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);*/
}

