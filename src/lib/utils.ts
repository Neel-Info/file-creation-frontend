import { Client } from "pg";

const pgConfig = {
  user: "postgres",
  host: "192.168.1.189",
  database: "dev_voice",
  password: "Password123*",
  port: 5432,
};

export async function connectToDatabase(): Promise<Client | null> {
  try {
    const client = new Client(pgConfig);
    await client.connect();

    console.log("Connected to PostgreSQL");

    return client;
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    return null;
  }
}

export async function disconnectFromDatabase(client: Client) {
  try {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  } catch (error) {
    console.error("Error disconnecting from PostgreSQL:", error);
  }
}
