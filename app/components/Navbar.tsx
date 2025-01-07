import Link from "next/link";
import ThemeToggler from "./ThemeToggler";

export default function Navbar() {
  return (
    <nav className="p-4 sticky top-0 z-50 bg-background dark:bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-foreground dark:text-foreground text-lg font-bold">
          Weather App
        </Link>
        <div className="flex space-x-4 items-center">          
          <ThemeToggler />
        </div>
      </div>
    </nav>
  );
}