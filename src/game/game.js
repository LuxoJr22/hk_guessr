var scale = 1,
panning = false,
pointX = 0,
pointY = 0,
start = { x: 0, y: 0 },
point = {x: 0, y: 0},
pos = {x: 0, y: 0},
tagpos = {x: 0, y: 0},
offset = {x:0, y:0},
totalsec,
chrono,
pospoint = {x:222, y:129}
zoom = document.getElementById("zoom"),
tag = document.getElementById("tag"),
place = document.getElementById("place"),
timer = document.getElementById("Timer"),
button = document.getElementById("btn"),
rect = zoom.getBoundingClientRect();


place.style.maxHeight = window.innerHeight + "px";

window.onresize = function(event) {
	place.style.maxHeight = window.innerHeight + "px";
	place.style.maxWidth = window.innerWidth + "px";
	rect = zoom.getBoundingClientRect();
}

function setTransform() {
	zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
	var p = {x: pointX + tagpos.x * (scale - 1), y: pointY + tagpos.y * (scale - 1)}
	tag.style.transform = "translate(" + p.x + "px, " + p.y + "px)";
}

function StartTimer() {
	totalSeconds = 300;	// Set to number of seconds left

	chrono = setInterval("Timer_Tick()", 1000);
	var seconds = totalSeconds % 60;
	var secondsTens = Math.floor(seconds / 10);
	var secondsOnes = seconds % 10;
	var minutes = Math.floor(totalSeconds / 60);
	timer.innerHTML = "" + minutes + ":" + secondsTens + secondsOnes;
}

function Timer_Tick() {
    if (totalSeconds > 0)
    {
        totalSeconds--;
        var seconds = totalSeconds % 60;
        var secondsTens = Math.floor(seconds / 10);
        var secondsOnes = seconds % 10;
        var minutes = Math.floor(totalSeconds / 60);

       	timer.innerHTML = "" + minutes + ":" + secondsTens + secondsOnes;
	}
}
//StartTimer();

zoom.onmouseleave = function(e)
{
	panning = false;
}

button.onmousedown = function(e)
{

	if (tagpos.x > pospoint.x - 5 && tagpos.x < pospoint.x + 5 && tagpos.y > pospoint.y - 5 && tagpos.y < pospoint.y + 5)
		console.log(1000);
	else
	{
		let dist = Math.sqrt((tagpos.x - pospoint.x) ** 2 + (tagpos.y - pospoint.y) ** 2) * 10;
		if (dist > 1000)
			dist = 1000;
		console.log(1000 - dist);
	}
}

zoom.onmousedown = function (e) {
	e.preventDefault();
	pos.x = (e.clientX - rect.left + offset.x);
	pos.y = (e.clientY - rect.top + offset.y);
	start = { x: pos.x - pointX, y: pos.y - pointY };
	point.y = pos.y;
	point.x = pos.x;
	panning = true;
}

zoom.onmouseup = function (e) {
	panning = false;
	pos.x = (e.clientX - rect.left + offset.x);
	pos.y = (e.clientY - rect.top + offset.y);
	
	if (point.y == pos.y && point.x == pos.x)
	{
		tag.hidden = false;
		tagpos.x = (pos.x - pointX) / scale;
		tagpos.y = (pos.y - pointY) / scale;
		tag.style.left = tagpos.x + "px";
		tag.style.top = tagpos.y + "px";
		setTransform();
		console.log(tagpos);
	}
}


zoom.onmousemove = function (e) {
	e.preventDefault();
	if (!panning) {
	return;
	}
	pos.x = (e.clientX - rect.left + offset.x);
	pos.y = (e.clientY - rect.top + offset.y);
	pointX = (pos.x - start.x);
	pointY = (pos.y - start.y);
	setTransform();
}

zoom.onwheel = function (e) {
	e.preventDefault();
	pos.x = (e.clientX - rect.left + offset.x);
	pos.y = (e.clientY - rect.top + offset.y);
	var xs = (pos.x - pointX) / scale,
	ys = (pos.y - pointY) / scale,
	delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
	(delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
	if (scale < 1)
		scale = 1;
	pointX = pos.x - xs * scale;
	pointY = pos.y - ys * scale;

	setTransform();
}