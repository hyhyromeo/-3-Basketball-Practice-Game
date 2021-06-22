let header = document.querySelector("header");

header.innerHTML = /* html */ ` 

<nav class="navbar navbar-light nb-responsive">
  <form class="form-inline">
    <button class="btn nav-btn " id="home" type="button">Home</button>
    <button class="btn nav-btn" id="profile" type="button">Profile</button>
    <button class="btn nav-btn" id="ranking" type="button">Rank</button>
    <button class="btn nav-btn" id="dailyMission" type="button">Daily Mission</button>
    <button class="btn btn-outline-warning btn nav-btn" id="threePointEvent" type="button">
      <i class="fas fa-basketball-ball"></i><i class="fas fa-basketball-ball"></i>
      3 POINT CHALLENGE IS NOW BEGIN!!
      <i class="fas fa-basketball-ball"></i><i class="fas fa-basketball-ball"></i></button>
  </form>
</nav>

`;

function pageInitCss() {
  let path = location.pathname;

  if (path.indexOf("home.html") > 0) {
    document.getElementById("home").classList.add("btn-outline-success");
    document.getElementById("profile").classList.add("btn-outline-light");
    document.getElementById("ranking").classList.add("btn-outline-light");
    document.getElementById("dailyMission").classList.add("btn-outline-light");
  }
  if (path.indexOf("profile.html") > 0) {
    document.getElementById("home").classList.add("btn-outline-light");
    document.getElementById("profile").classList.add("btn-outline-success");
    document.getElementById("ranking").classList.add("btn-outline-light");
    document.getElementById("dailyMission").classList.add("btn-outline-light");
  }

  if (path.indexOf("ranking.html") > 0) {
    document.getElementById("home").classList.add("btn-outline-light");
    document.getElementById("profile").classList.add("btn-outline-light");
    document.getElementById("ranking").classList.add("btn-outline-success");
    document.getElementById("dailyMission").classList.add("btn-outline-light");
  }

  if (path.indexOf("daily-mission.html") > 0) {
    document.getElementById("home").classList.add("btn-outline-light");
    document.getElementById("profile").classList.add("btn-outline-light");
    document.getElementById("ranking").classList.add("btn-outline-light");
    document.getElementById("dailyMission").classList.add("btn-outline-success");
  }

  if (path.indexOf("profilebackup.html") > 0) {
    document.getElementById("home").classList.add("btn-outline-light");
    document.getElementById("profile").classList.add("btn-outline-light");
    document.getElementById("ranking").classList.add("btn-outline-light");
    document.getElementById("dailyMission").classList.add("btn-outline-success");
  }
}

pageInitCss();

function redirect() {
  let profile = document.getElementById("profile");
  profile.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  let ranking = document.getElementById("ranking");
  ranking.addEventListener("click", () => {
    window.location.href = "ranking.html";
  });

  let home = document.getElementById("home");
  home.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  let dailyMission = document.getElementById("dailyMission");
  dailyMission.addEventListener("click", () => {
    window.location.href = "daily-mission.html";
  });
  let threePointEvent = document.getElementById("threePointEvent");
  threePointEvent.addEventListener("click", () => {
    window.location.href = "comingsoon.html";
  });
}

redirect();
