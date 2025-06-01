import mongoose, { ConnectOptions } from "mongoose";
import * as Sentry from "@sentry/nextjs";
import { dataBaseUrl } from "./baseUrl";
import { Message } from "@/types/enum";

interface Connection {
  isConnected?: number;
}

const connection: Connection = { isConnected: 0 };

async function dbConnect(): Promise<void> {
  // If we're already connected, return
  if (connection.isConnected === 1) {
    return;
  }

  // If we're in the process of connecting, wait
  if (connection.isConnected === 2) {
    return;
  }

  try {
    // Set connecting state
    connection.isConnected = 2;

    // If there's an existing connection, disconnect it first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const db = await mongoose.connect(dataBaseUrl || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(Message.DATABASE_CONNECTION_ERROR, error);
    Sentry.captureException(error);
    // Reset connection state on error
    connection.isConnected = 0;
    throw error;
  }
}

export default dbConnect;
