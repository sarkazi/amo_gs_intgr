import jwt from "jsonwebtoken";
import axios from "axios";
import googleInstance from "../api/google-sheet.instance";
import { IGetSheetResponse, IGoogleAuthorizeResponse } from "./types";

const getSheetData = async (
  accessToken: string
): Promise<IGetSheetResponse> => {
  const { data } = await googleInstance.get(
    `/${process.env.GOOGLE_SHEET_ID}/values/${process.env.GOOGLE_SHEET_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

const updateSheetData = async (
  payload: [string[]],
  accessToken: string,
  range: string
): Promise<{ data: any }> => {
  return await googleInstance.put(
    `/${process.env.GOOGLE_SHEET_ID}/values/${process.env.GOOGLE_SHEET_NAME}${range}`,
    { values: payload },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        valueInputOption: "RAW",
      },
    }
  );
};

const getGoogleAccessToken = async (): Promise<string> => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env
    .GOOGLE_PRIVATE_KEY!!.split(String.raw`\n`)
    .join("\n");

  const scope = "https://www.googleapis.com/auth/spreadsheets";
  const getTokenUrl = "https://www.googleapis.com/oauth2/v4/token";
  const grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

  const payload = {
    iss: clientEmail,
    scope,
    aud: getTokenUrl,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  const { data: authorizeResponse }: IGoogleAuthorizeResponse =
    await axios.post(
      getTokenUrl,
      {
        grant_type: grantType,
        assertion: jwtToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "google-api-nodejs-client/8.9.0",
          "x-goog-api-client": "gl-node/16.14.0",
          Accept: "application/json",
        },
        responseType: "json",
      }
    );

  return authorizeResponse.access_token;
};

export default { getSheetData, updateSheetData, getGoogleAccessToken };
