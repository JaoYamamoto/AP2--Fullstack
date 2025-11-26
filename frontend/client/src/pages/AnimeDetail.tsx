import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/Header";
import { ArrowLeft, Star, AlertCircle } from "lucide-react";
import { getAnimeDetail, addToDiary, getOrCreateDefaultUser } from "@/api";

interface Anime {
  mal_id: number;
  title: string;
  image_url?: string;
  score?: number;
  episodes?: number;
  status?: string;
  synopsis?: string;
  aired?: { from?: string };
}

export default function AnimeDetail() {
  const [, params] = useRoute("/anime/:id");
  const [, setLocation] = useLocation();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const id = params?.id ? parseInt(params.id) : 0;

  // Inicializar usuário
  useEffect(() => {
    const initUser = async () => {
      try {
        const uid = await getOrCreateDefaultUser();
        setUserId(uid);
      } catch (err) {
        console.error("Erro ao inicializar usuário:", err);
        setError("Erro ao inicializar usuário");
      }
    };

    initUser();
  }, []);

  // Carregar anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const data = await getAnimeDetail(id);
        setAnime(data);
      } catch (err) {
        console.error("Erro ao carregar anime:", err);
        setError("Erro ao carregar detalhes do anime");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnime();
    }
  }, [id]);

  const handleAddToDiary = async () => {
    if (!anime || userScore === 0 || !userId) {
      setError("Selecione uma nota antes de adicionar");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      await addToDiary(userId, id, userScore, "watching", 0, "");

      setSuccess("Anime adicionado ao diário com sucesso!");

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        setLocation("/diary");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao adicionar ao diário";
      setError(errorMessage);
      console.error("Erro ao adicionar ao diário:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-gray-400">Carregando...</p>
        </main>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-red-400">Anime não encontrado</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => setLocation("/")}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={anime.image_url || '/placeholder.svg'}
              alt={anime.title}
              className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Nota Média</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-2xl font-bold">{anime.score}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Episódios</p>
                <p className="text-2xl font-bold">{anime.episodes || "?"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-lg font-semibold">{anime.status}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Lançamento</p>
                <p className="text-lg font-semibold">
                  {anime.aired?.from
                    ? new Date(anime.aired.from).getFullYear()
                    : "?"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Sinopse</h2>
              <p className="text-gray-400 leading-relaxed">
                {anime.synopsis || "Sem sinopse disponível"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400">{success}</p>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Sua Nota</h2>
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setUserScore(score)}
                      disabled={submitting}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 ${
                        userScore === score
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddToDiary}
                disabled={userScore === 0 || submitting || !userId}
                className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {submitting
                  ? "Adicionando..."
                  : userScore === 0
                    ? "Selecione uma nota"
                    : "Adicionar ao Diário"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
