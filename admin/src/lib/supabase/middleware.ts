import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminAccess } from "@/lib/admin-auth";

const adminRoute = process.env.NEXT_PUBLIC_ADMIN_ROUTE || "/schoolhub-admin";
type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === `${adminRoute}/login`;
  const isAdminPage = request.nextUrl.pathname.startsWith(adminRoute);

  if (!isAdminPage) return response;

  if (!user && !isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `${adminRoute}/login`;
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(adminRoute, request.url));
  }

  if (user && !isLoginPage) {
    const { allowed } = await getAdminAccess(supabase, user);

    if (!allowed) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL(`${adminRoute}/login?error=unauthorized`, request.url));
    }
  }

  return response;
}
