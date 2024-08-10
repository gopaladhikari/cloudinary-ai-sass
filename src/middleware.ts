import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);

  const isHomepage = currentUrl.pathname === "/home";

  const isApiRequest = currentUrl.pathname.startsWith("/api");

  //  logged in
  if (userId && isPublicRoute(req) && !isHomepage)
    return NextResponse.redirect(new URL("/home", req.url));

  // not logged in

  if (!userId) {
    // * If user is not logged in, and trying to access a protected route, redirect to sign in page

    if (!isPublicRoute(req) && !isPublicApiRoute(req))
      return NextResponse.redirect(new URL("/sign-in", req.url));

    // * if the request is for protected API route, but user is not logged in, redirect to sign in page

    if (isPublicApiRoute(req) && !isApiRequest)
      return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
