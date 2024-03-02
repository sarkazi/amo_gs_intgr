import { Response, Request, NextFunction } from "express";

import amoService from "../../services/amo.service";
import { ISheetColumnTitle } from "../../types";

interface IDefineTargetFields {
  leadId: number;
  budget: number;
}

interface IWebhookData extends ISheetColumnTitle {
  row: number;
}

const defineTargetFields = (body: IWebhookData): IDefineTargetFields => {
  return Object.entries(body).reduce(
    (acc: IDefineTargetFields, [key, value]) => {
      if (key.toLocaleLowerCase().includes("номер")) {
        acc["leadId"] = +value;
      }
      if (key.toLocaleLowerCase().includes("бюджет")) {
        acc["budget"] = +value;
      }

      return acc;
    },
    { leadId: 0, budget: 0 }
  );
};

const googleWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IWebhookData = req.body;

    const { leadId, budget } = defineTargetFields(body);

    const payload = {
      price: budget,
    };

    await amoService.updateLead(leadId, payload);

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

export default googleWebhookController;
