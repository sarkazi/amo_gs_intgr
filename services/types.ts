interface IUpdateLeadPayload {
  price: number;
}

type CustomFieldValue = {
  field_code: string;
  values: { value: string }[];
};

type ContactValue = {
  id: string;
};

interface IGetContactResponse {
  custom_fields_values: CustomFieldValue[];
  name: string;
}
interface IGetLeadResponse {
  _embedded: { contacts: ContactValue[] };
  name: string;
  id: string;
}
interface IGetUserResponse {
  name: string;
  id: string;
}

interface IGetSheetResponse {
  values: string[];
}
interface IGoogleAuthorizeResponse {
  data: {
    access_token: string;
  };
}

export {
  IUpdateLeadPayload,
  IGetContactResponse,
  IGetLeadResponse,
  ContactValue,
  IGetUserResponse,
  IGetSheetResponse,
  IGoogleAuthorizeResponse,
};
