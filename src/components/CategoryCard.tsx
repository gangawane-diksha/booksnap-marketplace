import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function CategoryCard({ id, name, icon, count }: CategoryCardProps) {
  return (
    <Link
      to={`/browse?category=${id}`}
      className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border shadow-booksnap-sm card-hover text-center"
    >
      <span className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-wiggle">
        {icon}
      </span>
      <h3 className="font-serif font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{count.toLocaleString()} books</p>
    </Link>
  );
}
