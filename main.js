let addModal = document.querySelector("#add-modal");
let addBtn = document.querySelector("#add-btn");
let saveChangesBtn = document.querySelector("#save-changes-btn");
let addInModalBtn = document.querySelector("#modal-add-btn");
let closeBtn = document.querySelector("#close");

let currentPage = 1;

closeBtn.addEventListener("click", () => {
  addInModalBtn.setAttribute("style", "display: block !important;");
  saveChangesBtn.setAttribute("style", "display: none !important;");
});

// inputs
let nameInp = document.querySelector("#add-name-inp");
let surnameInp = document.querySelector("#add-surname-inp");
let phoneNumberInp = document.querySelector("#add-phone-inp");
let weeklyInp = document.querySelector("#add-weekly-inp");
let monthlyInp = document.querySelector("#add-monthly-inp");
let imageInp = document.querySelector("#add-img-inp");

const STUDENTS_API = "http://localhost:8000/students";

// create
async function addStudent() {
  if (
    !nameInp.value.trim() ||
    !surnameInp.value.trim() ||
    !phoneNumberInp.value.trim() ||
    !weeklyInp.value.trim() ||
    !imageInp.value.trim() ||
    !monthlyInp.value.trim()
  ) {
    console.log(imageInp);
    alert("Some inputs are empty!");
    return;
  }

  studentObj = {
    image: imageInp.value,
    name: nameInp.value,
    surname: surnameInp.value,
    number: phoneNumberInp.value,
    weeklyKPI: weeklyInp.value,
    monthlyKPI: monthlyInp.value,
  };

  await fetch(STUDENTS_API, {
    method: "POST",
    body: JSON.stringify(studentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  imageInp.value = "";
  nameInp.value = "";
  surnameInp.value = "";
  phoneNumberInp.value = "";
  weeklyInp.value = "";
  monthlyInp.value = "";

  alert("Added successfully!");

  render();
}

addBtn.addEventListener("click", () => {
  nameInp.value = "";
  surnameInp.value = "";
  phoneNumberInp.value = "";
  imageInp.value = "";
  weeklyInp.value = "";
  monthlyInp.value = "";
});

// read
let search = "";

async function render() {
  let contentBlock = document.querySelector("#content-block");
  contentBlock.innerHTML = "";
  let limit = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=4`;

  let res = await fetch(limit);
  let data = await res.json();

  data.forEach(item => {
    contentBlock.innerHTML += `
    <div class="card m-3" style="width: 18rem">
        <img
          src="${item.image}"
          class="card-img-top"
          alt="..."
        />
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${item.number}</h6>
          <p class="card-text">${item.weeklyKPI}</p>
          <p class="card-text">${item.monthlyKPI}</p>
          <a href="#" class="btn btn-secondary delete-student-btn" id="${item.id}">DELETE</a>
          <a href="#" class="btn btn-primary edit-student-btn" id="${item.id}" data-bs-toggle="modal"
          data-bs-target="#staticBackdrop">EDIT</a>
        </div>
      </div>
    `;
  });

  editbtns();
  addDeleteEventToBtns();
  addEditEvent();
}
render();

// update
function editbtns() {
  let editStudentBtns = document.querySelectorAll(".edit-student-btn");
  editStudentBtns.forEach(item => {
    item.addEventListener("click", () => {
      addInModalBtn.setAttribute("style", "display: none !important;");
      saveChangesBtn.setAttribute("style", "display: flex !important;");
    });
  });
}

async function editStudentsInfo(e) {
  let studentId = e.target.id;
  let res = await fetch(`${STUDENTS_API}/${studentId}`);
  let studentObj = await res.json();

  nameInp.value = studentObj.name;
  surnameInp.value = studentObj.surname;
  phoneNumberInp.value = studentObj.number;
  weeklyInp.value = studentObj.weeklyKPI;
  monthlyInp.value = studentObj.monthlyKPI;
  imageInp.value = studentObj.image;

  saveChangesBtn.setAttribute("id", studentObj.id);
}

function addEditEvent() {
  let editStudentBtns = document.querySelectorAll(".edit-student-btn");
  editStudentBtns.forEach(item => {
    item.addEventListener("click", editStudentsInfo);
  });
}

async function saveChanges(e) {
  let newStudentObj = {
    id: e.target.id,
    name: nameInp.value,
    surname: surnameInp.value,
    number: phoneNumberInp.value,
    image: imageInp.value,
    weeklyKPI: weeklyInp.value,
    monthlyKPI: monthlyInp.value,
  };

  await fetch(`${STUDENTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(newStudentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  nameInp.value = "";
  surnameInp.value = "";
  phoneNumberInp.value = "";
  imageInp.value = "";
  weeklyInp.value = "";
  monthlyInp.value = "";

  saveChangesBtn.removeAttribute("id");

  render();
}

// delete
async function deleteStudent(e) {
  let studentId = e.target.id;

  await fetch(`${STUDENTS_API}/${studentId}`, {
    method: "DELETE",
  });

  render();
}

function addDeleteEventToBtns() {
  let deleteStudentBtns = document.querySelectorAll(".delete-student-btn");
  deleteStudentBtns.forEach(button => {
    button.addEventListener("click", deleteStudent);
  });
}

saveChangesBtn.addEventListener("click", saveChanges);

// pagination
let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 4);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});

// search
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});
