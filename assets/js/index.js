// ======================================
// VARIABLES
// ======================================
// Ambil Input
const inputProjectName = document.getElementById("projectName");
const inputProjectDescription = document.getElementById("projectDescription");
const inputProjectStartDate = document.getElementById("projectStartDate");
const inputProjectEndDate = document.getElementById("projectEndDate");
// Projects Container
const projectsContainer = document.getElementById("projectContainer");
// Ambil Image
const inputProjectImage = document.getElementById("projectImage");
// Body Form
const form = document.getElementById("projectForm");
// Insiasi Modal
const projectContainerEL = document.getElementById("projectContainer");
const projectModal = document.getElementById("projectModal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Wadah buat menyimpan Object setiap Project
let projects = [];

//Kalo ada data di Local Storage, Ambil
const savedProjects = localStorage.getItem("projects");
if (savedProjects) {
  projects = JSON.parse(savedProjects);
}

// ======================================
// FUNCTIONS
// ======================================
function renderProjects() {
  let projectHTML = "";

  if (projects.length === 0) {
    projectHTML = `
    <h5 class="text-center text-secondary w-100 mt-5">
      Belum ada project saat ini.
      <br>
      Silakan tambahkan project baru di atas.
    </h5>
    `;
  } else {
    const projectInnerHTML = projects
      .map((project) => renderCardProject(project))
      .join("");
    // console.log(projectInnerHTML);

    projectsContainer.innerHTML = projectInnerHTML;
  }
}

// Menghitung Jumlah Bulan
function calculateDurationReadable(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start; // Hasilnya dalam miliseconds
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Konversi ke hari

  const months = Math.floor(days / 30); // Konversi sederhana ke bulan

  return `${months} bulan`;
}

// Untuk nyimpen di LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Render Card
function renderCardProject(project) {
  let techIconsHTML = "";

  if (project.techNodeJs == true) {
    techIconsHTML += '<i class="fa-brands fa-node-js fs-4 p-1"></i> ';
  }
  if (project.techNextJs == true) {
    techIconsHTML += '<span class="fw-bold fs-6 p-1">Next.JS</span> ';
  }
  if (project.techReactJs == true) {
    techIconsHTML += '<i class="fa-brands fa-react fs-4 p-1"></i> ';
  }
  if (project.techTypescript == true) {
    techIconsHTML += '<span class="fw-bold fs-6 p-1">TS</span> ';
  }

  return /* HTML */ `
    <div class="col-12 col-md-6 col-lg-4">
      <div
        class="card h-100 shadow-sm border-0 rounded-4 p-3 bg-white up-effect"
      >
        <img
          src="${project.image}"
          class="card-img-top rounded-3"
          alt="Project Image"
          style="object-fit: cover; height: 200px;"
        />
        <div class="card-body px-0 pb-0 text-start d-flex flex-column">
          <h5 class="card-title fw-bold mb-1 text-dark">${project.name}</h5>
          <p class="text-secondary small mb-3">Duration: ${project.duration}</p>
          <p
            class="card-text text-secondary mb-4"
            style="
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
          >
            ${project.description}
          </p>
          <div class="mb-3 text-secondary d-flex align-items-center gap-2">
            ${techIconsHTML}
          </div>
          <div class="d-flex gap-2 w-100 mt-auto">
            <button
              class="btn btn-outline-dark w-100 rounded-pill btn-view-details"
              data-id="${project.id}"
            >
              View Details
            </button>
            <button
              class="btn btn-dark w-50 rounded-pill btn-delete"
              data-id="${project.id}"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ======================================
// EVENTS HANDLER
// ======================================

// Kalo Form di Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const allowedTypes = ["image/png", "image/jpeg"];

  // Ambil gambar yang di Upload
  let imageFile = inputProjectImage.files[0];

  if (!allowedTypes.includes(imageFile.type)) {
    alert("Only JPG and PNG files are allowed.");
  } else {
    if (imageFile) {
      // Kalo ada gambar
      const reader = new FileReader();

      // Kalo udah selesai baca File
      reader.onload = function () {
        const imageUrl = reader.result; //Hasilnya ditaro disini

        const newProject = {
          id: Date.now(),
          name: inputProjectName.value,
          description: inputProjectDescription.value,
          duration: calculateDurationReadable(
            inputProjectStartDate.value,
            inputProjectEndDate.value,
          ),
          techNodeJs: document.getElementById("nodejs").checked,
          techNextJs: document.getElementById("nextjs").checked,
          techReactJs: document.getElementById("reactjs").checked,
          techTypescript: document.getElementById("typescript").checked,
          image: imageUrl,
        };

        projects.push(newProject);
        saveToLocalStorage();
        renderProjects();

        form.reset();
        console.log("Data Project:", projects);
      };

      reader.readAsDataURL(imageFile); //Baca File yang di Upload
    } else {
      // Kalo gaada Gambar
      const imageUrl = `http://placehold.co/600x400?text=${inputProjectName.value}`; //Pakai Placeholder

      const newProject = {
        id: Date.now(),
        name: inputProjectName.value,
        description: inputProjectDescription.value,
        duration: calculateDurationReadable(
          inputProjectStartDate.value,
          inputProjectEndDate.value,
        ),
        techNodeJs: document.getElementById("nodejs").checked,
        techNextJs: document.getElementById("nextjs").checked,
        techReactJs: document.getElementById("reactjs").checked,
        techTypescript: document.getElementById("typescript").checked,
        image: imageUrl,
      };

      projects.push(newProject);
      saveToLocalStorage();
      renderProjects();
      form.reset();

      console.log("Data Project:", projects);
    }
  }
});

// Kalo View Details di Klik
projectContainerEL.addEventListener("click", function (e) {
  console.log(e);
  if (e.target.classList.contains("btn-view-details")) {
    const projectId = e.target.getAttribute("data-id");
    console.log(projectId);
    const project = projects.find((p) => p.id == projectId);

    if (project) {
      document.getElementById("modalTitle").textContent = project.name;
      document.getElementById("modalImage").src = project.image;
      document.getElementById("modalDuration").textContent = project.duration;
      document.getElementById("modalDescription").textContent =
        project.description;

      let techIconsHTML = "";
      if (project.techNodeJs)
        techIconsHTML += '<i class="fa-brands fa-node-js fs-4 p-1"></i> ';
      if (project.techNextJs)
        techIconsHTML += '<span class="fw-bold fs-6 p-1">Next.JS</span> ';
      if (project.techReactJs)
        techIconsHTML += '<i class="fa-brands fa-react fs-4 p-1"></i> ';
      if (project.techTypescript)
        techIconsHTML += '<span class="fw-bold fs-6 p-1">TS</span> ';

      document.getElementById("modalTechnologies").innerHTML = techIconsHTML;

      // Tampilkan Modal
      projectModal.classList.remove("d-none");
      projectModal.classList.add("d-flex");
    }
  } else if (e.target.classList.contains("btn-delete")) {
    // Ambil data-id yang di Klik
    const projectId = e.target.getAttribute("data-id");

    if (confirm("Yakin ingin menghapus Project Ini?")) {
      // Cari Project yang id nya sama dengan data-id yang di Klik
      projects = projects.filter((item) => item.id != projectId);

      saveToLocalStorage();
      renderProjects();
    } else {
      return;
    }
  }
});

// Tutup Modal
closeModalBtn.addEventListener("click", function () {
  projectModal.classList.remove("d-flex");
  projectModal.classList.add("d-none");
});

// Tutup Modal di Body Modal
projectModal.addEventListener("click", function (e) {
  if (e.target === projectModal) {
    projectModal.classList.remove("d-flex");
    projectModal.classList.add("d-none");
  }
});

// ======================================
// INITIALIZATIONS
// ======================================
renderProjects();
