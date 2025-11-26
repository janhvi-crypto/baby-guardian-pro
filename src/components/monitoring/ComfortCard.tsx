import { Card } from "@/components/ui/card";
import { ThermometerSun } from "lucide-react";
import { useState, useEffect } from "react";

const ComfortCard = () => {
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(55);
  const [status, setStatus] = useState("Comfortable");

  useEffect(() => {
    // Simulate sensor data updates
    const interval = setInterval(() => {
      const temp = 22 + Math.random() * 6;
      const hum = 45 + Math.random() * 20;
      setTemperature(parseFloat(temp.toFixed(1)));
      setHumidity(parseFloat(hum.toFixed(1)));

      // Determine comfort status
      if (temp < 20) setStatus("Cold ❄️");
      else if (temp > 26) setStatus("Warm 🔥");
      else if (hum > 70) setStatus("Too Humid 💧");
      else if (hum < 40) setStatus("Too Dry 🏜️");
      else setStatus("Comfortable 😊");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-baby-blue/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-foreground">Room Comfort Index</h3>
        <ThermometerSun className="w-6 h-6 text-primary" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="text-6xl">👶</div>
        <div>
          <div className="text-2xl font-bold text-foreground">{status}</div>
          <div className="text-sm text-muted-foreground">Baby Lily</div>
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
            <span>⚠️</span>
            <span>Heat Wave Alert! Room is overheating</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ComfortCard;