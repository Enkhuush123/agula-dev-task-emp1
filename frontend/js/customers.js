const { register } = require("module");

const customerForm = document.getElementById("customerForm");
const customersList = document.getElementById("customersList");
const customerDetails = document.getElementById("customerDetails");

async function loadCustomers() {
  try {
    customersList.innerHTML = `<div class="message loading">Даатгуулагчдын мэдээллийг ачааллаж байна...</div>`;
    const response = await apiRequest("/customers");
    const customers = response.data;

    if (!customers.length) {
      customersList.innerHTML = "<p>Даатгуулагчид олдсонгүй.</p>";
      return;
    }
    customersList.innerHTML = customers.map(
      (customer) => `
       <div class="list-item" onclick="viewCustomerDetails(${customer.id})">
            <strong>${customer.first_name} ${customer.last_name}</strong><br />
            Регистрийн дугаар: ${customer.register_number}
          </div> `,
    );
  } catch (error) {
    customersList.innerHTML = `<div class="message error">Даатгуулагчдын мэдээллийг ачааллахад алдаа гарлаа: ${error.message}</div>`;
  }
}

async function viewCustomerDetails(id) {
  try {
    customerDetails.innerHTML = `<div class="message loading">Дэлгэрэнгүй мэдээлэл ачааллаж байна...</div>`;

    const response = await apiRequest(`/customers/${id}`);
    const customer = response.data;

    customerDetails.innerHTML = `
      <p><strong>Нэр:</strong> ${customer.first_name}</p>
      <p><strong>Овог:</strong> ${customer.last_name}</p>
      <p><strong>Регистр:</strong> ${customer.register_number}</p>
      <p><strong>Төрсөн огноо:</strong> ${customer.birth_date}</p>
      <p><strong>Утас:</strong> ${customer.phone}</p>

      <h3>Гэрээнүүд</h3>
      ${
        customer.policies.length
          ? `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Төрөл</th>
                  <th>Үндсэн дүн</th>
                  <th>Premium</th>
                  <th>Төлөв</th>
                </tr>
              </thead>
              <tbody>
                ${customer.policies
                  .map(
                    (policy) => `
                      <tr>
                        <td>${policy.id}</td>
                        <td>${policy.policy_type}</td>
                        <td>${policy.base_amount}</td>
                        <td>${policy.premium}</td>
                        <td><span class="badge ${policy.status}">${policy.status}</span></td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
          : "<p>Энэ даатгуулагчид бүртгэлтэй гэрээ алга.</p>"
      }
    `;
  } catch (error) {
    customerDetails.innerHTML = `<div class="message error">${error.message}</div>`;
  }
}
customerForm.addEventListener("sumbit", async (e) => {
  e.preventDefault();
  const registerNumber = document
    .getElementById("register_number")
    .value.trim();

  if (!/^[A-Za-zА-Яа-яӨөҮүЁё]{2}\d{8}$/.test(registerNumber)) {
    showMessage("error", "Регистрийн дугаар 2 үсэг, 8 тооноос бүрдэх ёстой");
    return;
  }
  const payload = {
    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    register_number: registerNumber,
    birth_date: document.getElementById("birth_date").value,
    phone: document.getElementById("phone").value.trim(),
  };
  try {
    await apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    showMessage("success", "Даатгуулагч амжилттай бүртгэгдлээ");
    customerForm.reset();
    loadCustomers();
  } catch (error) {
    showMessage(
      "error",
      `Даатгуулагчийг бүртгэхэд алдаа гарлаа: ${error.message}`,
    );
  }
});

loadCustomers();
