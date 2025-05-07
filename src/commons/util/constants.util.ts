//require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();

export const B2CConfig = {
  ISSUER: process.env.ISSUER,
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET, //process.env.AZURE_B2C_CLIENT_SECRET,
  USERS_URL: process.env.USERS_URL, //process.env.MICROSOFT_GRAPH_USERS_URL,
  AZURE_B2C_TENNANT: process.env.AZURE_B2C_TENNANT, // process.env.AZURE_B2C_TENNANT,
  AZURE_B2C_ROPC: process.env.AZURE_B2C_ROPC, // process.env.AZURE_B2C_ROPC,
};
