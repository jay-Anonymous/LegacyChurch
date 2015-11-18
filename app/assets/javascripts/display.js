
function initChart(id) {

	var margin = {top: 15, right: 20, bottom: 30, left: 5},
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var chart = d3.select("#" + id + " .chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

	return chart;
}




