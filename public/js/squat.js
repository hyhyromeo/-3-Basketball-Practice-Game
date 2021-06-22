// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let detector;
let detections = [];
let canvasWidth = (window.innerWidth-100);
let canvasHeight = (3*canvasWidth)/4;
let brain;
let poseLabel = "Begin!";
let standPos;
let isPlayerReady = false;
let isGameStartShown = false;
// let playerReadyTimer = 5;
let playerReadyTimer = 1;
let practiceTimer = 5;
let timeIntervalId;
let practiceTimeIntervalId;
let squatCount = 0;

function preload() {
  squatIMG = loadImage("./images/squat.jpg");
  standingIMG = loadImage("./images/standing.jpg");
  playerIMG = loadImage("./images/playertick.png");
  playerOKIMG = loadImage("./images/Clear-Tick-icon.png");
  fontRuss = loadFont("./fonts/RussoOne-Regular.ttf");
}

function setup() {
  deviceOrientation = 'landscape';
  createCanvas(canvasWidth, canvasHeight);
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  let options = {
    inputs: 34,
    outputs: 2,
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: "./model/model.json",
    metadata: "./model/model_meta.json",
    weights: "./model/model.weights.bin",
  };
  brain.load(modelInfo, brainloaded);
  textAlign(CENTER);
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function brainloaded() {
  console.log("pose classification ready!");
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 1000);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  requestAnimationFrame(classifyPose);
}
function preGameFunctions() {
  function drawPositionGreenLayer() {
    push();
    fill(0, 255, 0, 95);
    noStroke();
    rect(0, 0, canvasWidth*0.25, canvasHeight);
    fill(0, 255, 0, 95);
    noStroke();
    rect(canvasWidth*0.75, 0, canvasWidth, canvasHeight);
    playerOKIMG.resize(canvasWidth*0.25, canvasHeight*0.33);
    image(playerOKIMG, canvasWidth*0.4, canvasHeight*0.33);
    pop();
  }

  function timeIt() {
    if (playerReadyTimer > 0) {
      playerReadyTimer--;
    }
  }

  function checkPosition() {
    isPlayerReady = 
    canvasHeight*0.2 > int(pose.nose.y) &&
    int(pose.nose.y) > 0 &&
    canvasWidth*0.75 > int(pose.leftWrist.x) &&
    int(pose.leftWrist.x) > canvasWidth*0.5 &&
    canvasWidth*0.5 > int(pose.rightWrist.x) &&
    int(pose.rightWrist.x) > canvasWidth*0.25;
    if (isPlayerReady && playerReadyTimer > 0 && !timeIntervalId) {
      timeIntervalId = setInterval(timeIt, 1000);
    }
    if (!isPlayerReady && playerReadyTimer > 0) {
      clearInterval(timeIntervalId);
      timeIntervalId = null;
      playerReadyTimer = 5;
      fill(0, 0, 0, 95);
      noStroke();
      rect(0, 0, canvasWidth*0.25, canvasHeight);
      fill(0, 0, 0, 95);
      noStroke();
      rect(canvasWidth*0.75, 0, canvasWidth, canvasHeight);
      playerIMG.resize(canvasWidth*0.25, canvasHeight*0.9375);
      image(playerIMG, canvasWidth*0.38,canvasHeight/48);
      fill("black");
      textSize(canvasWidth/32);
      textFont(fontRuss);
      textAlign(CENTER, CENTER);
      text("For best results", canvasWidth*0.5, canvasHeight*0.46);
      textSize(canvasWidth/64);
      text("Keep your eyes and feet", canvasWidth*0.5, canvasHeight*0.5);
      text("fully visible in the camera frame", canvasWidth*0.5, canvasHeight*0.53);
    }
  }
  if (pose) {
    if (playerReadyTimer > 0) {
      textSize(canvasWidth/24);
      textFont(fontRuss);
      textAlign(CENTER, CENTER);
      text("Start in", canvasWidth - canvasWidth / 7, canvasHeight / 12);
      text(
        "0:0" + playerReadyTimer,
        canvasWidth - canvasWidth / 9,
        canvasHeight / 7
      );
      checkPosition();
    }
    if (isPlayerReady) {
      if (playerReadyTimer > 0) {
        drawPositionGreenLayer();
      } else {
        if (!isGameStartShown) {
          push();
          fill("orange");
          textSize(canvasWidth*0.1);
          text("Start!", canvasWidth / 2, canvasHeight / 2);
          pop();
          setTimeout(() => {
            isGameStartShown = true;
          }, 2000);
        }
      }
    }
  }
}
function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  // <!--========================Draw human skeleton========================-->
  // if (pose) {
  //   for (let i = 0; i < skeleton.length; i++) {
  //     let a = skeleton[i][0];
  //     let b = skeleton[i][1];
  //     strokeWeight(2);
  //     stroke(0);

  //     line(a.position.x, a.position.y, b.position.x, b.position.y);
  //   }
  //   for (let i = 0; i < pose.keypoints.length; i++) {
  //     let x = pose.keypoints[i].position.x;
  //     let y = pose.keypoints[i].position.y;
  //     fill(0);
  //     stroke(255);
  //     ellipse(x, y, 16, 16);
  //   }
  // }
  pop();
  preGameFunctions();
    //<!--========================Classification========================-->

    if (poseLabel == "Q") {
      // fill("black");
      // noStroke();
      // textSize(32);
      // textFont(fontRuss);
      // textAlign(CENTER, CENTER);
      // text("DOWN", canvasWidth / 8, canvasHeight / 5);
      standingIMG.resize(canvasWidth*0.08, canvasHeight*0.1);
      image(standingIMG, canvasWidth*0.08, canvasHeight*0.042);
    } else if (poseLabel == "W") {
      // fill("black");
      // noStroke();
      // textSize(32);
      // textFont(fontRuss);
      // textAlign(CENTER, CENTER);
      // text("UP", canvasWidth / 8, canvasHeight / 5);
      squatIMG.resize(canvasWidth*0.08, canvasHeight*0.1);
      image(squatIMG, canvasWidth*0.08, canvasHeight*0.042);
    }
    //<!--========================Classification========================-->
  //<!--========================Draw human skeleton========================-->

  //<!--========================Draw Wrist========================-->
  // fill(0, 0, 255);
  // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
  // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
  //<!--========================Draw Wrist========================-->
  function practiceTimeIt() {
    if (practiceTimer > 0) {
      practiceTimer--;
    }
  }

  if (isGameStartShown) {
    fill(0,0,0,95);
    noStroke();
    rect(canvasWidth - canvasWidth / 9 - (canvasWidth/14), canvasHeight - canvasHeight / 7 -(canvasHeight / 19.2), canvasWidth/7.18, canvasHeight/8.72, 20);
    fill("white");
    text(
      squatCount + " / 5",
      canvasWidth - canvasWidth / 9,
      canvasHeight - canvasHeight / 7
    );
    fill(0,0,0,95);
    noStroke();
    rect(canvasWidth - canvasWidth / 9 - (canvasWidth/14), canvasHeight / 7 -(canvasHeight / 19.2), canvasWidth/7.18, canvasHeight/8.72, 20);
    fill("white");
    text(practiceTimer + 's', canvasWidth - canvasWidth / 9, canvasHeight / 7);
    if (poseLabel == "W" && !practiceTimeIntervalId) {
      practiceTimeIntervalId = setInterval(practiceTimeIt, 1000);
    }
    if (poseLabel == "Q" && practiceTimer > 0) {
      clearInterval(practiceTimeIntervalId);
      practiceTimeIntervalId = null;
      fill("orange");
      text("You can do it!", canvasWidth / 2, canvasHeight / 2);
    }
    if (practiceTimer === 0) {
      squatCount++;
      clearInterval(practiceTimeIntervalId);
      practiceTimeIntervalId = null;
      practiceTimer = 5;
    }
    if (squatCount == 6) {
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
      background(0);
      sweetAlert();
      noLoop();
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