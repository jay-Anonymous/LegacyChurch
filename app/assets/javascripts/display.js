
function parseData(raw) { 
    var data = JSON.parse(raw);
    var keys = Object.keys(data[0]);

    return {data: data, 
            keys: keys};
}

function initChart(id, xScale, yScale, xTickValues, xTickFormat, yTickValues, yTickFormat) {

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

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickValues(yTickValues)
        .tickFormat(yTickFormat);

    if (xTickFormat)
        xAxis.tickFormat(xTickFormat);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    return {object: chart, width: width, height: height};
}

function redrawChart(id, chartFn) {
//	alert("ding!\n");
    useAbsScale = $(id + ' .y-axis-absolute input[type=checkbox]').is(':checked');
/*    if (useAbsScale) 
        $(id + ' .y-axis-range').slider('option', {max: 1000, min: 0, values: [0, 1000]});
    else 
        $(id + ' .y-axis-range').slider('option', {max: 10, min: -10, values: [-4, 4]});*/
    $(id + ' .query-results').empty();
    window[chartFn](churches, $(id + ' .church-property-hidden').val(), id);
}

function initControls(id, chartFn) { 
    $(id + ' .y-axis-range').slider({
        range: true,
        min: -10,
        max: 10,
        values: [ -4, 4],
        slide: function() { redrawChart(id, chartFn); },
    });

    $(id + ' .y-axis-absolute').append("<input type='checkbox'>");
}




