"use client";

import { Card } from "@/components/ui/card";
import { ThermometerSun } from "lucide-react";
import { useState, useEffect } from "react";
import babyComfort from "@/assets/baby-comfort.png";
import { toast } from "@/hooks/use-toast";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const ComfortCard = ({ babyName }: { babyName: string }) => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [status, setStatus] = useState("Loading...");
  const [hasAlerted, setHasAlerted] = useState(false);

  const fetchComfort = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const temp = parseFloat(data.field5);
      const hum = parseFloat(data.field6);

      setTemperature(temp);
      setHumidity(hum);

      if (temp < 20) {
        setStatus("Cold ❄️");
        if (!hasAlerted) {
          toast({
            title: "❄️ Temperature Alert",
            description: "Room is too cold for baby",
          });
          setHasAlerted(true);
        }
      } else if (temp > 27) {
        setStatus("Warm 🔥");
        if (!hasAlerted) {
          toast({
            title: "🔥 Temperature Alert",
            description: "Room is overheating!",
            variant: "destructive",
          });
          setHasAlerted(true);
        }
      } else if (hum > 70) {
        setStatus("Too Humid 💧");
        if (!hasAlerted) {
          toast({
            title: "💧 Humidity Alert",
            description: "Room is too humid",
          });
          setHasAlerted(true);
        }
      } else if (hum < 40) {
        setStatus("Too Dry 🏜️");
        if (!hasAlerted) {
          toast({
            title: "🏜️ Humidity Alert",
            description: "Air is too dry",
          });
          setHasAlerted(true);
        }
      } else {
        setStatus("Comfortable 😊");
        setHasAlerted(false);
      }
    } catch {}
  };

  useEffect(() => {
    fetchComfort();
    const i = setInterval(fetchComfort, 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <Card className="bg-baby-blue/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold">Room Comfort Index</h3>
        <ThermometerSun className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>

      <div className="flex gap-3 sm:gap-4 items-center">
        <img src={babyComfort} className="w-16 h-16 sm:w-20 sm:h-20" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{status}</h2>
          <p className="text-xs sm:text-sm">{babyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-3 sm:mt-4 gap-3 sm:gap-4">
        <div className="bg-card/50 p-2 sm:p-3 rounded-xl">
          <p className="text-xs">Temperature</p>
          <p className="text-lg sm:text-xl font-bold">{temperature} °C</p>
        </div>
        <div className="bg-card/50 p-2 sm:p-3 rounded-xl">
          <p className="text-xs">Humidity</p>
          <p className="text-lg sm:text-xl font-bold">{humidity}%</p>
        </div>
      </div>

      {temperature > 30 && (
        <div className="mt-3 sm:mt-4 bg-red-200/50 p-2 sm:p-3 rounded-xl text-red-600 text-sm">
          ⚠️ High Temperature Alert!
        </div>
      )}
    </Card>
  );
};

export default ComfortCard;
