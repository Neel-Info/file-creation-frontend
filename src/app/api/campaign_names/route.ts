import { GET_ALL_CAMPAIGN_NAMES_QUERY } from "@/lib/queries";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const client = await connectToDatabase();
    if (!client) {
      throw new Error("Error connecting to database");
    }

    const result = await client.query(GET_ALL_CAMPAIGN_NAMES_QUERY);

    const data = result.rows.map((row) => row.campaign_name);

    await disconnectFromDatabase(client);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        error: "Internal Server Error",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
