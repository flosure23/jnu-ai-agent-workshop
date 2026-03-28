import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** 로그인 상태면 일기 목록으로 보낼 경로 (비밀번호 재설정 등은 제외) */
const REDIRECT_IF_AUTHENTICATED = ["/login", "/signup"];

function shouldRedirectAuthenticatedAway(pathname: string): boolean {
  return REDIRECT_IF_AUTHENTICATED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/entries");
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth/")) {
    return supabaseResponse;
  }

  if (isProtectedPath(pathname) && !user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (shouldRedirectAuthenticatedAway(pathname) && user) {
    return NextResponse.redirect(new URL("/entries", request.url));
  }

  if (pathname === "/" && user) {
    return NextResponse.redirect(new URL("/entries", request.url));
  }

  if (pathname === "/" && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
