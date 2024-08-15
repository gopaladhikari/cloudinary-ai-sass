import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="shadow-2xl">
      <nav className="container mx-auto flex items-center justify-between p-3">
        <strong className="text-2xl">
          <Link href="/"> Cloudinary AI </Link>
        </strong>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 45,
                    height: 45,
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
