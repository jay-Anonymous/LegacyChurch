

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


