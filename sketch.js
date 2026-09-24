let paths = [];

let numberOfLines = 40;

let colorPalette = [
  "#F9D746",
  "#0066FF",
  "#FF0001",
  "#F22E8A",
  "#06858C",
  "#CF1858",
  "#FEEDCE",
  "#FFEA66",
  "#43C0FF",
  "#3B55EB",
  "#004170"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#F5F5F5");

  // create all the lines
  for (let i = 0; i < numberOfLines; i++) {

    let startY = random(0, height);
    let endY = random(0, height);

    paths.push({
      x1: 0,
      y1: startY,

      x2: 50,
      y2: endY,

      t: 0,

      previousX: 0,
      previousY: startY,

      color: random(colorPalette),

      zigzags: random(5, 20),

      finished: false
    });
  }
}


function draw() {

  for (let path of paths) {

    if (path.finished) {
      continue;
    }

    stroke(path.color);

    // animation speed
    path.t += 0.01;

    if (path.t > 1) {
      path.t = 1;
    }


    // normal point between vertices
    let x = lerp(path.x1, path.x2, path.t);
    let y = lerp(path.y1, path.y2, path.t);


    // -------------------------
    // ZIGZAG
    // -------------------------

    let dx = path.x2 - path.x1;
    let dy = path.y2 - path.y1;

    let len = sqrt(dx * dx + dy * dy);

    let px = -dy / len;
    let py = dx / len;

    let amount = 12;

    let zig =
      (2 / PI) *
      asin(
        sin(
          path.t *
          TWO_PI *
          path.zigzags
        )
      );

    x += px * zig * amount;
    y += py * zig * amount;


    // draw newest part
    line(
      path.previousX,
      path.previousY,
      x,
      y
    );

    path.previousX = x;
    path.previousY = y;


    // -------------------------
    // REACHED NEXT VERTEX
    // -------------------------

    if (path.t >= 1) {

      // connect exactly to vertex
      line(
        path.previousX,
        path.previousY,
        path.x2,
        path.y2
      );


      // next segment starts here
      path.x1 = path.x2;
      path.y1 = path.y2;


      // new vertex
      path.x2 += 50;
      path.y2 = random(0, height);


      // new random zigzag amount
      path.zigzags = random(5, 20);


      // reset animation
      path.t = 0;

      path.previousX = path.x1;
      path.previousY = path.y1;


      // reached right side
      if (path.x2 > width) {
        path.finished = true;
      }
    }
  }


  // stop once every line is finished
  if (paths.every(path => path.finished)) {
    noLoop();
  }
}