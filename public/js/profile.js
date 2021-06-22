// const displayName = document.getElementById("displayName");
const email = document.getElementById("email");
const age = document.getElementById("age");
const editButton = document.getElementById("editButton");
let confirmButton = document.getElementById("confirmButton");
const signOutButton = document.getElementById("signOutButton");

async function init() {
  let res = await fetch("/profile");
  let profile = await res.json();

  //Main Top Card display Name
  mainDisplayName = document.querySelector("#mainDisplayName");
  mainDisplayName.innerHTML = profile.display_name;

  console.log("profile =", profile);

  if (!profile.user_name) {
    tempUserName = profile.email.split("@");
    profile.user_name = tempUserName[0];
  }
  document.querySelector("#userProfile-pic").src = profile.profile_pic;

  profileCard = document.querySelector("#profileCard");
  profileCard.innerHTML = /* html */ `
  <form onsubmit="onSubmit(event)" id="profileForm">

  <i class="fas fa-edit" onclick="editProfile()" id="editButton"></i>
  <div class="card-body">
      <div class="row">
          <div class="col-sm-4">
              <label for="userName" class="mb-0">User Name</label>
          </div>
          <div class="col-sm-8 text-secondary" id="userName">${profile.user_name}</div>
      </div>
      <hr />
      <div class="row">
          <div class="col-sm-4">
              <label for="userName" class="mb-0">Display Name</label>
          </div>
          <div class="col-sm-8 text-secondary" id="displayName">${profile.display_name}</div>
          <input type="text" name="editDisplayName" id="editDisplayName" hidden/>
      </div>
      <hr />
      <div class="row">
          <div class="col-sm-4">
              <h6 class="mb-0">Email</h6>
          </div>
          <div class="col-sm-8 text-secondary" id="email" >${profile.email}</div>
          <input type="text" name="editEmail" id="editEmail" hidden/>
      </div>
      <hr />
      <div class="row">
          <div class="col-sm-4">
              <h6 class="mb-0">Gender</h6>
          </div>
          <div class="col-sm-8 text-secondary" id="gender">${profile.gender}</div>
          <input type="text" name="editGender" id="editGender" hidden/>
      </div>
      <hr />
      <div class="row">
          <div class="col-sm-4">
              <h6 class="mb-0">Age</h6>
          </div>
          <div class="col-sm-8 text-secondary" id="age" contenteditable="false">${profile.age}</div>
          <input type="text" name="editAge" id="editAge" hidden/>
      </div>

      <div class="row" style="display:flex; justify-content: center;">
          <div class="col-sm-3">
              <h6 class="mb-0" style="display:flex; justify-content: center;">
              <button type="button" class="btn btn-outline-success" onclick="confirmProfile()" id="confirmButton">Confirm</button>
              <button type="button" class="btn btn-outline-danger" onclick="cancelProfile()" id="cancelButton">Cancel</button>
              </h6>
          </div>
      </div>
  </div>

  </form>
  `;
  document.querySelector("#editDisplayName").value = profile.display_name;
  document.querySelector("#editEmail").value = profile.email;
  document.querySelector("#editGender").value = profile.gender;
  document.querySelector("#editAge").value = profile.age;
}
init();

function editProfile() {
  document.querySelector("#displayName").hidden = true;
  document.querySelector("#editDisplayName").hidden = false;

  document.querySelector("#email").hidden = true;
  document.querySelector("#editEmail").hidden = false;

  document.querySelector("#gender").hidden = true;
  document.querySelector("#editGender").hidden = false;

  document.querySelector("#age").hidden = true;
  document.querySelector("#editAge").hidden = false;

  confirmButton = document.getElementById("confirmButton");
  confirmButton.style.display = "block";

  cancelButton = document.getElementById("cancelButton");
  cancelButton.style.display = "block";
}
function cancelProfile() {
  cancelButton.style.display = "none";
  confirmButton.style.display = "none";
  document.querySelector("#displayName").hidden = false;
  document.querySelector("#editDisplayName").hidden = true;
  document.querySelector("#email").hidden = false;
  document.querySelector("#editEmail").hidden = true;
  document.querySelector("#gender").hidden = false;
  document.querySelector("#editGender").hidden = true;
  document.querySelector("#age").hidden = false;
  document.querySelector("#editAge").hidden = true;
}

function confirmProfile() {
  confirmButton.style.display = "none";
  cancelButton.style.display = "none";

  document.querySelector("#displayName").hidden = false;
  document.querySelector("#editDisplayName").hidden = true;
  document.querySelector("#email").hidden = false;
  document.querySelector("#editEmail").hidden = true;
  document.querySelector("#gender").hidden = false;
  document.querySelector("#editGender").hidden = true;
  document.querySelector("#age").hidden = false;
  document.querySelector("#editAge").hidden = true;
  submitProfile();
}
async function submitProfile() {
  console.log("send profile");
  let form = document.querySelector("form#profileForm");
  // console.log("form:", form);
  let formData = new FormData(form);
  // console.log("editDisplayName:", formData.get("editDisplayName"));
  try {
    let res = await fetch("/profile", {
      method: "POST",
      body: formData,
    });
    // let text = await res.text();
    // if (res.status !== 201) {
    //   alert("Oops.. " + text);
    // }
    await init();
  } catch (err) {
    console.log(err);
    alert(err.toString());
  }
}

// function onSubmit(event) {
//   event.preventDefault();
//   console.log("form.onsubmit");
//   let formData = new FormData();
//   formData.set("editDisplayName", form.editDisplayName.value);
//   console.log("editDisplayName:", formData.get("editDisplayName"));
// }

function SignOut() {
  signOutButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
SignOut();
