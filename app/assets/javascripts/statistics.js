
function q1(data) {
	if (data.length % 4 == 0) {
		return (data[data.length / 4 - 1] + data[data.length / 4]) / 2;
	} else if (data.length % 4 == 1) {
		var n = Math.floor(data.length / 4) - 1;
		return 1/4 * data[n] + 3/4 * data[n+1];
	} else if (data.length % 4 == 2) {
		return data[Math.floor(data.length / 4)];
	} else if (data.length % 4 == 3) {
		var n = Math.floor(data.length / 4);
		return 3/4 * data[n] + 1/4 * data[n+1];
	}
}

function median(data) {
	if (data.length % 2 == 0) 
		return (data[data.length / 2 - 1] + data[data.length / 2]) / 2;
	else return data[Math.floor(data.length / 2)];
}

function q3(data) {
	if (data.length % 4 == 0) {
		return (data[3 * data.length / 4 - 1] + data[3 * data.length / 4]) / 2;
	} else if (data.length % 4 == 1) {
		var n = 3 * Math.floor(data.length / 4);
		return 3/4 * data[n] + 1/4 * data[n+1];
	} else if (data.length % 4 == 2) {
		return data[3 * Math.floor(data.length / 4) + 1];
	} else if (data.length % 4 == 3) {
		var n = 3 * Math.floor(data.length / 4) + 1;
		return 1/4 * data[n] + 3/4 * data[n+1];
	}
}
	

function iqr(data) {
	return q3(data) - q1(data)
}


