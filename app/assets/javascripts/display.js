
function parseData(raw) {
	var data = JSON.parse(raw);
	var keys = Object.keys(data[0]);

	return {data: data,
			keys: keys};
}

function initChart(id, xScale, yScale, xTickValues, xTickFormat) {

	var margin = {top: 15, right: 20, bottom: 30, left: 20},
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	xScale.range([0, width]);
	yScale.range([height, 0]);

	var chart = d3.select(id + " .chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickValues(xTickValues);

	if (xTickFormat)
		xAxis.tickFormat(xTickFormat);

	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	return {object: chart, 
		    width: width, 
			height: height};
}




