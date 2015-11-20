
function show_time_series_query(church_data_json, property, id, args) {

	var church_data = parseData(church_data_json);
	var year = function(el) { return el.year; };

	var x = d3.scale.linear()
		.domain(d3.extent(church_data.data, year));
	var y = d3.scale.linear()
		.domain([-0.5, 3]);

	var minYear = d3.min(church_data.data, year);
	var maxYear = d3.max(church_data.data, year);

	var line = d3.svg.line()
		.x(function(d) { return x(d.year); })
		.y(function(d) { return y(d[property]); });

	var grouping = d3.select(id + ' ' + args).property("value");
	var l1sort = undefined;
	switch (grouping) {
		case 'City':
			l1sort = function(el) { return el.city; };
			break;

		case 'District':
			l1sort = function(el) { return el.district; };
			break;

		case 'Value':
			var firstYearData = church_data.data.filter(function (d) {
				return d.year == minYear;
			});
			var firstYearPropVals = firstYearData.map(function (d) {
				return +d[property];
			}).sort(function compareNumbers(a, b) {
				  return a - b;
			});
			var bins = get_hist_thresholds([firstYearPropVals[0], 
					firstYearPropVals[firstYearPropVals.length - 1]],
					firstYearPropVals);
			var idsToBins = [];
			
			for (i = 0; i < bins.length-1; i++) {
				var idsInBin = [];
				firstYearData.forEach(function (d) {
					if (bins[i] <= d[property] && d[property] < bins[i+1]) {
						idsInBin.push(d.id);
					}
				});
				idsToBins.push(idsInBin);
			}
				
			l1sort = function(el) {
				for (i = 0; i < idsToBins.length; ++i) {
					if ($.inArray(el.id, idsToBins[i]) != -1) {
						return i;
					}
				}
			};
			break;
		case 'None': 
		default:
			l1sort = function(e) { return ''; };
	}

	var sortedData = d3.nest()
		.key(l1sort).sortKeys(function(e1, e2) {
			return +e1 < +e2 ? -1 :
				   +e1 == +e2 ? 0 :
				   1;
		})
		.key(function(el) { return el.id; })
		.sortValues(function(e1, e2) {
			return e1.year < e2.year ? -1 :
				   e1.year == e2.year ? 0 :
				   1;
		})
		.entries(church_data.data);

	sortedData.forEach(function(group) {
		var chart = initChart(id, x, y, d3.range(minYear, maxYear + 1, 1), d3.format("d"));
		group.values.forEach(function(el) {
			var normal = el.values[0][property];
			if (normal == 0) return;
			el.values.map(function(val) { val[property] = val[property] / normal });
			chart.object.append("text")
				.attr("x", chart.width / 2)
				.attr("y", 0)
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.text("Data for " + grouping + ' ' + group.key);
			chart.object.append("path")
				.datum(el.values)
				.attr("class", "chart-element line")
				.attr("d", line)
				.on("click", function(data) {
					d3.select(id + " .selected").attr("class", "chart-element line");
					d3.select(this).attr("class", "chart-element line selected");
					display_prop_over_time(data, property, id);
				});
		});
	});

}

function display_prop_over_time(data, property, id) {
	$(id + " .query-results .data-details").remove();
	$(id + " .query-results").append('<div class="data-details">');
	var details = $(id + " .data-details");

	details.append("<a href=\"churches/" + data[0].id + "\">" + data[0].id + "</a></br>");
	details.append("Name: " + data[0].name + "</br>");
	details.append("District: " + data[0].district + "</br>");
	details.append("Location: " + data[0].city + ", " + data[0].state + "</br></br>");
	details.append("<table>");
	details.append("<th>" + property + "</th><th>Year</th>");

	data.forEach(function(el) {
		row = "<tr><td>" + d3.format(".2f")(el[property]) + "</td><td>" + el.year + "</td></tr>";
		details.append(row);
	});
	details.append("</table>");
	details.append("</div>");
}

