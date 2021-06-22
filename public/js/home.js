const profileIMG = document.getElementById("profileIMG");
const rankingIMG = document.getElementById("rankingIMG");
const dailyMissionIMG = document.getElementById("dailyMissionIMG");

function homeRedirect() {
  profileIMG.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
  rankingIMG.addEventListener("click", () => {
    window.location.href = "ranking.html";
  });
  dailyMissionIMG.addEventListener("click", () => {
    window.location.href = "daily-mission.html";
  });
}

homeRedirect();
