import {
  GET_ALL_CAMPAIGN_NAMES_QUERY,
  GET_CAMPAIGN_DETAILS_QUERY,
} from "@/lib/queries";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;

    if (!name) {
      return NextResponse.json({
        status: "error",
        error: "Name parameter is required",
      });
    }

    const client = await connectToDatabase();
    if (!client) {
      throw new Error("Error connecting to database");
    }

    const result = await client.query(GET_CAMPAIGN_DETAILS_QUERY, [name]);
    const data = result.rows;

    await disconnectFromDatabase(client);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      error: "Internal Server Error",
      stack: error,
      message: error.message,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const body = await request.json();
    const { name } = params;

    if (!name) {
      return NextResponse.json({
        status: "error",
        error: "Name parameter is required",
      });
    }

    let filters = "";

    const mainQuery = GET_CAMPAIGN_DETAILS_QUERY;

    // delete all entries in body whose value.length == 0
    for (const key in body) {
      if (body[key].length == 0) {
        delete body[key];
      }
    }

    // create where clase for filters by iterating Object.enteries
    // and appending to filters string
    if (body) {
      filters = Object.entries(body)
        .map(([key, value]) => {
          // @ts-ignore
          if (value.length != 0) {
            // @ts-ignore
            return `${key} in ('${value
              .map((item: any) => item.value)
              .join("','")}')`;
          }
          return null;
        })
        .join(" AND ");
    }

    let completeQuery = `${mainQuery}`;
    if (filters.length > 0) {
      completeQuery = `${mainQuery} and ${filters}`;
    }

    const client = await connectToDatabase();
    if (!client) {
      throw new Error("Error connecting to database");
    }

    const result = await client.query(completeQuery, [name]);

    const data = result.rows;

    await disconnectFromDatabase(client);

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
