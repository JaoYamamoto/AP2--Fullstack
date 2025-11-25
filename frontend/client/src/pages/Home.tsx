import { useState } from "react";
import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import { Search, Loader2, BookOpen } from "lucide-react";
import { searchAnimes } from "@/api";

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  score: number;
  episodes: number;
}

//Busca
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    //Chamando API
    try {
      const data = await searchAnimes(searchQuery);
      setResults(data);
    } catch (err) {
      setError("Erro ao buscar animes. Tente novamente.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Buscar Animes</h1>
          <p className="text-gray-400">
            Encontre seus animes favoritos e adicione ao seu diário
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Digite o nome do anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                "Buscar"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center text-red-400 py-8 bg-red-500/10 rounded-lg p-4 border border-red-500/20 mb-8">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="text-gray-400 mb-6 text-sm">
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado
              {results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  id={anime.mal_id}
                  title={anime.title}
                  imageUrl={anime.images.jpg.image_url}
                  score={anime.score || 0}
                  episodes={anime.episodes || 0}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && !error && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum anime encontrado para "<strong>{searchQuery}</strong>"</p>
          </div>
        )}

        {!loading && results.length === 0 && !error && !searchQuery && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">
              Digite o nome de um anime para começar
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
