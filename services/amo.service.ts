import {
  IGetContactResponse,
  IGetLeadResponse,
  IGetUserResponse,
  IUpdateLeadPayload,
} from "./types";

import amoApiInstance from "../api/amo.instance";

const getUser = async (userId: string): Promise<IGetUserResponse> => {
  const { data } = await amoApiInstance.get(`/users/${userId}`);

  return data;
};

const updateLead = async (
  leadId: number,
  payload: IUpdateLeadPayload
): Promise<any> => {
  const { data } = await amoApiInstance.patch(`/leads/${leadId}`, payload);

  return data;
};

const getLead = async (leadId: string): Promise<IGetLeadResponse> => {
  const { data } = await amoApiInstance.get(`/leads/${leadId}`, {
    params: {
      with: "contacts",
    },
  });

  return data;
};

const getContact = async (contactId: string): Promise<IGetContactResponse> => {
  const { data } = await amoApiInstance.get(`/contacts/${contactId}`, {
    params: {
      with: "custom_fields_values",
    },
  });

  return data;
};

export default { getUser, updateLead, getLead, getContact };
