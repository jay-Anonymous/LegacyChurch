
/* Initialize the chart display area */
function initChart(id, title, xScale, yScale, xTickValues, xTickFormat, yTickValues, yTickFormat) {

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

	// Add a title to the chart
	var titleText = $(id + ' .leaf-item.selected').text();
	if ($(id + ' .data-grouping').val() == 'District') titleText += ' for district ' + title;
	else if ($(id + ' .data-grouping').val() == 'City') titleText += ' for ' + title;

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", 0)
		.attr("text-anchor", "middle")
		.style("font-size", "20px")
		.style("font-weight", "lighter")
		.text(titleText);

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
function initControls(id, chartFn, options) { 
	var redrawChart = function() {
		$(id + ' .query-results').empty();
		window[chartFn](churches, id);
	};

	// Show the controls
	$(id + ' .query-controls').show();

	// The y-axis slider controls the minimum and maximum values on the y-axis.
    $(id + ' .y-axis-range').slider({
        range: true,
        min: -10,
        max: 10,
        values: [ -4, 4],
        slide: redrawChart,
    });
	if (options && typeof(options.range) != "undefined" && options.range === false) {
		$(id + ' .y-axis-range').slider('option', 'disabled', true);
		$(id + ' .y-axis-range').parent().css('color', 'lightgrey');
	}

    $(id + ' .y-axis-absolute').change(function() { 
		var useAbsScale = $(id + ' .y-axis-absolute').is(':checked');

		// If relative values are used, this is capped between 2^{-10} and 2^{10}.
		// If absolute values are used, it is capped between 0 and the maximum value
		//   for this property
	    if (useAbsScale) {
			$(id + ' .y-axis-range').slider('option', {
				min: 0, 
				max: churchMaxValue, 
				values: [0, churchMaxValue],
			});
		}
		else {
			$(id + ' .y-axis-range').slider('option', {
				max: 10, 
				min: -10, 
				values: [-4, 4],
			});
		}
		redrawChart(); 
	});
	if (options && typeof(options.absolute) != "undefined" && options.absolute === false) {
		$(id + ' .y-axis-absolute').attr('disabled', true);
		$(id + ' .y-axis-absolute').parent().css('color', 'lightgrey');
	}

	// The global l1sort function controls how data is grouped by the getNestedData function
	$(id + ' .data-grouping').change(function() {
		var grouping = $(this).val();
		switch (grouping) {
			case 'City':
				l1sort = function(el) { return el.city; };
				break;

			case 'District':
				l1sort = function(el) { return el.district; };
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
				l1sort = function(e) { return ''; };
		}
		redrawChart();
	});
	if (options && typeof(options.group) != "undefined" && options.group === false) {
		$(id + ' .data-grouping').attr('disabled', true);
		$(id + ' .data-grouping').parent().css('color', 'lightgrey');
	}
}

/* The getNestedData function computes a collection of groups of data, where each
 * group is given by the global l1sort function.  An optional secondary sorting function
 * can be provided if desired. 
 */
function getNestedData(data, secondary, secondarySort) {
	var sorted = d3.nest()
        .key(l1sort).sortKeys(function(e1, e2) {
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


