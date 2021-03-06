const HOST_URL = "http://localhost:3000/userInfo";
const overlayLoadingElement = document.getElementById("overlay-loading");
const deleteUserModal = document.getElementById("delete-user-modal");
const submitBtn = document.getElementById("form-control_save-btn");
const resetBtn = document.getElementById("form-control_reset-btn");
const userName = document.getElementById("form__input-user-name");
const fullName = document.getElementById("form__input-full-name");
const email = document.getElementById("form__input-email");
const birthday = document.getElementById("form__input-birthday");
const userDisplay = document.getElementById("user-display");
let idUserDelete = 0;
let idUserUpdate = 0;

const clearSpaceAndCapitalizeFirstLetter = (str) => {
  return str
    .trim()
    .replace(/  +/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function editUserInfo(target) {
  idUserUpdate = target.dataset.id;
  axios
    .get(HOST_URL + `/${idUserUpdate}`)
    .then((res) => {
      userName.value = res.data.userName;
      userName.disabled = true;
      fullName.value = res.data.fullName;
      email.value = res.data.email;
      email.disabled = true;
      birthday.value = res.data.birthday;
      submitBtn.innerHTML = "Update";
      resetBtn.innerHTML = "Cancel";
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteUser(target) {
  idUserDelete = target.dataset.id;
  deleteUserModal.classList.add("delete-user-modal--display");
}

function cancelDeleteUser() {
  console.log(idUserDelete);
  idUserDelete = 0;
  deleteUserModal.classList.remove("delete-user-modal--display");
}

function confirmDeleteUser() {
  axios
    .delete(HOST_URL + `/${idUserDelete}`)
    .then((res) => {
      idUserDelete = 0;
      deleteUserModal.classList.remove("delete-user-modal--display");
    })
    .catch((err) => {
      console.log(err);
      idUserDelete = 0;
      deleteUserModal.classList.remove("delete-user-modal--display");
    });
}

submitBtn.addEventListener("click", function postUserInfo(e) {
  e.preventDefault();
  const regexUserName = /^[a-zA-Z0-9]*$/;
  const regexFullName =
    /^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ]*$/;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!userName.value || !fullName.value || !email.value || !birthday.value) {
    alert("T???t c??? c??c tr?????ng ?????u kh??ng ???????c tr???ng.");
  } else {
    if (!regexUserName.test(userName.value.trim())) {
      alert("Username ch??? bao g???m s???, ch??? c??i hoa v?? th?????ng.");
    } else if (
      !regexFullName.test(clearSpaceAndCapitalizeFirstLetter(fullName.value))
    ) {
      alert(
        "Full name ch??? bao g???m ch??? c??i hoa, ch??? c??i th?????ng v?? kho???ng tr???ng."
      );
    } else if (!regexEmail.test(email.value.trim())) {
      alert("Email kh??ng h???p l???");
    } else if (
      new Date(birthday.value) >= new Date(Date.now()).setHours(0, 0, 0, 0)
    ) {
      alert("Birthday ph???i nh??? h??n ng??y hi???n t???i.");
    } else {
      if (idUserUpdate > 0) {
        console.log(idUserUpdate);
        const userInfo = {
          userName: userName.value,
          fullName: clearSpaceAndCapitalizeFirstLetter(fullName.value),
          email: email.value,
          birthday: birthday.value,
        };
        overlayLoadingElement.classList.add("is-display-loading");
        axios
          .put(HOST_URL + `/${idUserUpdate}`, userInfo)
          .then((res) => {
            idUserUpdate = 0;
            submitBtn.innerHTML = "Save";
            overlayLoadingElement.classList.remove("is-display-loading");
          })
          .catch((err) => {
            console.log(err);
            idUserUpdate = 0;
            submitBtn.innerHTML = "Save";
            overlayLoadingElement.classList.remove("is-display-loading");
          });
      } else {
        axios.get(HOST_URL + `?userName=${userName.value}`).then((res) => {
          if (res.data.length > 0) {
            alert("Username ???? t???n t???i");
          } else {
            axios.get(HOST_URL + `?email=${email.value}`).then((res) => {
              if (res.data.length > 0) {
                alert("Email ???? t???n t???i");
              } else {
                const userInfo = {
                  userName: userName.value.trim(),
                  fullName: clearSpaceAndCapitalizeFirstLetter(fullName.value),
                  email: email.value.trim(),
                  birthday: birthday.value,
                };
                overlayLoadingElement.classList.add("is-display-loading");
                axios
                  .post(HOST_URL, userInfo)
                  .then((res) => {
                    console.log(res);
                    overlayLoadingElement.classList.remove(
                      "is-display-loading"
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    overlayLoadingElement.classList.remove(
                      "is-display-loading"
                    );
                  });
              }
            });
          }
        });
      }
    }
  }
});

resetBtn.addEventListener("click", function resetUserInput(e) {
  e.preventDefault();
  userName.value = "";
  fullName.value = "";
  email.value = "";
  birthday.value = "";
  if (idUserUpdate > 0) {
    resetBtn.innerHTML = "Reset";
    idUserUpdate = 0;
  }
});

window.addEventListener("load", function handleRenderPage() {
  console.log("hello", Math.random());
  axios
    .get(HOST_URL)
    .then((res) => {
      console.log(res.data);
      if (res.data.length > 0) {
        const userInfoDislayList = res.data.map((userInfo) => {
          return `
          <tr>
            <td>${userInfo.id}</td>
            <td>${userInfo.userName}</td>
            <td>${userInfo.fullName}</td>
            <td>${userInfo.email}</td>
            <td>${userInfo.birthday}</td>
            <td>
              <button class="btn user-display_edit-btn" data-id=${userInfo.id} onclick="editUserInfo(this)">Edit</button>
              <button class="btn user-display_delete-btn" data-id=${userInfo.id} onclick="deleteUser(this)">Delete</button>
            </td>
          </tr>
        `;
        });
        userDisplay.innerHTML =
          userDisplay.innerHTML + userInfoDislayList.join("");
      } else {
        userDisplay.innerHTML =
          userDisplay.innerHTML +
          `<tr><td colspan="6" style="text-align:center;">Kh??ng c?? user n??o.</td></tr>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
