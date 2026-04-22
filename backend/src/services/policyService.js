const policyRepository = require("../repositories/policyRepository");
const customerRepository = require("../repositories/customerRepository");
const { validatePolicyInput } = require("../utils/validators");
const { calculatePremium } = require("../utils/premiumCalculator");

async function createPolicy(data) {
  const validationError = validatePolicyInput(data);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const customer = await customerRepository.findById(data.customer_id);

  if (!customer) {
    const error = new Error("Тухайн ID-тай хэрэглэгч олдсонгүй.");
    error.status = 404;
    throw error;
  }

  const premium = calculatePremium(
    data.base_amount,
    customer.birth_date,
    data.policy_type,
  );

  const newPolicy = {
    customer_id: Number(data.customer_id),
    policy_type: data.policy_type,
    base_amount: Number(data.base_amount),
    start_date: data.start_date,
    end_date: data.end_date,
    premium,
    status: "active",
  };

  return policyRepository.create(newPolicy);
}

async function getAllPolicies(filters) {
  return policyRepository.findAll(filters);
}

async function getPolicyById(id) {
  const policy = await policyRepository.findById(id);

  if (!policy) {
    const error = new Error("Даатгал олдсонгүй");
    error.status = 404;
    throw error;
  }

  return policy;
}

async function cancelPolicy(id) {
  const policy = await policyRepository.findById(id);

  if (!policy) {
    const error = new Error("Даатгал олдсонгүй");
    error.status = 404;
    throw error;
  }

  if (policy.status !== "active") {
    const error = new Error("Зөвхөн идэвхтэй даатгалыг цуцалж болно");
    error.status = 400;
    throw error;
  }

  await policyRepository.updateStatus(id, "cancelled");

  return policyRepository.findById(id);
}

module.exports = {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  cancelPolicy,
};
