export interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  score: number;
  episodes: number;
  status: string;
  synopsis: string;
  aired: { from: string };
}

export function searchAnimes(query: string): Promise<Anime[]>;
export function getAnimeDetail(id: number): Promise<Anime>;
