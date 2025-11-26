import { Baby, ThermometerSun, Volume2, Footprints, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import ComfortCard from "@/components/monitoring/ComfortCard";
import SoundCard from "@/components/monitoring/SoundCard";
import MotionCard from "@/components/monitoring/MotionCard";
import AirQualityCard from "@/components/monitoring/AirQualityCard";
import ThingSpeakGraphs from "@/components/monitoring/ThingSpeakGraphs";
import Loading from "@/components/Loading";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] p-4 md:p-8">
      {/* Header */}
      <header className="bg-primary/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3">
          <Baby className="w-10 h-10 text-primary-foreground" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Smart Baby Monitoring System
          </h1>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ComfortCard />
        <SoundCard />
        <MotionCard />
        <AirQualityCard />
      </div>

      {/* ThingSpeak Real-time Graphs */}
      <ThingSpeakGraphs />
    </div>
  );
};

export default Index;