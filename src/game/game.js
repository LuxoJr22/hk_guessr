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
scene = 0,
gamepoints = [],
mappoints = [],
maptags = [],
tags = [],
points = [],
lines = [],
totalsec,
chrono,
bot = document.getElementById("guess"),
bott = document.getElementById("bot")
map = document.getElementById("map"),
act_score = document.getElementById("Act_score"),
act_round = document.getElementById("Act_round"),
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
line = document.getElementById("line"),
box = document.getElementById("box"),
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
	scene = 0;
	totalsec = 300;
	clearInterval(chrono);
	StartTimer();
	fetch('../map.json')
		.then((response) => response.json())
		.then((json) => {
			var i = json.maps.length;
			var o = Math.floor(Math.random() * i);
			while (gamepoints.includes(o))
			{
				o = (o + 1) % i;
			}
			gamepoints.push(o);
			var p = json.maps[o];
			locate.src = p.link;
			pospoint = p.coords});
	scoretxt.innerHTML = "Score : " + score;
	round.innerHTML = "Round : " + Round + "/5";
}

function reloadmap()
{
	loadmap();
	bot.style.right = 20 + "px";
	bot.style.top = "";
	bot.style.bottom = 80 + "px";
	map.style.opacity = 0.5;
	map.style.height = "auto";
	map.style.width = 600 + "px";
	tagpos.x = 0;
	tagpos.y = 0;
	tag.style.left = tagpos.x + "px";
	tag.style.top = tagpos.y + "px";
	setTransform()
	tag.hidden = true;
	tagpo.hidden = true;
	taupe.style.display = "flex";
	guess_imgs.style.display = "flex";
	bott.style.display = "none";
	box.style.display = "none"
	get_rect();
}

function guess_scene()
{
	scene = 1;
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
	maptags.push({x: tagpos.x, y: tagpos.y});
	mappoints.push({x: tagpoint.x, y: tagpoint.y});
	let mid = {x: (tagpoint.x + tagpos.x) / 2, y: (tagpoint.y + tagpos.y) / 2};
	pointX = (rect.right - rect.left) / 2 - mid.x;
	pointY = (rect.bottom - rect.top) / 2 - mid.y - 225;
	setTransform();
	box.style.display = "block"
	taupe.style.display = "none";
	guess_imgs.style.display = "none";
	bott.style.display = "flex";

	clearInterval(chrono);
	
}

function end_scene()
{
	scene = 2;
	scale = 1;
	pointX = 0;
	pointY = 0;
	let i = 0;
	while (i < 4)
	{
		lines.push(line.cloneNode(true));
		tags.push(tag.cloneNode(true));
		tags[i].style.left = maptags[i].x + "px";
		tags[i].style.top = maptags[i].y + "px";
		document.getElementById("mapping").appendChild(tags[i]);
		points.push(tagpo.cloneNode(true))
		points[i].style.left = mappoints[i].x + "px";
		points[i].style.top = mappoints[i].y + "px";
		document.getElementById("mapping").appendChild(points[i]);
		lines[i].setAttribute('x1', maptags[i].x);
		
		lines[i].setAttribute('y1', maptags[i].y);
		lines[i].setAttribute('x2', mappoints[i].x);
		lines[i].setAttribute('y2', mappoints[i].y);
		document.getElementById("box").appendChild(lines[i]);
		i ++;
	}
	setTransform();
	act_score.innerHTML = "Score : " + score;

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
	line.setAttribute('x1', tagpos.x + p.x);
	line.setAttribute('y1', tagpos.y + p.y);
	tag.style.transform = "translate(" + p.x + "px, " + p.y + "px)";
	p = {x: pointX + tagpoint.x * (scale - 1), y: pointY + tagpoint.y * (scale - 1)}
	tagpo.style.transform = "translate(" + p.x + "px, " + p.y + "px)";
	line.setAttribute('x2', tagpoint.x + p.x);
	line.setAttribute('y2', tagpoint.y + p.y);
	if (scene == 2)
	{
		let i = 0;
		while ( i < 4)
		{
			p = {x: pointX + maptags[i].x * (scale - 1), y: pointY + maptags[i].y * (scale - 1)};
			tags[i].style.transform = "translate(" + p.x + "px, " + p.y + "px)";
			lines[i].setAttribute('x1', maptags[i].x + p.x);
			lines[i].setAttribute('y1', maptags[i].y + p.y);
			p = {x: pointX + mappoints[i].x * (scale - 1), y: pointY + mappoints[i].y * (scale - 1)};
			points[i].style.transform = "translate(" + p.x + "px, " + p.y + "px)";
			lines[i].setAttribute('x2', mappoints[i].x + p.x);
			lines[i].setAttribute('y2', mappoints[i].y + p.y);
			i ++;
		}
	}
}

function StartTimer() {
	totalSeconds = 300;

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
	else
	{
		guess_scene();
	}
}


zoom.onmouseleave = function(e)
{
	panning = false;
}

button.onmousedown = function(e)
{
	let scoring
	if (tagpos.x > pospoint.x - 5 && tagpos.x < pospoint.x + 5 && tagpos.y > pospoint.y - 5 && tagpos.y < pospoint.y + 5)
		scoring = 1000;
	else
	{
		let dist = Math.sqrt((tagpos.x - pospoint.x) ** 2 + (tagpos.y - pospoint.y) ** 2) * 10;
		if (dist > 1000)
			dist = 1000;
		scoring = Math.round(1000 - dist);
	}
	act_score.innerHTML = "Score : " + scoring;
	act_round.innerHTML = "Round : " + Round + "/5";
	score += scoring;
	Round ++;
	console.log(tagpos);
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
	
	if (point.y == pos.y && point.x == pos.x && scene == 0)
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
	if (Round < 6)
		reloadmap();
	else
		end_scene();
		
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