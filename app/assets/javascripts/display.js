
/* Initialize the chart display area */
function initChart(id, dataObj, title, xScale, yScale, xTickValues, xTickFormat, yTickValues, yTickFormat) {

	// Set up the maximum extents of the chart
    var margin = {top: 15, right: 20, bottom: 30, left: 50};
    var width = 1000 - margin.left - margin.right;
    var height = 700 - margin.top - margin.bottom;

	// Set the screen-space coordinates for our scaling functions
    xScale.range([0, width]);
    yScale.range([height, 0]);

	// We could be drawing multiple charts, so append each one with a unique class
    numCharts = $(id + ' .query-results .chart').length;
    thisChartClass = 'chart-' + numCharts;
    $(id + ' .query-results').append("<svg class='chart " + thisChartClass + "'></svg>");

	// Set up the different chart regions
    chart = d3.select(id + ' .' + thisChartClass)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top+ ')');

	// Set up the x axis ticks and formatting
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickValues(xTickValues);
    if (xTickFormat)
        xAxis.tickFormat(xTickFormat);
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
	
	// If a y-axis is present, initialize these values and formatting
	if (yTickValues)
	{
		yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left')
			.tickValues(yTickValues)
			.tickFormat(yTickFormat);

		chart.append('g')
			.attr('class', 'y axis')
			.call(yAxis);
	}

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", 0)
		.attr("text-anchor", "middle")
		.style("font-size", "20px")
		.style("font-weight", "lighter")
		.text(title);

	// Return the chart object along with its width and height
    return {object: chart, width: width, height: height};
}

/* Initialize the client-side controls -- these change how the chart is displayed without
 * needing to query the server again.  The 'options' parameter controls which control elements
 * are active:
 *
 * range - y-axis range slider
 * absolute - absolute/relative checkbox
 * group - data groups by district/city/etc.
 */
function initControls(id, dataObj, chartFn, options) { 
	var updateValues = function(event, ui) {
		if (ui) {
			var axisName = $(ui.handle).parent().attr('class').split(' ')[0].substr(0,7);
			var min = $(id + ' .axis-absolute').prop('checked') ? ui.values[0] :
				Math.pow(2, ui.values[0]) * 100 + '%';
			var max = $(id + ' .axis-absolute').prop('checked') ? ui.values[1] :
				Math.pow(2, ui.values[1]) * 100 + '%';
			$(id + ' .' + axisName + 'min').text(min);
			$(id + ' .' + axisName + 'max').text(max);
			return;
		}

		var xValues = $(id + ' .x-axis-range').slider('option', 'values').slice(0);
		var yValues = $(id + ' .y-axis-range').slider('option', 'values').slice(0);
		if (!$(id + ' .axis-absolute').prop('checked')) {
			xValues[0] = Math.pow(2, xValues[0]) * 100 + '%';
			xValues[1] = Math.pow(2, xValues[1]) * 100 + '%';
			yValues[0] = Math.pow(2, yValues[0]) * 100 + '%';
			yValues[1] = Math.pow(2, yValues[1]) * 100 + '%';
		}
		$(id + ' .x-axis-min').text(xValues[0]);
		$(id + ' .x-axis-max').text(xValues[1]);
		$(id + ' .y-axis-min').text(yValues[0]);
		$(id + ' .y-axis-max').text(yValues[1]);
	};
	var redrawChart = function() {
		updateValues();
		$(id + ' .query-results').empty();
		window[chartFn](dataObj, id);
	};

	// Show the controls
	$(id + ' .query-controls').show();

	// The axis slider controls the minimum and maximum values on the axes.
    $(id + ' .x-axis-range, ' + id + ' .y-axis-range').slider({
        range: true,
        min: -10,
        max: 10,
        values: [ -4, 4],
		slide: updateValues,
        stop: redrawChart,
    });
	if (options && typeof(options.x_axis_range) != "undefined" && options.x_axis_range === false) {
		$(id + ' .x-axis-range').slider('option', 'disabled', true);
		$(id + ' .x-axis-range').parent().css('color', 'lightgrey');
	}
	if (options && typeof(options.y_axis_range) != "undefined" && options.y_axis_range === false) {
		$(id + ' .y-axis-range').slider('option', 'disabled', true);
		$(id + ' .y-axis-range').parent().css('color', 'lightgrey');
	}

	// Update the slider scales if we toggle the checkbox
    $(id + ' .axis-absolute').change(function() { 
		changeSliderScales(id, dataObj);
		redrawChart(); 
	});

	if (options && typeof(options.absolute_default) != "undefined" && options.absolute_default === true) {
		$(id + ' .axis-absolute').prop('checked', true);
		changeSliderScales(id, dataObj);
	}
	if (options && typeof(options.absolute) != "undefined" && options.absolute === false) {
		$(id + ' .axis-absolute').attr('disabled', true);
		$(id + ' .axis-absolute').parent().css('color', 'lightgrey');
	}
	updateValues();

	// The global l1sort function controls how data is grouped by the getNestedData function
	$(id + ' .data-grouping').change(function() {
		var grouping = $(this).val();
		switch (grouping) {
			case 'City':
				dataObj.grouping = function(el) { return el.city; };
				break;

			case 'District':
				dataObj.grouping = function(el) { return el.district; };
				break;

/*			case 'Value':
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
				break;*/
			case 'None': 
			default:
				dataObj.grouping = function(e) { return ''; };
		}
		redrawChart();
	});
	if (options && typeof(options.group) != "undefined" && options.group === false) {
		$(id + ' .data-grouping').attr('disabled', true);
		$(id + ' .data-grouping').parent().css('color', 'lightgrey');
	}
}

function changeSliderScales(id, dataObj) {
	var useAbsScale = $(id + ' .axis-absolute').is(':checked');

	// If relative values are used, this is capped between 2^{-10} and 2^{10}.
	// If absolute values are used, it is capped between 0 and the maximum value
	//   for this property
	if (useAbsScale) {
		for (var i = 0; i < dataObj.minValues.length; i++) {
			var min = dataObj.minValues[i];
			var max = dataObj.maxValues[i];
			var sliderID;
			if (i == 0) {
				sliderID = $(id + ' .x-axis-range').slider('option', 'disabled') ? 
					id + ' .y-axis-range' :
					id + ' .x-axis-range';
			} else sliderID = id + ' .y-axis-range';

				
			$(sliderID).slider('option', {
				min: min,
				max: max,
				values: [min, max],
			});
		}
	}
	else {
		$(id + ' .x-axis-range, ' + id + ' .y-axis-range').slider('option', {
			max: 10, 
			min: -10, 
			values: [-4, 4],
		});
	}
}

/* The getNestedData function computes a collection of groups of data, where each
 * group is given by the global l1sort function.  An optional secondary sorting function
 * can be provided if desired. 
 */
function getNestedData(data, grouping, secondary, secondarySort) {
	var sorted = d3.nest()
        .key(grouping).sortKeys(function(e1, e2) {
            return +e1 < +e2 ? -1 :
                   +e1 == +e2 ? 0 :
                   1;
        });
	if (secondary) {
		sorted
        .key(secondary)
        .sortValues(secondarySort)
	}
    return sorted.entries(data);
}

/* Display a list of the churches in a selected group */
function display_bin(data, property, id) {
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

/* Display a detailed view of a selected church over its history */
function display_props_over_time(data, properties, id) {
    $(id + " .data-details").remove();
    $(id).append('<div class="data-details">');
    var details = $(id + " .data-details");

    details.append("<a href=\"churches/" + data[0].id + "\">" + data[0].id + "</a></br>");
    details.append("Name: " + data[0].name + "</br>");
    details.append("District: " + data[0].district + "</br>");
    details.append("Location: " + data[0].city + ", " + data[0].state + "</br></br>");
    details.append("<table>");
	properties.forEach(function(prop) {
		details.append("<th>" + prop + "</th>");
	});
	details.append("<th>Year</th>");

    data.forEach(function(el) {
		row = "<tr>";
		properties.forEach(function(prop) {
			row += "<td>" + d3.format(".2f")(el[prop]) + "</td>";
		});
		row += "<td>" + el.year + "</td></tr>";
        details.append(row);
    });
    details.append("</table>");
    details.append("</div>");
}

function make_title(id, text, key) {
	if ($(id + ' .data-grouping').val() == 'District') text += ' for district ' + key;
	else if ($(id + ' .data-grouping').val() == 'City') text += ' for ' + key;
	return text;
}

