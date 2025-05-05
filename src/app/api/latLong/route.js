import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    // Note: The navigator.geolocation API is only available on the client-side
    // This server-side API route can't directly access browser navigator APIs
    // Return a message explaining this limitation
    return NextResponse.json({
      message:
        "Geolocation using navigator API must be implemented client-side",
      info: "Create a client-side utility function to use navigator.geolocation",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
};
