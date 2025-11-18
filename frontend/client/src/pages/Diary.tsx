import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Trash2, Star } from "lucide-react";

interface DiaryEntry {
  id: string;
  mal_id: number;
  title: string;
  imageUrl: string;
  score: number;
  userScore: number;
  episodes: number;
}

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("anime-diary");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("anime-diary", JSON.stringify(updated));
  };

  const updateScore = (id: string, newScore: number) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, userScore: newScore } : e
    );
    setEntries(updated);
    localStorage.setItem("anime-diary", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Animes Assistidos</h1>
          <p className="text-gray-400">
            {entries.length} anime{entries.length !== 1 ? "s" : ""} registrado
            {entries.length !== 1 ? "s" : ""}
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">
              Nenhum anime registrado ainda
            </p>
            <button
              onClick={() => setLocation("/")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Buscar Animes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all relative group"
              >
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 mb-3">
                    {entry.title}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-gray-300">
                          {entry.score.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400">{entry.episodes} ep</span>
                    </div>

                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-xs text-gray-400 mb-2">Sua nota:</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                          <button
                            key={score}
                            onClick={() => updateScore(entry.id, score)}
                            className={`w-6 h-6 rounded text-xs font-semibold transition-all ${
                              entry.userScore === score
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-blue-400 mt-2 font-medium">
                        {entry.userScore}/10
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeEntry(entry.id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
