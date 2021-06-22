const touchGameIMG = document.getElementById("touchGameIMG");
const squatIMG = document.getElementById("squatIMG");
const dribbleIMG = document.getElementById("dribbleIMG");
const quickness = document.getElementById("quicknessIMG");

function homeRedirect() {
  touchGameIMG.addEventListener("click", () => {
    window.location.href = "touchGame.html";
  });
  squatIMG.addEventListener("click", () => {
    window.location.href = "squat.html";
  });
  dribbleIMG.addEventListener("click", () => {
    window.location.href = "dribble.html";
  });
  quickness.addEventListener("click", () => {
    window.location.href = "quickness.html";
  });
}

homeRedirect();
