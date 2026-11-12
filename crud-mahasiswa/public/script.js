// File: public/script.js - Logika Client-Side JavaScript CRUD
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tangkap Elemen DOM
  const mhsForm = document.querySelector("#mhsForm");
  const mhsIdInput = document.querySelector("#mhsId");
  const nimInput = document.querySelector("#nim");
  const namaInput = document.querySelector("#nama");
  const jurusanInput = document.querySelector("#jurusan");
  const emailInput = document.querySelector("#email");
  const btnSubmit = document.querySelector("#btnSubmit");
  const btnCancel = document.querySelector("#btnCancel");
  const formTitle = document.querySelector("#formTitle");
  const mhsTableBody = document.querySelector("#mhsTableBody");
  const alertMessage = document.querySelector("#alertMessage");

  // Elemen fitur tugas mandiri
  const searchInput = document.querySelector("#searchInput");
  const counter = document.querySelector("#counter");

  let listMahasiswa = [];

  // Fungsi Pembantu Notifikasi Alert
  const showAlert = (text, type = "success") => {
    alertMessage.textContent = text;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.style.display = "block";
    setTimeout(() => { alertMessage.style.display = "none"; }, 3000);
  };

  // Indikator 6.3: Memperbarui counter total mahasiswa
  const updateCounter = () => {
    counter.textContent = `Total Mahasiswa Terdaftar: ${listMahasiswa.length} Orang`;
  };

  // 2. READ: Ambil Data Mahasiswa dari API Node.js
  const loadMahasiswa = async () => {
    try {
      const res = await fetch("/api/mahasiswa");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server mengirim halaman HTML, bukan data API. Jalankan backend dengan `npm start`, lalu buka http://localhost:3000."
        );
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Server merespons dengan status ${res.status}.`);
      }
      if (!Array.isArray(data)) {
        throw new Error("Format data yang diterima dari server tidak valid.");
      }
      listMahasiswa = data;
      renderTable(listMahasiswa);
      updateCounter();
    } catch (err) {
      const message = err instanceof TypeError
        ? "Backend tidak dapat dihubungi. Jalankan server dengan perintah `npm start`."
        : `Gagal memuat data: ${err.message}`;
      showAlert(message, "error");
    }
  };

  const renderTable = (data) => {
    mhsTableBody.innerHTML = "";
    if (data.length === 0) {
      mhsTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center;color:#64748b;'>Belum ada data mahasiswa tersimpan.</td></tr>";
      return;
    }
    data.forEach((mhs, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${mhs.nim}</td>
        <td>${mhs.nama}</td>
        <td>${mhs.jurusan}</td>
        <td>${mhs.email}</td>
        <td>
          <button class="btn-action btn-edit" data-id="${mhs.id}">Edit</button>
          <button class="btn-action btn-delete" data-id="${mhs.id}">Hapus</button>
        </td>
      `;
      mhsTableBody.appendChild(tr);
    });
  };

  // Fitur 1: Kolom Pencarian Real-Time (Search Filter di JavaScript)
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = listMahasiswa.filter((m) => {
      return (
        m.nama.toLowerCase().includes(keyword) ||
        m.nim.toLowerCase().includes(keyword)
      );
    });
    renderTable(filtered);
  });

  // 3. CREATE & UPDATE: Submit Formulir
  mhsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fitur 2: Validasi Pencegahan NIM Duplikat di Frontend JavaScript
    const nimBaru = nimInput.value.trim();
    const idEdit = mhsIdInput.value;
    const nimSudahAda = listMahasiswa.some((m) => {
      if (idEdit && String(m.id) === String(idEdit)) return false;
      return m.nim.toLowerCase() === nimBaru.toLowerCase();
    });
    if (nimSudahAda) {
      showAlert("NIM sudah terdaftar!", "error");
      nimInput.focus();
      return;
    }

    const payload = {
      nim: nimBaru,
      nama: namaInput.value.trim(),
      jurusan: jurusanInput.value,
      email: emailInput.value.trim(),
    };

    const isEdit = Boolean(idEdit);
    const url = isEdit ? `/api/mahasiswa/${idEdit}` : "/api/mahasiswa";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        showAlert(result.message);
        resetForm();
        loadMahasiswa();
      } else {
        showAlert("Terjadi kesalahan: " + result.message, "error");
      }
    } catch (err) {
      showAlert("Gagal mengirim data ke server", "error");
    }
  });

  // 4. DELETE & EDIT: Tangani Event Klik pada Tabel (Event Delegation)
  mhsTableBody.addEventListener("click", async (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    // Mode Edit: Isi form otomatis
    if (e.target.classList.contains("btn-edit")) {
      const targetMhs = listMahasiswa.find((m) => m.id === id);
      if (targetMhs) {
        mhsIdInput.value = targetMhs.id;
        nimInput.value = targetMhs.nim;
        namaInput.value = targetMhs.nama;
        jurusanInput.value = targetMhs.jurusan;
        emailInput.value = targetMhs.email;
        formTitle.textContent = "Edit Data Mahasiswa";
        btnSubmit.textContent = "Perbarui Mahasiswa";
        btnCancel.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // Mode Delete: Hapus data via HTTP DELETE
    else if (e.target.classList.contains("btn-delete")) {
      if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
        try {
          const res = await fetch(`/api/mahasiswa/${id}`, { method: "DELETE" });
          const result = await res.json();
          if (result.success) {
            showAlert(result.message);
            loadMahasiswa();
          }
        } catch (err) {
          showAlert("Gagal menghapus data dari server", "error");
        }
      }
    }
  });

  // 5. Reset Form ke Mode Tambah
  const resetForm = () => {
    mhsForm.reset();
    mhsIdInput.value = "";
    formTitle.textContent = "Tambah Mahasiswa Baru";
    btnSubmit.textContent = "Simpan Mahasiswa";
    btnCancel.style.display = "none";
  };

  btnCancel.addEventListener("click", resetForm);

  // Ambil data pertama kali
  loadMahasiswa();
});
