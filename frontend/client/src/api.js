// Centralizando chamadas da API
// Para desenvolvimento, use http://localhost:5000/api
// Para produção, ajuste conforme necessário
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ID do usuário padrão (será criado automaticamente)
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || 1;

// ==================== ANIMES ====================

/**
 * Buscar animes pela Jikan API através do backend
 * @param {string} query - Termo de busca
 * @returns {Promise<Array>} Lista de animes
 */
export async function searchAnimes(query) {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${API_BASE}/animes/search?q=${encodeURIComponent(query)}&limit=12`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar animes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.animes || [];
  } catch (error) {
    console.error("Erro na busca de animes:", error);
    throw error;
  }
}

/**
 * Obter detalhes de um anime
 * @param {number} id - ID do anime
 * @returns {Promise<Object>} Detalhes do anime
 */
export async function getAnimeDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/animes/${id}`);

    if (!response.ok) {
      throw new Error("Anime não encontrado");
    }

    const data = await response.json();
    return data.anime;
  } catch (error) {
    console.error("Erro ao buscar detalhes do anime:", error);
    throw error;
  }
}

// ==================== USUÁRIOS ====================

/**
 * Registrar novo usuário
 * @param {string} username - Nome de usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário criado
 */
export async function registerUser(username, email, password) {
  try {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao registrar usuário");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
}

/**
 * Obter informações do usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export async function getUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`);

    if (!response.ok) {
      throw new Error("Usuário não encontrado");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

/**
 * Obter ou criar usuário padrão
 * @returns {Promise<number>} ID do usuário
 */
export async function getOrCreateDefaultUser() {
  try {
    // Tentar obter usuário padrão
    const user = await getUser(DEFAULT_USER_ID);
    return user.id;
  } catch (error) {
    // Se não existir, criar um novo
    try {
      const newUser = await registerUser(
        "default_user",
        "default@animediary.local",
        "default_password_123"
      );
      return newUser.id;
    } catch (registerError) {
      console.error("Erro ao criar usuário padrão:", registerError);
      // Retornar ID padrão mesmo se falhar
      return DEFAULT_USER_ID;
    }
  }
}

// ==================== DIÁRIO ====================

/**
 * Adicionar anime ao diário
 * @param {number} userId - ID do usuário
 * @param {number} animeId - ID do anime
 * @param {number} userScore - Nota pessoal (1-10)
 * @param {string} status - Status (watching, completed, planned, dropped)
 * @param {number} episodesWatched - Episódios assistidos
 * @param {string} notes - Notas pessoais
 * @returns {Promise<Object>} Entrada criada
 */
export async function addToDiary(
  userId,
  animeId,
  userScore,
  status = "watching",
  episodesWatched = 0,
  notes = ""
) {
  try {
    const response = await fetch(`${API_BASE}/diary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        anime_id: animeId,
        user_score: userScore,
        status: status,
        episodes_watched: episodesWatched,
        notes: notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao adicionar ao diário");
    }

    const data = await response.json();
    return data.entry;
  } catch (error) {
    console.error("Erro ao adicionar ao diário:", error);
    throw error;
  }
}

/**
 * Obter diário do usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array>} Lista de entradas do diário
 */
export async function getDiary(userId) {
  try {
    const response = await fetch(`${API_BASE}/diary/user/${userId}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar diário");
    }

    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error("Erro ao buscar diário:", error);
    throw error;
  }
}

/**
 * Obter uma entrada específica do diário
 * @param {number} entryId - ID da entrada
 * @returns {Promise<Object>} Dados da entrada
 */
export async function getDiaryEntry(entryId) {
  try {
    const response = await fetch(`${API_BASE}/diary/${entryId}`);

    if (!response.ok) {
      throw new Error("Entrada não encontrada");
    }

    const data = await response.json();
    return data.entry;
  } catch (error) {
    console.error("Erro ao buscar entrada:", error);
    throw error;
  }
}

/**
 * Atualizar entrada do diário
 * @param {number} entryId - ID da entrada
 * @param {number} userScore - Nota pessoal
 * @param {string} status - Status
 * @param {number} episodesWatched - Episódios assistidos
 * @param {string} notes - Notas pessoais
 * @returns {Promise<Object>} Entrada atualizada
 */
export async function updateDiaryEntry(
  entryId,
  userScore,
  status,
  episodesWatched = 0,
  notes = ""
) {
  try {
    const response = await fetch(`${API_BASE}/diary/${entryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_score: userScore,
        status: status,
        episodes_watched: episodesWatched,
        notes: notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar entrada");
    }

    const data = await response.json();
    return data.entry;
  } catch (error) {
    console.error("Erro ao atualizar entrada:", error);
    throw error;
  }
}

/**
 * Remover anime do diário
 * @param {number} entryId - ID da entrada
 * @returns {Promise<boolean>} True se removido com sucesso
 */
export async function removeDiaryEntry(entryId) {
  try {
    const response = await fetch(`${API_BASE}/diary/${entryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao remover entrada");
    }

    return true;
  } catch (error) {
    console.error("Erro ao remover entrada:", error);
    throw error;
  }
}

/**
 * Obter estatísticas do diário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>} Estatísticas do diário
 */
export async function getDiaryStats(userId) {
  try {
    const response = await fetch(`${API_BASE}/diary/stats/user/${userId}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas");
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    throw error;
  }
}
