

// TODO not sure I actually need these functions...
function q1(data) {
	return d3.quantile(data, 0.25);
}

function median(data) {
	return d3.median(data);
}

function q3(data) {
	return d3.quantile(data, 0.75);
}

function iqr(data) {
	return q3(data) - q1(data)
}

// Taken from http://bl.ocks.org/benvandyke/8459843
// returns slope, intercept and r-square of the line
function least_squares(values, prop1, prop2) {
	var reduceSumFunc = function(prev, curr) { return prev + curr };
	var reduceSumFuncX = function(prev, curr) 
	{ 
		if (typeof(prev[prop1]) != "undefined")
			return prev[prop1] + curr[prop1]; 
		else return prev + curr[prop1];
	}
	var reduceSumFuncY = function(prev, curr) 
	{ 
		if (typeof(prev[prop2]) != "undefined")
			return prev[prop2] + curr[prop2]; 
		else return prev + curr[prop2];
	}
	
	var xBar = values.reduce(reduceSumFuncX) * 1.0 / values.length;
	var yBar = values.reduce(reduceSumFuncY) * 1.0 / values.length;

	var ssXX = values.map(function(d) { return Math.pow(d[prop1] - xBar, 2); })
		.reduce(reduceSumFunc);
	
	var ssYY = values.map(function(d) { return Math.pow(d[prop2] - yBar, 2); })
		.reduce(reduceSumFunc);
		
	var ssXY = values.map(function(d, i) { return (d[prop1] - xBar) * (values[i][prop2] - yBar); })
		.reduce(reduceSumFunc);
		
	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
	
	return {m: slope, b: intercept, rsq: rSquare};
}

