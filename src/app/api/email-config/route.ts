import { EMAIL_ENABLED } from "@/lib/utils";

export async function GET() {
  return Response.json({ EMAIL_ENABLED });
}
