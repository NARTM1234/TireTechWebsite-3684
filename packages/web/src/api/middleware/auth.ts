import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { auth, ADMIN_EMAILS } from "../auth";
export const adminProcedure = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session || !ADMIN_EMAILS.includes(session.user.email.toLowerCase()))
    throw new ORPCError("UNAUTHORIZED");
  return next({ context: { user: session.user } });
});
