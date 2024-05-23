var scale = 1,
panning = false,
pointX = 0,
pointY = 0,
start = { x: 0, y: 0 },
pos = {x: 0, y: 0},
tagpos = {x: 0, y: 0},
point = {x: 0, y: 0},
pospoint = {x:0, y:0},
tagpoint = {x:0, y:0},
score = 0,
Round = 1,
totalsec,
chrono,
bot = document.getElementById("guess"),
bott = document.getElementById("bot")
map = document.getElementById("map"),
act_score = document.getElementById("Act_score"),
zoom = document.getElementById("zoom"),
locate = document.getElementById("point"),
taupe = document.getElementById("top"),
tag = document.getElementById("tag"),
tagpo = document.getElementById("tagpoint"),
place = document.getElementById("place"),
timer = document.getElementById("Timer"),
button = document.getElementById("btn"),
scoretxt = document.getElementById("Score"),
round = document.getElementById("round"),
guess_imgs = document.getElementById("guess_text"),
next = document.getElementById("next_text");
rect = zoom.getBoundingClientRect();

function get_rect()
{
	pointX = 0;
	pointY = 0;
	start = { x: 0, y: 0 };
	pos = {x: 0, y: 0};
	scale = 1;
	zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
	rect = zoom.getBoundingClientRect();
}


function loadmap()
{
	totalsec = 300;
	clearInterval(chrono);
	StartTimer();
	fetch('../map.json')
		.then((response) => response.json())
		.then((json) => {
			var i = json.maps.length;
			var p = json.maps[Math.floor(Math.random() * i)];
			locate.src = p.link;
			pospoint = p.coords});
	scoretxt.innerHTML = "Score : " + score;
	round.innerHTML = "Round : " + Round + "/5";
}

function reloadmap()
{
	loadmap();
	bot.style.right = 20 + "px";
	bot.style.bottom = 80 + "px";
	map.style.opacity = 0.5;
	map.style.height = "auto";
	map.style.width = 600 + "px";
	get_rect();
	tagpo.hidden = true;
	if (tagpos.x == 0 && tagpos.y == 0)
		tagpos = tagpoint;
	taupe.style.display = "flex";
	guess_imgs.style.display = "flex";
	bott.style.display = "none";
}

function guess_scene()
{
	bot.style.right = 0 + "px";
	bot.style.top = 0 + "px";
	map.style.opacity = 1;
	map.style.height = 90 + "%";
	map.style.width = "auto";
	get_rect();
	tagpos.x *= ((rect.right - rect.left) / 600);
	tagpos.y *= ((rect.bottom - rect.top) / 390.96875);
	tag.style.left = tagpos.x + "px";
	tag.style.top = tagpos.y + "px";
	tag.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
	tagpo.style.transform = "translate(" + 0 + "px, " + 0 + "px)";
	tagpoint.x = pospoint.x * ((rect.right - rect.left) / 600);
	tagpoint.y = pospoint.y * ((rect.bottom - rect.top) / 390.96875);
	tagpo.style.left = tagpoint.x + "px";
	tagpo.style.top = tagpoint.y + "px";
	tagpo.hidden = false;
	locate.src = "";
	if (tagpos.x == 0 && tagpos.y == 0)
		tagpos = tagpoint;
	let mid = {x: (tagpoint.x + tagpos.x) / 2, y: (tagpoint.y + tagpos.y) / 2};
	pointX = (rect.right - rect.left) / 2 - mid.x;
	pointY = (rect.bottom - rect.top) / 2 - mid.y - 225;
	setTransform();
	taupe.style.display = "none";
	guess_imgs.style.display = "none";
	bott.style.display = "flex";
	clearInterval(chrono);
	
}

loadmap();

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
	p = {x: pointX + tagpoint.x * (scale - 1), y: pointY + tagpoint.y * (scale - 1)}
	tagpo.style.transform = "translate(" + p.x + "px, " + p.y + "px)";
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


zoom.onmouseleave = function(e)
{
	panning = false;
}

button.onmousedown = function(e)
{
	if (tagpos.x > pospoint.x - 5 && tagpos.x < pospoint.x + 5 && tagpos.y > pospoint.y - 5 && tagpos.y < pospoint.y + 5)
		score += 1000;
	else
	{
		let dist = Math.sqrt((tagpos.x - pospoint.x) ** 2 + (tagpos.y - pospoint.y) ** 2) * 10;
		if (dist > 1000)
			dist = 1000;
		score += Math.round(1000 - dist);
	}
	act_score.innerHTML = "Score : " + score;
	Round ++;
	guess_scene();
}

zoom.onmousedown = function (e) {
	e.preventDefault();
	pos.x = (e.clientX - rect.left);
	pos.y = (e.clientY - rect.top);
	start = { x: pos.x - pointX, y: pos.y - pointY };
	point.y = pos.y;
	point.x = pos.x;
	panning = true;
}

zoom.onmouseup = function (e) {
	panning = false;
	pos.x = (e.clientX - rect.left);
	pos.y = (e.clientY - rect.top);
	
	if (point.y == pos.y && point.x == pos.x)
	{
		tag.hidden = false;
		tagpos.x = (pos.x - pointX) / scale;
		tagpos.y = (pos.y - pointY) / scale;
		tag.style.left = tagpos.x + "px";
		tag.style.top = tagpos.y + "px";
		setTransform();
	}
}

next.onmousedown = function (e) {
	reloadmap();
}

zoom.onmousemove = function (e) {
	e.preventDefault();
	if (!panning) {
	return;
	}
	pos.x = (e.clientX - rect.left);
	pos.y = (e.clientY - rect.top);
	pointX = (pos.x - start.x);
	pointY = (pos.y - start.y);
	setTransform();
}

zoom.onwheel = function (e) {
	e.preventDefault();
	pos.x = (e.clientX - rect.left);
	pos.y = (e.clientY - rect.top);
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