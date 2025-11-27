import { Card } from "@/components/ui/card";
import { ThermometerSun } from "lucide-react";
import { useState, useEffect } from "react";
import babyComfort from "@/assets/baby-comfort.png";

interface ComfortCardProps {
  babyName: string;
}

// ThingSpeak details
const CHANNEL_ID = "3181835";
const READ_API_KEY = "RKLNYQG9K92996XH";

// Get latest entry from ThingSpeak
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

const ComfortCard = ({ babyName }: ComfortCardProps) => {
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(55);
  const [status, setStatus] = useState<string>("Comfortable 😊");

  // Determine comfort status based on real data
  const updateComfortStatus = (temp: number, hum: number) => {
    if (temp < 20) return "Cold ❄️";
    if (temp > 27) return "Warm 🔥";
    if (hum > 70) return "Too Humid 💧";
    if (hum < 40) return "Too Dry 🏜️";
    return "Comfortable 😊";
  };

  const fetchThingSpeakComfort = async () => {
    try {
      const response = await fetch(THINGSPEAK_URL);
      if (!response.ok) throw new Error("Failed to fetch ThingSpeak data");

      const data = await response.json();

      // field1 = temperature, field2 = humidity
      const temp = parseFloat(data.field1);
      const hum = parseFloat(data.field2);

      if (!isNaN(temp)) setTemperature(temp);
      if (!isNaN(hum)) setHumidity(hum);

      setStatus(updateComfortStatus(temp, hum));
    } catch (error) {
      console.error("ComfortCard Fetch Error:", error);
    }
  };

  // Run every 15 sec
  useEffect(() => {
    fetchThingSpeakComfort();
    const interval = setInterval(fetchThingSpeakComfort, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-baby-blue/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-foreground">Room Comfort Index</h3>
        <ThermometerSun className="w-6 h-6 text-primary" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img src={babyComfort} alt="Baby" className="w-20 h-20" />
        <div>
          <div className="text-2xl font-bold text-foreground">{status}</div>
          <div className="text-sm text-muted-foreground">{babyName}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-2xl p-3">
          <div className="text-xs text-muted-foreground mb-1">Temperature</div>
          <div className="text-2xl font-bold text-foreground">{temperature}°C</div>
        </div>
        <div className="bg-card/50 rounded-2xl p-3">
          <div className="text-xs text-muted-foreground mb-1">Humidity</div>
          <div className="text-2xl font-bold text-foreground">{humidity}%</div>
        </div>
      </div>

      {temperature > 27 && (
        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <ThermometerSun className="w-5 h-5" />
            <span>Heat Wave Alert! Room is overheating</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ComfortCard;
