
/* Show a plot of the change in a value over time for all the churches in a JSON object */
function show_time_series_query(church_data_json, id) {

	// Parse the incoming data
    var church_data = JSON.parse(church_data_json);
	var property = $(id + ' .church-property').val();
    var get_year = function(el) { return el.year; };
    var get_prop = function(el) { return el[property]; };

	// Compute the y-axis values
    var yMin = $(id + ' .y-axis-range').slider('values', 0);
    var yMax = $(id + ' .y-axis-range').slider('values', 1);
    var useAbsScale = $(id + ' .y-axis-absolute').is(':checked');

    churchMinValue = d3.min(church_data, get_prop);
    churchMaxValue = d3.max(church_data, get_prop);

	// Set up our scaling functions
    var x = d3.scale.linear()
        .domain(d3.extent(church_data, get_year));
    var y = d3.scale.linear()
        .domain([yMin, yMax]);

	// Find the minimum and maximum year in our range
    var minYear = d3.min(church_data, get_year);
    var maxYear = d3.max(church_data, get_year);

	// Function to draw a line on the graph for a particular property
    var line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d[property]); });


	// Sort the data according to our l1sort function.  Provide a secondary sorting
	// function to group each of the churches by their ID, from lowest-to-highest year
    var sortedData = getNestedData(church_data, function(el) { return el.id; },
			function(e1, e2) {
				return e1.year < e2.year ? -1 :
					   e1.year == e2.year ? 0 :
					   1;
			});

	// For each of our l1sort groups, display a separate chart
    sortedData.forEach(function(group) {

		// Initialize the chart area
        var chart = initChart(id, group.key, // CSS selector, chart title element
				x, y,						 // scaling functions 
                d3.range(minYear, maxYear + 1, 1), d3.format("d"),	// x-axis ticks/format 

				// y-axis ticks: if we're using absolute scaling, we want a larger step-size
				// so we only display 10 tick-marks
                d3.range(yMin, yMax + 1, useAbsScale ? Math.ceil((yMax + 1 - yMin) / 10) : 1),

				// y-axis tick format function; append a '%' if we're not using absolute scaling
                function(val) { 
                    if (useAbsScale) 
                        return val;
                    else return val == yMin ? '0' : Math.pow(2,val) * 100 + '%'; });

		// For each church in our group, draw a line; scale the values if necessary
        group.values.forEach(function(church) {
            if (!useAbsScale) {
				var normal = -1;
				church.values.forEach(function(el) {
					if (normal == -1 && el[property] != 0)
						normal = el[property];
					if (normal != -1)
						el[property] = el[property] == 0 ? yMin : Math.log2(el[property] / normal);
				});
            }
            chart.object.append("path")
                .datum(church.values)
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

/* Display a detailed view of a selected church over its history */
function display_prop_over_time(data, property, id) {
    $(id + " .data-details").remove();
    $(id).append('<div class="data-details">');
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

