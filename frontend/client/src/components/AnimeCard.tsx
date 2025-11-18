import { Link } from "wouter";
import { Star } from "lucide-react";

interface AnimeCardProps {
  id: number;
  title: string;
  imageUrl: string;
  score: number;
  episodes: number;
}

export default function AnimeCard({ id, title, imageUrl, score, episodes }: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`}>
      <div className="bg-slate-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border border-slate-800 hover:border-blue-500/50">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white font-semibold line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-gray-300">{score.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">{episodes} ep</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
