import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase isn't configured yet (env vars missing in this deployment).
  // Fail open on public routes instead of crashing every page; only block
  // access to protected routes, since we can't verify a session at all.
  if (!supabaseUrl || !supabaseAnonKey) {
    const isProtected = PROTECTED_PREFIXES.some((p) =>
      request.nextUrl.pathname.startsWith(p)
    );
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set(
        "error",
        "Authentication isn't configured yet. Add Supabase environment variables in Vercel."
      );
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Onboarding gate: new clients must complete the wizard before reaching
  // the rest of the dashboard. Skipped for the onboarding page itself and
  // for the admin/coach section (coaches don't go through client onboarding).
  const path = request.nextUrl.pathname;
  const needsOnboardingCheck =
    isProtected &&
    user &&
    path.startsWith("/dashboard") &&
    path !== "/dashboard/onboarding" &&
    !path.startsWith("/dashboard/admin");

  if (needsOnboardingCheck) {
    try {
      const { data } = await supabase
        .from("onboarding_responses")
        .select("completed_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data?.completed_at) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/onboarding";
        return NextResponse.redirect(url);
      }
    } catch {
      // Table might not exist yet if the migration hasn't been run —
      // fail open rather than blocking the whole dashboard.
    }
  }

  return response;
}
