let drawVideo;
let poseNet;
let poses = [];
let width = 1200;
let height = 1000;
//result for insert to DB//
let pointResult = 0; // score

let startText = false
let tittleShown = false;
let drawReady = true;
//
let img;
//
/* targets */
let targetRadius = 100;
let targetSize = targetRadius * 2;
let targetRadiusSquare = targetRadius ** 2;
let target = {
  x: width / 2,
  y: height / 3,
  part: "leftWrist",
};
let ballYPos = "up";

var timerValue = 10;
var startButton;

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent('canvastouch');
  drawVideo = createCapture(VIDEO);
  drawVideo.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(drawVideo, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
    onPose(poses);
  });
  // image(img, 0, 0);  // Hide the video element, and just show the canvas
  drawVideo.hide();
}

function onPose() {
  for (let pose of poses) {
    let part = pose.pose[target.part];
    if (part.confidence > 0.3) {
      let distanceSquare = calcDistanceSquare(part, target);
      if (distanceSquare <= targetRadiusSquare) {
        // playSoundEffect();
        target.x =
          Math.random() * (width - targetRadius * 4) + targetRadius * 2;
        target.y =
          Math.random() * (height - targetRadius * 4) + targetRadius * 2;
        // target.x = 0.9 * (width - targetRadius * 4) + targetRadius * 2;
        // target.y = Math.random() * (height - targetRadius * 4) + targetRadius * 8;
        if (ballYPos == "up") {
          startText = true;
          // target.y = 600;
          ballYPos = "down";
          pointResult = pointResult + 1;
          // document.querySelector("#count").innerHTML = `count : ${pointResult}`;
          console.log("touched times: " + pointResult);
          if (pointResult == 1) {
            setInterval(timeIt, 1000);
            console.log("Start Timer");
          }
        } else {
          // target.y = 200;
          ballYPos = "up";
          pointResult = pointResult + 1;
          // document.querySelector("#count").innerHTML = `count : ${pointResult}`;
          console.log("touched times: " + pointResult);
        }
      }
    }
  }
}

async function submitPoints() {
  let res = await fetch("/events/reaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points: pointResult }),
  })
  let result = await res.json()
  console.log('result:', result)
}

function stop() {
  noLoop();
  console.log("Point: ", pointResult)
  submitPoints()
  sweetAlert();
  console.log("Times UP");
}

function goBack() {
  window.history.back();
}

function sweetAlert() {
  Swal.fire({
    title: "Well Done My Friend!",
    text: "Your result will upload to the Ranking page automatically",
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Press HERE to start again',
    showDenyButton: true,
    denyButtonText: 'Back To Daily Mission Page'
  }).then((result) => {
    if (result.isConfirmed){
      location.reload();
    }else if (result.isDenied){
      window.location.href = 'daily-mission.html'
    }
    })
}

function modelReady() {
  select("#status").html("  ");
  drawReady = false;
  if (!drawReady) {
    draw();
  }
}

function draw() {
  if (!drawReady) {
    push();
    translate(drawVideo.width, 0);
    scale(-1, 1);
    image(drawVideo, 0, 0, width, height);
    // the point to reach by body
    drawTargets();
    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    // drawSkeleton();
    pop();
    if (!tittleShown) {
      title();
    }
    counts();
    go();
  } else {
    console.log("not yet ready");
  }
}

function preload() {
  img = loadImage("images/ball2.png");
}

function drawTargets() {
 


  if (!startText){
    push();
    translate(drawVideo.width, 0);
    scale(-1, 1);
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(target.x, target.y, targetSize, targetSize);
    fill(255, 255, 255);
    text("Start" ,665, 355)
    pop();
  }else{
    image(img, target.x -100, target.y -100, targetSize, targetSize);
  // ellipse(target.x, target.y, targetSize, targetSize);
  
  }
 

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score >= 0.3) {
        if (keypoint.part === "leftWrist" || keypoint.part === "rightWrist") {
          fill(255, 159, 0, 150);
          noStroke();
          ellipse(keypoint.position.x, keypoint.position.y, 150, 150);
        }
        // fill(255, 0, 0);
        // noStroke();
        // ellipse(keypoint.position.x, keypoint.position.y, 80, 80);
      }
    }
  }
}

// A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       strokeWeight(10);
//       line(
//         partA.position.x,
//         partA.position.y,
//         partB.position.x,
//         partB.position.y
//       );
//     }
//   }
// }

// function startTimer(duration, display) {
//   var timer = duration,
//     minutes,
//     seconds;
//   setInterval(function () {
//     minutes = parseInt(timer / 60, 10);
//     seconds = parseInt(timer % 60, 10);

//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     display.textContent = minutes + ":" + seconds;
//     if (timer <= 0) {
//       timer = timer;
//     } else {
//       --timer;
//     }
//   }, 1000);
// }

// function start() {
//   var oneMinute = 60 * 0.2,
//     display = document.querySelector("#time");
//   startTimer(oneMinute, display);
// }

function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function go() {
  if (timerValue < 10) {
    tittleShown = true;
  }
  fill(255, 255, 255, 150);
  textSize(60);
  textAlign(RIGHT, BOTTOM);
  if (timerValue >= 10) {
    text("0:" + timerValue, 1160, 990);
  }
  if (timerValue < 10) {
    text("End in : 0:0" + timerValue, 1160, 990);
  }
  fill(255, 0, 0);
  if (timerValue < 5){
    text("End in : 0:0" + timerValue, 1160, 990);
  }
  if (timerValue == 0) {
    // text("game over", width / 2, height / 2 + 15);
    stop();
  }
}
function title() {
  fill(255, 0, 0);
  textSize(60);
  textAlign(CENTER, CENTER);
  // text("Touch the ball with your Wrist to Start! ", width / 2, height / 2);
  text("  ", width / 2, height / 2);

}
function counts() {
  fill(255, 255, 255, 150);
  textSize(60);
  textAlign(LEFT, TOP);
  text("Touched Count : " + pointResult, 50, 30);
}

function back() {
  let back = document.getElementById("back")
  back.addEventListener("click", () => {
    window.location.href = "daily-mission.html";
  })
}

back()
