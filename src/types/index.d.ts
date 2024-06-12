declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    URL: string;
    SECRET_JWT: string;
  }
}
