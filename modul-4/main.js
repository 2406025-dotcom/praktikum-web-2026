const projects = [
  {
    id: 1,
    title: "Sistem Inventaris Keuangan",
    category: "Web App",
    budget: 2500000,
    completed: true,
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 5000000,
    completed: true,
  },
  {
    id: 3,
    title: "Landing Page Profil Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false,
  },
  {
    id: 4,
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false,
  },
];

// Mengubah angka menjadi format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};

// Menyimpan pilihan filter dan kata pencarian
let selectedCategory = "Semua";
let searchKeyword = "";

// Memperbarui kartu statistik
const updateStats = () => {
  const totalProjects = projects.length;

  const totalBudget = projects.reduce((total, project) => total + project.budget, 0);

  const completedCount = projects.filter((project) => project.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;

  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);

  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Menampilkan daftar proyek
const renderProjects = () => {
  const container = document.getElementById("project-list");

  // Filter berdasarkan kategori dan nama proyek
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "Semua" || project.category === selectedCategory;

    const matchesSearch = project.title.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filteredProjects.length === 0) {
    container.innerHTML = '<p class="empty-message">Proyek tidak ditemukan.</p>';
    return;
  }

  container.innerHTML = filteredProjects
    .map((project) => {
      const badgeClass = project.completed ? "badge-success" : "badge-pending";

      const statusText = project.completed ? "Selesai" : "Dalam Pengerjaan";

      return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">
                        ${project.category}
                    </span>

                    <h3>${project.title}</h3>

                    <p class="project-budget">
                        ${formatRupiah(project.budget)}
                    </p>
                </div>

                <div class="project-controls">
                    <span class="badge ${badgeClass}">
                        ${statusText}
                    </span>

                    <div class="project-actions">
                        <button
                            type="button"
                            class="btn-status"
                            data-action="toggle"
                            data-id="${project.id}">
                            Ubah Status
                        </button>

                        <button
                            type="button"
                            class="btn-delete"
                            data-action="delete"
                            data-id="${project.id}">
                            Hapus Proyek
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
};

// Memperbarui statistik dan tampilan proyek
const refreshDashboard = () => {
  updateStats();
  renderProjects();
};

// Fitur 1: Form input proyek baru
document.getElementById("project-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("project-title");

  const categoryInput = document.getElementById("project-category");

  const budgetInput = document.getElementById("project-budget");

  const completedInput = document.getElementById("project-completed");

  const message = document.getElementById("form-message");

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const budget = Number(budgetInput.value);
  const completed = completedInput.checked;

  // Validasi judul
  if (title === "") {
    message.textContent = "Judul proyek tidak boleh kosong.";
    message.style.color = "#dc2626";
    titleInput.focus();
    return;
  }

  // Validasi anggaran
  if (budgetInput.value.trim() === "" || !Number.isFinite(budget) || budget <= 0) {
    message.textContent = "Anggaran harus berupa angka lebih besar dari 0.";
    message.style.color = "#dc2626";
    budgetInput.focus();
    return;
  }

  // Membuat objek proyek baru
  const newProject = {
    id: Date.now(),
    title: title,
    category: category,
    budget: budget,
    completed: completed,
  };

  // Memasukkan proyek ke array
  projects.push(newProject);

  // Mengosongkan form
  e.target.reset();

  // Menghapus pencarian agar proyek baru terlihat
  searchKeyword = "";
  document.getElementById("search-input").value = "";

  // Menampilkan semua kategori
  selectedCategory = "Semua";

  document.querySelectorAll(".btn-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "Semua");
  });

  message.textContent = "Proyek berhasil ditambahkan!";
  message.style.color = "#15803d";

  refreshDashboard();
});

// Fitur 2: Pencarian real-time
document.getElementById("search-input").addEventListener("input", (e) => {
  searchKeyword = e.target.value.trim().toLowerCase();
  renderProjects();
});

// Filter kategori
document.querySelectorAll(".btn-filter").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".btn-filter").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderProjects();
  });
});

// Fitur 3: Ubah status dan hapus proyek
document.getElementById("project-list").addEventListener("click", (e) => {
  const button = e.target.closest("button[data-action]");

  if (!button) return;

  const projectId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "toggle") {
    const project = projects.find((item) => item.id === projectId);

    if (project) {
      project.completed = !project.completed;
    }
  }

  if (action === "delete") {
    const index = projects.findIndex((item) => item.id === projectId);

    if (index !== -1) {
      projects.splice(index, 1);
    }
  }

  refreshDashboard();
});

// Menampilkan data pertama kali
refreshDashboard();
