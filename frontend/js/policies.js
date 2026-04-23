const policyForm = document.getElementById("policyForm");
const customerSelect = document.getElementById("customer_id");
const policyTypeSelect = document.getElementById("policy_type");
const baseAmountInput = document.getElementById("base_amount");
const startDateInput = document.getElementById("start_date");
const endDateInput = document.getElementById("end_date");
const premiumPreview = document.getElementById("premiumPreview");
const policiesTableBody = document.getElementById("policiesTableBody");

let customers = [];

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function getAgeFactor(age) {
  if (age < 25) return 1.5;
  if (age <= 50) return 1.0;
  return 1.3;
}

function getTypeFactor(policyType) {
  if (policyType === "car") return 1.2;
  if (policyType === "home") return 1.0;
  if (policyType === "travel") return 0.8;
  return 1;
}

function getPolicyTypeLabel(policyType) {
  if (policyType === "car") return "Автомашин";
  if (policyType === "home") return "Орон сууц";
  if (policyType === "travel") return "Аялал";
  return policyType;
}

function getStatusLabel(status) {
  if (status === "active") return "Идэвхтэй";
  if (status === "cancelled") return "Цуцлагдсан";
  if (status === "expired") return "Хугацаа дууссан";
  return status;
}

function updatePremiumPreview() {
  const customerId = customerSelect.value;
  const policyType = policyTypeSelect.value;
  const baseAmount = Number(baseAmountInput.value);

  if (!customerId || !policyType || !baseAmount || baseAmount <= 0) {
    premiumPreview.textContent = "0.00";
    return;
  }

  const customer = customers.find((c) => String(c.id) === String(customerId));
  if (!customer) {
    premiumPreview.textContent = "0.00";
    return;
  }

  const age = calculateAge(customer.birth_date);
  const ageFactor = getAgeFactor(age);
  const typeFactor = getTypeFactor(policyType);
  const premium = baseAmount * 0.02 * ageFactor * typeFactor;

  premiumPreview.textContent = premium.toFixed(2);
}

async function loadCustomersForDropdown() {
  try {
    const response = await apiRequest("/customers");
    customers = response.data;

    customerSelect.innerHTML =
      `<option value="">Даатгуулагч сонгох</option>` +
      customers
        .map(
          (customer) =>
            `<option value="${customer.id}">${customer.first_name} ${customer.last_name}</option>`,
        )
        .join("");
  } catch (error) {
    showMessage("error", error.message);
  }
}

async function loadPolicies() {
  try {
    policiesTableBody.innerHTML = `
      <tr><td colspan="7">Гэрээнүүд ачааллаж байна...</td></tr>
    `;

    const response = await apiRequest("/policies");
    const policies = response.data;

    if (!policies.length) {
      policiesTableBody.innerHTML = `
        <tr><td colspan="7">Гэрээ олдсонгүй.</td></tr>
      `;
      return;
    }

    policiesTableBody.innerHTML = policies
      .map(
        (policy) => `
          <tr>
            <td>${policy.id}</td>
            <td>${policy.customer_id}</td>
            <td>${getPolicyTypeLabel(policy.policy_type)}</td>
            <td>${policy.base_amount}</td>
            <td>${policy.premium}</td>
            <td><span class="badge ${policy.status}">${getStatusLabel(policy.status)}</span></td>
            <td>
              ${
                policy.status === "active"
                  ? `<button class="cancel-btn" onclick="cancelPolicy(${policy.id})">Цуцлах</button>`
                  : "-"
              }
            </td>
          </tr>
        `,
      )
      .join("");
  } catch (error) {
    policiesTableBody.innerHTML = `
      <tr><td colspan="7">${error.message}</td></tr>
    `;
  }
}

async function cancelPolicy(id) {
  try {
    await apiRequest(`/policies/${id}/cancel`, {
      method: "PATCH",
    });

    showMessage("success", "Гэрээ амжилттай цуцлагдлаа");
    loadPolicies();
  } catch (error) {
    showMessage("error", error.message);
  }
}

policyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const baseAmount = Number(baseAmountInput.value);

  if (baseAmount <= 0) {
    showMessage("error", "Даатгалын үнэлгээний дүн эерэг тоо байх ёстой");
    return;
  }

  if (new Date(endDate) <= new Date(startDate)) {
    showMessage("error", "Дуусах огноо нь эхлэх огнооноос хойш байх ёстой");
    return;
  }

  const payload = {
    customer_id: Number(customerSelect.value),
    policy_type: policyTypeSelect.value,
    base_amount: baseAmount,
    start_date: startDate,
    end_date: endDate,
  };

  try {
    await apiRequest("/policies", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    showMessage("success", "Гэрээ амжилттай үүслээ");
    policyForm.reset();
    premiumPreview.textContent = "0.00";
    loadPolicies();
  } catch (error) {
    showMessage("error", error.message);
  }
});

customerSelect.addEventListener("change", updatePremiumPreview);
policyTypeSelect.addEventListener("change", updatePremiumPreview);
baseAmountInput.addEventListener("input", updatePremiumPreview);

loadCustomersForDropdown();
loadPolicies();
