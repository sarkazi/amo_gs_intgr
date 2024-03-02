import axios from "axios";

const googleSheetsApiInstance = axios.create({
  baseURL: "https://sheets.googleapis.com/v4/spreadsheets",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default googleSheetsApiInstance;
