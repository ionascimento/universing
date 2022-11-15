const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const stars = [];

const AU = 149.6e6 * 1000; // 1 AU =~ 150 BILLIONS KM; * 1000 = CONVERTING KM TO METERS
const G = 6.67428e-11;
var SCALE = 50 / AU; // 1 AU = 100 pixels
var TIMESTEP = 3600 * 12 * 1; // 12 hours
const SUNRADIUS = 696340 / 8;

function get_correct_canvas_height() {
    let nav_element = document.querySelector(".navbar");
    return  - nav_element.clientHeight - 20;
}

function fix_canvas_size(fix_height=true) {
    canvas.width = body.clientWidth;
    if(fix_height) canvas.height = body.clientHeight;
}

function create_star({ name, radius, color, mass, xspeed, yspeed, x, y }) {
    stars.push({
        name,
        radius,
        color,
        mass,
        x: x || 0,
        y: y || 0,
        xspeed: xspeed || 0,
        yspeed: yspeed || 0,
        lines: []
    });
}

function get_current_scale() {
    return (SCALE * AU);
}

function decrease_scale(delta) {
    let new_scale = (get_current_scale() - delta);
    if(new_scale <= 10) new_scale = 10;
    if(new_scale >= 200) new_scale = 200;
    return new_scale;
}

function convert_x(x) {
    return x * SCALE * (SUNRADIUS/15000) + canvas.width/2 + xVariant;
}
function convert_y(y) {
    return y * SCALE * (SUNRADIUS/15000) + canvas.height/2 + yVariant;
}

function convert_radius(radius) {
    return radius * SCALE * 2000000;
}

function draw_star({ name, radius, color, x, y, lines }) {

    /* DRAW ORBIT LINES */
    context.beginPath();
    for(let point of lines) {
      context.lineTo(convert_x(point.x), convert_y(point.y));
    }
    context.strokeStyle = "#fff";
    context.stroke();
    context.closePath();

    /* DRAW CIRCLE */
    context.beginPath();
    context.arc(convert_x(x), convert_y(y), convert_radius(radius), 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();

    /* STAR NAME */
    context.font = convert_radius(radius) + "px Arial";
    context.fillStyle = "#fff";
    context.fillText(name, convert_x(x) - convert_radius(radius), convert_y(y) + convert_radius(radius)*1.7);
}

function attraction(p1, p2) {
    const otherX = p2.x;
    const otherY = p2.y;

    const distanceX = otherX - p1.x;
    const distanceY = otherY - p1.y;
    const distance = Math.sqrt(distanceX**2 + distanceY**2)

    const force = G * p1.mass * p2.mass / distance**2;
    const theta = Math.atan2(distanceY, distanceX);
    const forceX = Math.cos(theta) * force;
    const forceY = Math.sin(theta) * force;

    return [forceX, forceY];
}

function get_total_force(star) {
    let totalfx = 0;
    let totalfy = 0;
    for(let star2 of stars) {
        if(star == star2) continue;
        force = attraction(star, star2);
        totalfx += force[0];
        totalfy += force[1];
    }
    return [totalfx, totalfy];
}

function update_star_speed(star, force) {
    star.xspeed += force[0] / star.mass * TIMESTEP;
    star.yspeed += force[1] / star.mass * TIMESTEP;
}

function update_star_position(star) {
    star.x += star.xspeed * TIMESTEP;
    star.y += star.yspeed * TIMESTEP;
}

function max_orbit_length(radius) {
    return radius * 7;
}

function update_orbit_lines(star) {
    if(star.lines.length > max_orbit_length(convert_radius(star.radius))) star.lines.shift();
    star.lines.push({x: star.x, y: star.y});
}

function update_star(star) {
    let force = get_total_force(star);
    update_star_speed(star, force);
    update_star_position(star);
    update_orbit_lines(star);
}

function loop() {

    fix_canvas_size(false);

    for(let star of stars) {
        update_star(star);
        draw_star(star);
    }

    requestAnimationFrame(() => {
        loop();
    });
}

function au_distance(distance) {
    return distance * AU
}

function create_planets() {
    create_star({
        name: 'Sun',
        color: '#ffff00',
        mass: 1.989 * 10**30,
        radius: SUNRADIUS
    });

    create_star({
        name: 'Mercury',
        color: '#e5e5e5',
        mass: 3.285 * 10**23,
        radius: 2440,
        x: au_distance(0.387),
        y: 0,
        yspeed: 47.4 * 1000
    });

    create_star({
        name: 'Venus',
        color: '#a57c1b',
        mass: 4.8685 * 10**24,
        radius: 6051,
        x: au_distance(0.723),
        y: 0,
        yspeed: -35.02 * 1000
    });

    create_star({
        name: 'Earth',
        color: '#6b93d6',
        mass: 5.9742 * 10**24,
        radius: 6371,
        x: au_distance(1),
        y: 0,
        yspeed: 29.783 * 1000
    });

    create_star({
        name: 'Mars',
        color: '#451804',
        mass: 6.39 * 10**23,
        radius: 3390,
        x: au_distance(1.52),
        y: 0,
        yspeed: -24.07 * 1000
    });

    create_star({
        name: 'Jupiter',
        color: '#6b93d6',
        mass: 1.898 * 10**27,
        radius: 69911,
        x: au_distance(5.2),
        y: 0,
        yspeed: 13.06 * 1000
    });

    create_star({
        name: 'Saturn',
        color: '#ab604a',
        mass: 5.683 * 10**26,
        radius: 58232,
        x: au_distance(9.5),
        y: 0,
        yspeed: -9.68 * 1000
    });

    create_star({
        name: 'Uranus',
        color: '#e1eeee',
        mass: 8.681 * 10**25,
        radius: 25362,
        x: au_distance(19.8),
        y: 0,
        yspeed: 6.8 * 1000
    });

    create_star({
        name: 'Neptune',
        color: '#5b5ddf',
        mass: 10.024 * 10**26,
        radius: 24622,
        x: au_distance(30),
        y: 0,
        yspeed: -5.43 * 1000
    });
    
}

var mouseDown = false;
var lastPosition = {x: 0, y: 0};

var xVariant = 0;
var yVariant = 0;

function variant_limit(scale) {
    return 200 * scale;
}

function update_scale(delta) {
    SCALE = decrease_scale(delta) / AU;
}

function move_screen(move) {
    if(mouseDown) {
            
        if(move.x != lastPosition.x) {
            xVariant += move.clientX - lastPosition.x;
        }
        if(move.y != lastPosition.y) {
            yVariant += move.clientY - lastPosition.y;
        }

        let limit = variant_limit(get_current_scale());

        if(xVariant < limit * -1) xVariant = limit * -1;
        if(xVariant > limit) xVariant = limit;
        if(yVariant < limit * -1) yVariant = limit * -1;
        if(yVariant > limit) yVariant = limit;


    }

    lastPosition = {x: move.clientX, y: move.clientY};
}

function start_listeners() {

    canvas.onwheel = (wheel) => {
        let direction = wheel.deltaY;
        update_scale(direction / 10);
    }

    canvas.onmousemove = (move) => {
        move_screen(move);
    }

    canvas.ontouchmove = (move) => {
        move_screen(move.touches[0]);
    }

    canvas.onmousedown = () => {
        mouseDown = true;
    }

    canvas.onmouseup = () => {
        mouseDown = false;
    }

    canvas.ontouchstart = () => {
        mouseDown = true;
    }

    canvas.ontouchend = () => {
        mouseDown = false;
    }

}

function start() {
    fix_canvas_size();
    create_planets();
    loop();
    start_listeners();
}

start();