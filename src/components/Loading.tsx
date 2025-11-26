import { Baby } from "lucide-react";
import babyComfort from "@/assets/baby-comfort.png";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8 animate-bounce">
          <img src={babyComfort} alt="Baby" className="w-32 h-32 mx-auto" />
        </div>
        
        <div className="bg-primary/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="w-8 h-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">
              Smart Baby Monitor
            </h1>
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          
          <p className="text-primary-foreground/80 text-sm">
            Loading sensors...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
