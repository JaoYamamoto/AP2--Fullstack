import { Link } from "wouter";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-white">MyAnimeDiary</span>
        </Link>

        <nav className="flex gap-4">
          <Link href="/" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Buscar
          </Link>
          <Link href="/diary" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Assistidos
          </Link>
        </nav>
      </div>
    </header>
  );
}
