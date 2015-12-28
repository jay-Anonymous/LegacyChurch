
function parseData(raw) { 
    var data = JSON.parse(raw);
    var keys = Object.keys(data[0]);

    return {data: data, 
            keys: keys};
}

function initChart(id, title, xScale, yScale, xTickValues, xTickFormat, yTickValues, yTickFormat) {

    var margin = {top: 15, right: 20, bottom: 30, left: 50};
    var width = 1000 - margin.left - margin.right;
    var height = 700 - margin.top - margin.bottom;

    xScale.range([0, width]);
    yScale.range([height, 0]);

    numCharts = $(id + ' .query-results .chart').length;
    thisChartClass = 'chart-' + numCharts;
    $(id + ' .query-results').append("<svg class='chart " + thisChartClass + "'></svg>");

    chart = d3.select(id + ' .' + thisChartClass)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top+ ')');

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickValues(xTickValues);

	
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

    if (xTickFormat)
        xAxis.tickFormat(xTickFormat);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

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

    return {object: chart, width: width, height: height};
}

function initControls(id, chartFn, options) { 
	var redrawChart = function() {
		$(id + ' .query-results').empty();
		window[chartFn](churches, id);
	};

	$(id + ' .query-controls').show();

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
	    if (useAbsScale) 
			$(id + ' .y-axis-range').slider('option', {max: churchMaxValue, min: 0, values: [0, churchMaxValue]});
		else 
			$(id + ' .y-axis-range').slider('option', {max: 10, min: -10, values: [-4, 4]});
		redrawChart(); 
	});
	if (options && typeof(options.absolute) != "undefined" && options.absolute === false) {
		$(id + ' .y-axis-absolute').attr('disabled', true);
		$(id + ' .y-axis-absolute').parent().css('color', 'lightgrey');
	}

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




