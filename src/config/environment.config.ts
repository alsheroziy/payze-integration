import "dotenv/config"
import * as process from "node:process";

export const environments = {
	PORT: Number(process.env.PORT) || 3001,
	MONGO_URI: process.env.MONGO_URI as string,
	TOKEN_SECRET: process.env.TOKEN_SECRET as string,
	PAYZE_API_KEY: process.env.PAYZE_API_KEY as string,
	PAYZE_API_SECRET: process.env.PAYZE_API_SECRET as string,
	APP_URL: process.env.APP_URL || 'http://localhost:3001',
}