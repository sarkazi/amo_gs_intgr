const amoInstance = require("../api/amo.instance.js");

const getUser = async (userId) => {
  const { data } = await amoInstance.get(`/users/${userId}`);

  return data;
};

const updateLead = async (leadId, payload) => {
  const { data } = await amoInstance.patch(`/leads/${leadId}`, payload);

  return data;
};

const getLead = async (leadId) => {
  const { data } = await amoInstance.get(`/leads/${leadId}`);

  return data;
};

const getContactsByLead = async (leadId) => {
  const { data } = await amoInstance.get(
    `/contacts?filter[leads.id]=${leadId}`,
    {
      params: {
        filter: {
          "leads.id": leadId,
        },
      },
    }
  );

  return data;
};

module.exports = {
  getUser,
  updateLead,
  getLead,
  getContactsByLead,
};
