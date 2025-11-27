"use client";

import { Card } from "@/components/ui/card";
import { ThermometerSun } from "lucide-react";
import { useState, useEffect } from "react";
import babyComfort from "@/assets/baby-comfort.png";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const ComfortCard = ({ babyName }: { babyName: string }) => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [status, setStatus] = useState("Loading...");

  const fetchComfort = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const temp = parseFloat(data.field5);
      const hum = parseFloat(data.field6);

      setTemperature(temp);
      setHumidity(hum);

      if (temp < 20) setStatus("Cold ❄️");
      else if (temp > 27) setStatus("Warm 🔥");
      else if (hum > 70) setStatus("Too Humid 💧");
      else if (hum < 40) setStatus("Too Dry 🏜️");
      else setStatus("Comfortable 😊");
    } catch {}
  };

  useEffect(() => {
    fetchComfort();
    const i = setInterval(fetchComfort, 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <Card className="bg-baby-blue/50 p-6 rounded-3xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">Room Comfort Index</h3>
        <ThermometerSun className="w-6 h-6 text-primary" />
      </div>

      <div className="flex gap-4 items-center">
        <img src={babyComfort} className="w-20 h-20" />
        <div>
          <h2 className="text-2xl font-bold">{status}</h2>
          <p className="text-sm">{babyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-4 gap-4">
        <div className="bg-card/50 p-3 rounded-xl">
          <p className="text-xs">Temperature</p>
          <p className="text-xl font-bold">{temperature} °C</p>
        </div>
        <div className="bg-card/50 p-3 rounded-xl">
          <p className="text-xs">Humidity</p>
          <p className="text-xl font-bold">{humidity}%</p>
        </div>
      </div>

      {temperature > 30 && (
        <div className="mt-4 bg-red-200/50 p-3 rounded-xl text-red-600">
          ⚠️ High Temperature Alert!
        </div>
      )}
    </Card>
  );
};

export default ComfortCard;
