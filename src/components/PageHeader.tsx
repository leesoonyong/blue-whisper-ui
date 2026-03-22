import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-3.5 px-5 pt-2 pb-5">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-xl border-none bg-card card-shadow flex items-center justify-center text-foreground hover:elevated-shadow transition-shadow"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-extrabold text-foreground tracking-tight">{title}</h1>
    </div>
  );
};

export default PageHeader;
