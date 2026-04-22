function validateRegisterNumber(registerNumber) {
  return /^[A-Za-zА-Яа-яӨөҮүЁё]{2}\d{8}$/.test(registerNumber);
}

function validateCustomerInput(data) {
  const { firstName, lastName, registerNumber, birth_date, phone } = data;
  if (!firstName || !lastName || !registerNumber || !birth_date || !phone) {
    return "Бүх талбаруудыг бөглөнө үү.";
  }
  if (!validateRegisterNumber(registerNumber)) {
    return "Регистрийн дугаар буруу байна. Жишээ: AB12345678";
  }
  return null;
}

function validatePolicyInput(data) {
  const { customer_id, policy_type, base_amount, start_date, end_date } = data;
  if (
    !customer_id ||
    !policy_type ||
    !base_amount ||
    !start_date ||
    !end_date
  ) {
    return "Бүх талбаруудыг бөглөнө үү.";
  }
  if (!["car", "home", "travel"].includes(policy_type)) {
    return "Буруу даатгалын төрөл.";
  }
  if (Number(base_amount) <= 0) {
    return "Үндсэн дүн эерэг байх ёстой.";
  }
  if (new Date(end_date) <= new Date(start_date)) {
    return "Дуусах огноо эхлэх огнооноос хойш байх ёстой.";
  }

  return null;
}
module.exports = {
  validateRegisterNumber,
  validateCustomerInput,
  validatePolicyInput,
};
