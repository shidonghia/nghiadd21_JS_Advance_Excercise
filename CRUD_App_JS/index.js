const HOST_URL = "http://localhost:3000/userInfo";
const overlayLoadingElement = document.getElementById("overlay-loading");
const submitBtn = document.getElementById("form-control_save-btn");
const resetBtn = document.getElementById("form-control_reset-btn");
const userName = document.getElementById("form__input-user-name");
const fullName = document.getElementById("form__input-full-name");
const email = document.getElementById("form__input-email");
const birthday = document.getElementById("form__input-birthday");
console.log("hello", Math.random());

const clearSpaceAndCapitalizeFirstLetter = (str) => {
  return str
    .trim()
    .replace(/  +/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

submitBtn.addEventListener("click", function postUserInfo(e) {
  e.preventDefault();
  const regexUserName = /^[a-zA-Z0-9]*$/;
  const regexFullName =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*$/;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!userName.value || !fullName.value || !email.value || !birthday.value) {
    alert("Tất cả các trường đều không được trống.");
  } else {
    if (!regexUserName.test(userName.value.trim())) {
      alert("Username chỉ bao gồm số, chữ cái hoa và thường.");
    } else if (
      !regexFullName.test(clearSpaceAndCapitalizeFirstLetter(fullName.value))
    ) {
      alert(
        "Full name chỉ bao gồm chữ cái hoa, chữ cái thường và khoảng trắng."
      );
    } else if (!regexEmail.test(email.value.trim())) {
      alert("Email không hợp lệ");
    } else if (
      new Date(birthday.value) >= new Date(Date.now()).setHours(0, 0, 0, 0)
    ) {
      alert("Birthday phải nhỏ hơn ngày hiện tại.");
    } else {
      axios.get(HOST_URL + `?userName=${userName.value}`).then((res) => {
        if (res.data.length > 0) {
          alert("Username đã tồn tại");
        } else {
          axios.get(HOST_URL + `?email=${email.value}`).then((res) => {
            if (res.data.length > 0) {
              alert("Email đã tồn tại");
            } else {
              const userInfo = {
                userName: userName.value,
                fullName: fullName.value,
                email: email.value,
                birthday: birthday.value,
              };
              overlayLoadingElement.classList.add("is-display-loading");
              axios
                .post(HOST_URL, userInfo)
                .then((res) => {
                  console.log(res);
                  overlayLoadingElement.classList.remove("is-display-loading");
                })
                .catch((err) => {
                  console.log(err);
                  overlayLoadingElement.classList.remove("is-display-loading");
                });
            }
          });
        }
      });
    }
  }
});

resetBtn.addEventListener("click", function resetUserInput(e) {
  e.preventDefault();
  userName.value = "";
  fullName.value = "";
  email.value = "";
  birthday.value = "";
});
