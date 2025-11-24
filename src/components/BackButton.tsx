import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton = ({ to, className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className={`rounded-full w-12 h-12 hover:scale-110 transition-transform ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
