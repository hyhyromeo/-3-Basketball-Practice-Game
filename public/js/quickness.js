// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
let video;
let poseNet;
let pose;
let poses = [];
let skeleton;
let canvasWidth = 1200;
let canvasHeight = 1000;
let timeIntervalId;
let ballPos = "left";
let timerValue = 20;
let playerPosReady = false;
//!------score----------
let coneResult = 0;

let ballStart = false;
let img;

let target = {
  x: canvasWidth / 2,
  y: canvasHeight / 3,
  part: "rightWrist",
};
let targetRadius = 100;
let targetSize = targetRadius * 2;
let targetRadiusSquare = targetRadius ** 2;

function preload() {
  img = loadImage("images/cone.png");
}

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvastouch");
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function gotPoses(poses) {
  //  show skeleton && point
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
  for (let pose of poses) {
    playerPosition();
    let part = pose.pose[target.part];
    if (part.confidence > 0.3) {
      let distanceSquare = calcDistanceSquare(part, target);
      if (distanceSquare <= targetRadiusSquare) {
        if (playerPosReady == true) {
          if (ballPos == "left") {
            target.x =
              1.11 * (canvasWidth - targetRadius * 4) + targetRadius * 2;
            target.y =
              1.16 * (canvasHeight - targetRadius * 4) + targetRadius * 2;
            ballPos = "right";
            ballStart = true;
            coneResult = coneResult + 1;
            console.log("touched times: " + coneResult);
            if (coneResult == 1) {
              setInterval(timeIt, 1000);
              console.log("Start Timer");
            }
          } else {
            target.x =
              -0.13 * (canvasWidth - targetRadius * 4) + targetRadius * 2;
            target.y =
              1.16 * (canvasHeight - targetRadius * 4) + targetRadius * 2;
            ballPos = "left";
            coneResult = coneResult + 1;
            console.log("touched times: " + coneResult);
          }
        } else {
          // console.log("Too close");
          
        }
      }
    }
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  drawTargets();
  playerPosition();
  counts();
  go();

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    fill(0, 277, 255, 150);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 100);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 100);
    // keypoints
    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   let x = pose.keypoints[i].position.x;
    //   let y = pose.keypoints[i].position.y;
    //   fill(0, 255, 0);
    //   ellipse(x, y, 20, 20);
    // }

    // skeleton line
    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(255);
    //   line(a.position.x, a.position.y, b.position.x, b.position.y);
    // }
  }
  pop();
}

function drawTargets() {
  fill(255, 0, 0, 100);
  noStroke();
  if (ballStart == false) {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    ellipse(target.x, target.y, targetSize, targetSize);
    fill(255, 255, 255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("Start", canvasWidth / 2, canvasHeight / 3);
    pop();
  } else {
    image(img, target.x - 100, target.y - 100, targetSize, targetSize);
    // console.log("222");
  }
}

function calcDistanceSquare(a, b) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function timeIt() {
  if (timerValue > 0 && playerPosReady == true) {
    playerPosition();
    timerValue--;
    console.log(pose.leftAnkle.y);
  } else {
    // console.log("too close (timer)");
  }
}

function go() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  fill(255, 255, 255, 150);
  textSize(50);
  textAlign(RIGHT, BOTTOM);
  if (timerValue >= 10) {
    text("0:" + timerValue, 1160, 990);
  }
  if (timerValue < 10) {
    text("End in : 0:0" + timerValue, 1160, 990);
  }
  fill(255, 0, 0);
  if (timerValue < 5) {
    text("End in : 0:0" + timerValue, 1160, 990);
  }
  if (timerValue == 0) {
    text("game over", width / 2, height / 2 + 15);
    stop();
  }
  pop();
}
async function submitPoints() {
  let res = await fetch("/events/quickness", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points: coneResult }),
  })
  let result = await res.json()
  console.log('result:', result)
}

function stop() {
  noLoop();
  sweetAlert();
  console.log("Times UP");
  submitPoints()
}

function sweetAlert() {
  Swal.fire({
    title: "Well Done My Friend!",
    text: "Your result will upload to the Ranking page automatically",
    icon: "success",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Press HERE to start again",
    showDenyButton: true,
    denyButtonText: "Back To Daily Mission Page",
  }).then(function (result) {
    if (result.isConfirmed) {
      location.reload();
    } else if (result.isDenied) {
      window.location.href = "daily-mission.html";
    }
  });
}

function counts() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  fill(255, 255, 255, 150);
  textSize(60);
  textAlign(LEFT, TOP);
  text("Score : " + coneResult, 50, 30);
  pop();
}

function playerPosition() {
  if (pose) {
    if (400 > int(pose.nose.y) && int(pose.nose.y) > 100 &&  900 > int(pose.leftAnkle.y) && int(pose.leftAnkle.y) > 500) {
      playerPosReady = true;
    } else {
      playerPosReady = false;
      push();
      translate(video.width, 0);
      scale(-1, 1);
      fill(255, 255, 255);
      textSize(100);
      textAlign(CENTER, TOP);
      text("Too close for start", canvasWidth / 2, canvasHeight / 3);
      
      pop();
    }
  }
}

function back() {
  let back = document.getElementById("back")
  back.addEventListener("click", () => {
    window.location.href = "daily-mission.html";
  })
}

back()