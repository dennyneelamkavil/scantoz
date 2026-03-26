import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export function handleApiError(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
