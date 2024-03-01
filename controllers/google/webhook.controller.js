const { updateLead } = require("../../services/amo.service.js");

const defineTargetFields = (body) => {
  return Object.entries(body).reduce((acc, [key, value]) => {
    if (key.toLocaleLowerCase().includes("номер")) {
      acc["leadId"] = +value;
    }
    if (key.toLocaleLowerCase().includes("бюджет")) {
      acc["budget"] = +value;
    }

    return acc;
  }, {});
};

module.exports = async (req, res, next) => {
  try {
    const body = req.body;

    console.log(body, "fdusjf");

    const { leadId, budget } = defineTargetFields(body);

    const payload = {
      price: budget,
    };

    await updateLead(leadId, payload);

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
