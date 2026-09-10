import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Verifies the auth_token cookie and returns the current user, or null
 * if not authenticated. Centralizes the same logic your /api/auth/me
 * route already uses, so every protected route checks auth the same way.
 */
export async function getAuthUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.userId) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select("_id name email");
  if (!user) return null;

  return { id: user._id.toString(), name: user.name, email: user.email };
}