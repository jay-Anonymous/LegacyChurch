
function show_time_series_query(church_data_json, id) {

    var church_data = parseData(church_data_json);
	var property = $(id + ' .church-property-hidden').val();
    var get_year = function(el) { return el.year; };
    var get_prop = function(el) { return el[property]; };

    var yMin = $(id + ' .y-axis-range').slider('values', 0);
    var yMax = $(id + ' .y-axis-range').slider('values', 1);
    var useAbsScale = $(id + ' .y-axis-absolute').is(':checked');

    churchMinValue = d3.min(church_data.data, get_prop);
    churchMaxValue = d3.max(church_data.data, get_prop);

    var x = d3.scale.linear()
        .domain(d3.extent(church_data.data, get_year));
    var y = d3.scale.linear()
        .domain([yMin, yMax]);

    var minYear = d3.min(church_data.data, get_year);
    var maxYear = d3.max(church_data.data, get_year);

    var line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d[property]); });

    var sortedData = getNestedData(church_data.data);

    sortedData.forEach(function(group) {
        var chart = initChart(id, group.key, 
				x, y, 
                d3.range(minYear, maxYear + 1, 1), d3.format("d"), 
                d3.range(yMin, yMax + 1, useAbsScale ? Math.ceil((yMax + 1 - yMin) / 10) : 1),
                function(val) { 
                    if (useAbsScale) 
                        return val;
                    else return val == yMin ? '0' : Math.pow(2,val) * 100 + '%'; });

        group.values.forEach(function(el) {
            if (!useAbsScale) {
                var normal = el.values[0][property];
                if (normal == 0) return;
                el.values.map(function(val) { val[property] = val[property] == 0 ? yMin : Math.log2(val[property] / normal) });
            }
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

