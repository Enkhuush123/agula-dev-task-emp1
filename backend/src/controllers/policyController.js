const policyService = require("../services/policyService");

async function createPolicy(req, res, next) {
  try {
    const policy = await policyService.createPolicy(req.body);
    res.status(201).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllPolicies(req, res, next) {
  try {
    const filters = {
      customer_id: req.query.customer_id,
      status: req.query.status,
    };

    const policies = await policyService.getAllPolicies(filters);
    res.status(200).json({
      success: true,
      data: policies,
    });
  } catch (error) {
    next(error);
  }
}

async function getPolicyById(req, res, next) {
  try {
    const policy = await policyService.getPolicyById(req.params.id);
    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelPolicy(req, res, next) {
  try {
    const policy = await policyService.cancelPolicy(req.params.id);
    res.status(200).json({
      success: true,
      message: "Policy cancelled successfully",
      data: policy,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  cancelPolicy,
};
