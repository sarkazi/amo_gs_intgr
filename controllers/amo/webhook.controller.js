const amoService = require("../../services/amo.service");
const googleSheetsService = require("../../services/google-sheets.service.js");
const {
  getGoogleAccessToken,
} = require("../../services/google-sheets.service.js");
const moment = require("moment");

const onDefineRange = (sheetData) => {
  const nextEmptyRow = sheetData.hasOwnProperty("values")
    ? sheetData.values.length + 1
    : 1;
  return `!A${nextEmptyRow}`;
};

module.exports = async (req, res, next) => {
  try {
    const body = req.body;

    const isNoticeOfAddingDeal =
      body.hasOwnProperty("leads") && body.leads.hasOwnProperty("add");

    if (isNoticeOfAddingDeal) {
      const dealInfo = body.leads.add[0];

      const responsibleUserData = await amoService.getUser(
        dealInfo.responsible_user_id
      );

      const contactData = await amoService.getContactsByLead(dealInfo.id);

      console.log(contactData._embedded.contacts, "contactData");

      const googleAccessToken = await getGoogleAccessToken();

      const newSheetRecordData = [
        dealInfo.id,
        moment(+dealInfo.created_at * 1000).format("D MMM YYYY, HH:mm"),
        "contact phone",
        "contact name",
        responsibleUserData.name,
        responsibleUserData.id,
      ];

      const getSheetResponse = await googleSheetsService.getSheetData(
        googleAccessToken
      );

      const range = onDefineRange(getSheetResponse);

      await googleSheetsService.updateSheetData(
        [newSheetRecordData],
        googleAccessToken,
        range
      );
    }

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
