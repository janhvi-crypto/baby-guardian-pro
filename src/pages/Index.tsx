import { Baby, ThermometerSun, Volume2, Footprints, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import ComfortCard from "@/components/monitoring/ComfortCard";
import SoundCard from "@/components/monitoring/SoundCard";
import MotionCard from "@/components/monitoring/MotionCard";
import AirQualityCard from "@/components/monitoring/AirQualityCard";
import ThingSpeakGraphs from "@/components/monitoring/ThingSpeakGraphs";
import Loading from "@/components/Loading";
import BabyNameInput from "@/components/BabyNameInput";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [babyName, setBabyName] = useState(() => {
    return localStorage.getItem("babyName") || "Baby";
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNameChange = (name: string) => {
    setBabyName(name);
    localStorage.setItem("babyName", name);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] p-3 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="bg-primary/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-primary-foreground">
              Smart Baby Monitoring System
            </h1>
          </div>
          <BabyNameInput babyName={babyName} onNameChange={handleNameChange} />
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <ComfortCard babyName={babyName} />
        <SoundCard babyName={babyName} />
        <MotionCard babyName={babyName} />
        <AirQualityCard />
      </div>

      {/* ThingSpeak Real-time Graphs */}
      <ThingSpeakGraphs />
    </div>
  );
};

export default Index;