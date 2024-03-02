declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      GOOGLE_SHEET_ID?: string;
      GOOGLE_SHEET_NAME: string;
      GOOGLE_CLIENT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
      AMO_TOKEN: string;
    }
  }
}

export {};
