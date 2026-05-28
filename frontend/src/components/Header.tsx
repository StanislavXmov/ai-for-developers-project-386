import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          <span className="font-medium text-lg">Calendar</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Button variant="ghost" asChild>
            <Link to="/create">Create meeting</Link>
          </Button>
          <span className="text-border">|</span>
          <Button variant="ghost" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}