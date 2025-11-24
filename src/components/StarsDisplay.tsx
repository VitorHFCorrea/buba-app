interface StarsDisplayProps {
  stars: number;
  className?: string;
}

const StarsDisplay = ({ stars, className = "" }: StarsDisplayProps) => {
  return (
    <div className={`flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 ${className}`}>
      <span className="text-2xl">✨</span>
      <span className="text-2xl font-bold">{stars}</span>
    </div>
  );
};

export default StarsDisplay;
