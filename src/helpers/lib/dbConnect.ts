import mongoose, { ConnectOptions } from "mongoose";
import * as Sentry from "@sentry/nextjs";
import { dataBaseUrl } from "./baseUrl";
import { Message } from "@/types/enum";

interface Connection {
  isConnected?: number;
}
const connection: Connection = { isConnected: 0 };

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(dataBaseUrl || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(Message.DATABASE_CONNECTION_ERROR, error);
    Sentry.captureException(error);
    process.exit(1);
  }
}

export default dbConnect;
