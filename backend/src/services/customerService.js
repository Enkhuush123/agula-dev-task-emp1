const customerRepository = require("../repositories/customerRepository");
const policyRepository = require("../repositories/policyRepository");
const { validateCustomerInput } = require("../utils/validators");

async function createCustomer(data) {
  const validationError = validateCustomerInput(data);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const existingCustomer = await customerRepository.findByRegisterNumber(
    data.register_number,
  );

  if (existingCustomer) {
    const error = new Error("Регистрийн дугаар бүртгэлтэй байна.");
    error.status = 400;
    throw error;
  }

  return customerRepository.create(data);
}

async function getAllCustomers() {
  return customerRepository.findAll();
}

async function getCustomerById(id) {
  const customer = await customerRepository.findById(id);

  if (!customer) {
    const error = new Error("Тухайн ID-тай хэрэглэгч олдсонгүй.");
    error.status = 404;
    throw error;
  }

  const policies = await policyRepository.findByCustomerId(id);

  return {
    ...customer,
    policies,
  };
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
};
