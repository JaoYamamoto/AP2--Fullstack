import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Trash2, Star, AlertCircle, Loader2 } from "lucide-react";
import {
  getDiary,
  removeDiaryEntry,
  updateDiaryEntry,
  getOrCreateDefaultUser,
} from "@/api";

interface DiaryEntry {
  id: number;
  user_id: number;
  anime_id: number;
  user_score: number;
  status: string;
  episodes_watched: number;
  notes: string;
  created_at: string;
  updated_at: string;
  // Dados do anime (se retornados pela API)
  anime?: {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    score: number;
    episodes: number;
  };
}

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Inicializar usuário e carregar diário
  useEffect(() => {
    const initAndLoad = async () => {
      try {
        setLoading(true);
        const uid = await getOrCreateDefaultUser();
        setUserId(uid);

        const diaryEntries = await getDiary(uid);
        setEntries(diaryEntries);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar diário";
        setError(errorMessage);
        console.error("Erro ao carregar diário:", err);
      } finally {
        setLoading(false);
      }
    };

    initAndLoad();
  }, []);

  const removeEntry = async (entryId: number) => {
    try {
      setDeletingId(entryId);
      await removeDiaryEntry(entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao remover anime";
      setError(errorMessage);
      console.error("Erro ao remover:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const updateScore = async (entryId: number, newScore: number) => {
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    try {
      setUpdatingId(entryId);
      await updateDiaryEntry(
        entryId,
        newScore,
        entry.status,
        entry.episodes_watched,
        entry.notes
      );

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, user_score: newScore } : e
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar nota";
      setError(errorMessage);
      console.error("Erro ao atualizar:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="ml-3 text-gray-400">Carregando diário...</p>
          </div>
        </main>
      </div>
    );
  }

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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">Nenhum anime registrado ainda</p>
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
                {entry.anime && (
                  <img
                    src={entry.anime.image_url || '/placeholder.svg'}
                    alt={entry.anime.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 mb-3">
                    {entry.anime?.title || `Anime #${entry.anime_id}`}
                  </h3>

                  <div className="space-y-3">
                    {entry.anime && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-gray-300">
                            {entry.anime.score.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {entry.anime.episodes || "?"} ep
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-xs text-gray-400 mb-2">Sua nota:</p>
                      <div className="flex gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                          <button
                            key={score}
                            onClick={() => updateScore(entry.id, score)}
                            disabled={updatingId === entry.id}
                            className={`w-6 h-6 rounded text-xs font-semibold transition-all disabled:opacity-50 ${
                              entry.user_score === score
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-blue-400 mt-2 font-medium">
                        {entry.user_score}/10
                      </p>
                    </div>

                    {entry.status && (
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-xs text-gray-400">Status:</p>
                        <p className="text-sm text-gray-300 capitalize">
                          {entry.status === "watching"
                            ? "Assistindo"
                            : entry.status === "completed"
                              ? "Completado"
                              : entry.status === "planned"
                                ? "Planejado"
                                : "Abandonado"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeEntry(entry.id)}
                  disabled={deletingId === entry.id}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deletingId === entry.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
