console.clear();

document
  .querySelector("#rankSelect")
  .addEventListener("change", onRankTypeChange);

async function onRankTypeChange() {
  let type = document.querySelector("#rankSelect").value;
  console.log(type);

  let rankingResult = await fetch(`/ranking?type=${type}`);
  let rankings = await rankingResult.json();
  document.querySelector(".c-list").innerHTML = "";
  // console.log(ranking);
  for (let ranking of rankings) {
    if (!ranking.user_name) {
      tempUserName = ranking.email.split("@");
      ranking.user_name = tempUserName[0];
    }
    if (!ranking.profile_pic) {
      ranking.profile_pic = "./images/teckyLogo.png";
    }

    let newRow = document.createElement("li");
    newRow.classList = "c-list__item";
    newRow.innerHTML = `
    <div class="c-list__grid">
      <div class="c-flag c-place u-bg--transparent">${ranking.rank}</div>
      <div class="c-media">
        <img class="c-avatar c-media__img" src="${ranking.profile_pic}" />
        <div class="c-media__content">
          <div class="c-media__title">${ranking.display_name}</div>
          <a class="c-media__link u-text--small" target="_blank">@${
            ranking.user_name
          }</a>
        </div>
      </div>
      <div class="u-text--right c-kudos">
        <div class="u-mt--8">
          <strong>${ranking.points}</strong> ${randomEmoji()}
        </div>
      </div>
    </div>
  `;
    if (ranking.rank == 1) {
      newRow.querySelector(".c-place").classList.add("u-text--dark");
      newRow.querySelector(".c-place").classList.add("u-bg--yellow");
      newRow.querySelector(".c-kudos").classList.add("u-text--yellow");
    } else if (ranking.rank == 2) {
      newRow.querySelector(".c-place").classList.add("u-text--dark");
      newRow.querySelector(".c-place").classList.add("u-bg--teal");
      newRow.querySelector(".c-kudos").classList.add("u-text--teal");
    } else if (ranking.rank == 3) {
      newRow.querySelector(".c-place").classList.add("u-text--dark");
      newRow.querySelector(".c-place").classList.add("u-bg--orange");
      newRow.querySelector(".c-kudos").classList.add("u-text--orange");
    }

    list.appendChild(newRow);
  }

  // Render winner card
  let winner = rankings[0];
  console.log(winner);
  const winnerCard = document.getElementById("winner");
  if (!winner.profile_pic) {
    winner.profile_pic = "./images/teckyLogo.png";
  }

  winnerCard.innerHTML = `
	<div class="u-text-small u-text--medium u-mb--16">Top Scorer Last Week</div>
	<img class="c-avatar c-avatar--lg" src="${winner.profile_pic}"/>
	<h3 class="u-mt--16">${winner.display_name}</h3>
	<span class="u-text--teal u-text--small">${winner.user_name}</span>
`;
  let winnerScore = document.querySelector("#winnerScore");
  winnerScore.innerHTML = winner.points;
}

onRankTypeChange();

const randomEmoji = () => {
  const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
  let randomNumber = Math.floor(Math.random() * emojis.length);
  return emojis[randomNumber];
};
