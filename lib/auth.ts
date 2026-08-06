import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    console.log("Decoded:", decoded);

    return decoded;

  } catch (error) {
    console.log("JWT Error:", error);
    return null;
  }
}