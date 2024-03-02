import googleSheetsService from "../../services/google-sheets.service";
import amoService from "../../services/amo.service";

import recordedLeads from "../../state/recordedLeads";
import moment from "moment";

import { Response, Request, NextFunction } from "express";
import { ContactValue, IGetSheetResponse } from "../../services/types";

interface IDefineContactDataResponse {
  contact: {
    name?: string;
    phone?: string;
  };
}

enum contactCustomFieldEnum {
  PHONE = "PHONE",
}

interface IWebhookData {
  leads: {
    add?: {
      id: string;
      responsible_user_id: string;
      created_at: string;
    }[];
  };
}

const onDefineRange = (sheetData: IGetSheetResponse) => {
  const nextEmptyRow = sheetData.hasOwnProperty("values")
    ? sheetData.values.length + 1
    : 1;
  return `!A${nextEmptyRow}`;
};

const onDefineContactData = async (
  leadContacts: ContactValue[]
): Promise<IDefineContactDataResponse> => {
  const leadHasContact = leadContacts.length;

  if (!leadHasContact) {
    return {
      contact: {},
    };
  }

  const contactId = leadContacts[0].id;

  const contactDataResponse = await amoService.getContact(contactId);

  const phoneNumberIsFull =
    !!contactDataResponse.custom_fields_values &&
    !!contactDataResponse.custom_fields_values.find(
      (obj) => obj.field_code === contactCustomFieldEnum.PHONE
    );

  return {
    contact: {
      name: contactDataResponse.name,
      ...(phoneNumberIsFull && {
        phone: contactDataResponse.custom_fields_values[0].values[0].value,
      }),
    },
  };
};

const amoWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IWebhookData = req.body;

    const isNoticeOfAddingDeal =
      body.hasOwnProperty("leads") && body.leads.hasOwnProperty("add");

    if (
      isNoticeOfAddingDeal &&
      !recordedLeads.includes(body.leads.add![0].id)
    ) {
      const dealInfo = body.leads.add![0];

      const responsibleUserData = await amoService.getUser(
        dealInfo.responsible_user_id
      );

      const leadData = await amoService.getLead(dealInfo.id);

      // Тут реализована логика обработки только одного контакта (если был добавлен) и одного номера телефона
      const { contact } = await onDefineContactData(
        leadData._embedded.contacts
      );
      //

      const googleAccessToken =
        await googleSheetsService.getGoogleAccessToken();

      const newSheetRecordData = [
        dealInfo.id,
        moment(+dealInfo.created_at * 1000).format("D MMM YYYY, HH:mm"),
        contact.hasOwnProperty("phone") ? contact.phone! : "-",
        contact.hasOwnProperty("name") ? contact.name! : "-",
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

      recordedLeads.push(dealInfo.id);
    }

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

export default amoWebhookController;
