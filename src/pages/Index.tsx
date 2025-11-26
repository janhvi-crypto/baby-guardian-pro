import { Baby, ThermometerSun, Volume2, Footprints, Wind } from "lucide-react";
import ComfortCard from "@/components/monitoring/ComfortCard";
import SoundCard from "@/components/monitoring/SoundCard";
import MotionCard from "@/components/monitoring/MotionCard";
import AirQualityCard from "@/components/monitoring/AirQualityCard";
import ThingSpeakGraphs from "@/components/monitoring/ThingSpeakGraphs";

const Index = () => {
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

      {/* Connection Info Card */}
      <div className="mt-8 bg-baby-blue/50 backdrop-blur-sm rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          ThingSpeak Connection Guide
        </h2>
        <div className="space-y-3 text-sm text-foreground/80">
          <div>
            <strong>Step 1:</strong> Create a ThingSpeak channel with fields for:
            <ul className="ml-6 mt-2 space-y-1">
              <li>• Field 1: Temperature (°C)</li>
              <li>• Field 2: Humidity (%)</li>
              <li>• Field 3: Sound Level (dB)</li>
              <li>• Field 4: Motion (0/1)</li>
              <li>• Field 5: Gas PPM</li>
            </ul>
          </div>
          <div>
            <strong>Step 2:</strong> In your ESP32 code, use the ThingSpeak library to send data:
            <pre className="bg-card/50 p-3 rounded-lg mt-2 overflow-x-auto">
{`ThingSpeak.setField(1, temperature);
ThingSpeak.setField(2, humidity);
ThingSpeak.setField(3, soundLevel);
ThingSpeak.setField(4, motionDetected);
ThingSpeak.setField(5, gasPPM);
ThingSpeak.writeFields(channelID, apiKey);`}
            </pre>
          </div>
          <div>
            <strong>Step 3:</strong> Update the channel ID and Read API Key in the ThingSpeakGraphs component to fetch real-time data from your channel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;