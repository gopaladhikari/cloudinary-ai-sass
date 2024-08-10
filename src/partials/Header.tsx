import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  return (
    <header className="shadow-xl dark:bg-gray-950 dark:shadow-none">
      <nav className="container mx-auto flex items-center justify-between p-3">
        <strong className="text-2xl">Cloudinary AI</strong>
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
