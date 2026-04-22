function calculateAge(birth_date) {
  const today = new Date();
  const birth = new Date(birth_date);
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

function getTypeFactor(policy_type) {
  if (policy_type === "car") return 1.2;
  if (policy_type === "home") return 1.0;
  if (policy_type === "travel") return 0.8;
  throw new Error("Invalid policy type");
}

function calculatePremium(base_amount, birthDate, policyType) {
  const basePremium = Number(base_amount) * 0.02;
  const age = calculateAge(birthDate);
  const ageFactor = getAgeFactor(age);
  const typeFactor = getTypeFactor(policyType);
  return Number((basePremium * ageFactor * typeFactor).toFixed(2));
}

module.exports = {
  calculateAge,
  getAgeFactor,
  getTypeFactor,
  calculatePremium,
};
