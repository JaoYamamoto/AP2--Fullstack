const API_BASE = "https://api.jikan.moe/v4";

export async function searchAnimes(query) {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${API_BASE}/anime?q=${encodeURIComponent(query)}&limit=12`
    );

    if (!response.ok) throw new Error("Erro ao buscar animes");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erro na busca:", error);
    throw error;
  }
}

export async function getAnimeDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/anime/${id}`);

    if (!response.ok) throw new Error("Anime não encontrado");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    throw error;
  }
}
