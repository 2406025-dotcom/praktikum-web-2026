document.addEventListener("DOMContentLoaded", () => {
    const fetchButton = document.querySelector("#btnFetch");
    const statusMessage = document.querySelector("#statusMessage");
    const userList = document.querySelector("#userList");

    async function fetchUsers() {
        fetchButton.disabled = true;
        statusMessage.textContent = "Sedang memuat data pengguna...";
        statusMessage.classList.remove("status-error");
        userList.replaceChildren();

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");

            if (!response.ok) {
                throw new Error(`Gagal mengambil data. Status HTTP: ${response.status}`);
            }

            const users = await response.json();

            if (!Array.isArray(users)) {
                throw new Error("Format data pengguna tidak valid.");
            }

            renderUsers(users);
            statusMessage.textContent = `Berhasil memuat ${users.length} data pengguna.`;
        } catch (error) {
            statusMessage.textContent = `Gagal memuat data: ${error.message}`;
            statusMessage.classList.add("status-error");
        } finally {
            fetchButton.disabled = false;
        }
    }

    function renderUsers(users) {
        const cards = users.map((user) => {
            const card = document.createElement("article");
            card.className = "user-card";

            const name = document.createElement("h2");
            name.className = "user-name";
            name.textContent = user.name;

            const email = document.createElement("p");
            email.className = "user-email";
            email.textContent = user.email;

            const company = document.createElement("p");
            company.className = "user-company";
            company.textContent = user.company?.name ?? "Perusahaan tidak tersedia";

            card.append(name, email, company);
            return card;
        });

        userList.replaceChildren(...cards);
    }

    fetchButton.addEventListener("click", fetchUsers);
});
