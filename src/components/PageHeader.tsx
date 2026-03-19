import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  back?: boolean;
  action?: ReactNode;
}

export default function PageHeader({ title, back, action }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-nav text-nav-foreground px-4 py-3 flex items-center gap-3">
      {back && (
        <button onClick={() => navigate(-1)} className="touch-target flex items-center justify-center -ml-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="text-lg font-bold flex-1 truncate">{title}</h1>
      {action}
    </header>
  );
}
