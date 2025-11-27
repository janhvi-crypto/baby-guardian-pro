"use client";

import { Card } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { useState, useEffect } from "react";
import cloudGood from "@/assets/cloud-good.png";
import cloudModerate from "@/assets/cloud-moderate.png";
import cloudUnhealthy from "@/assets/cloud-unhealthy.png";
import { toast } from "@/hooks/use-toast";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const AirQualityCard = () => {
  const [gasValue, setGasValue] = useState(0);
  const [status, setStatus] = useState("Loading...");
  const [score, setScore] = useState(0);
  const [hasAlerted, setHasAlerted] = useState(false);

  const fetchAQ = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const gas = parseInt(data.field1);
      const code = parseInt(data.field2);

      setGasValue(gas);

      // Convert to 0–100 score
      const s = 100 - (gas / 4095) * 100;
      const normalized = Math.max(0, Math.min(100, Math.floor(s)));
      setScore(normalized);

      if (normalized >= 80) {
        setStatus("Good");
        setHasAlerted(false);
      } else if (normalized >= 60) {
        setStatus("Moderate");
        if (!hasAlerted) {
          toast({
            title: "💨 Air Quality Alert",
            description: "Air quality is moderate. Consider ventilation.",
          });
          setHasAlerted(true);
        }
      } else {
        setStatus("Unhealthy");
        if (!hasAlerted) {
          toast({
            title: "⚠️ Air Quality Alert",
            description: "Poor air quality detected! Open windows immediately.",
            variant: "destructive",
          });
          setHasAlerted(true);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchAQ();
    const i = setInterval(fetchAQ, 15000);
    return () => clearInterval(i);
  }, []);

  const cloudImg =
    score >= 80 ? cloudGood : score >= 60 ? cloudModerate : cloudUnhealthy;

  return (
    <Card className="bg-baby-yellow/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold">Air Quality Level</h3>
        <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>

      <div className="flex justify-center mb-3 sm:mb-4">
        <img src={cloudImg} className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold">{status}</h2>
        <p className="text-3xl sm:text-4xl font-bold mt-2">{score}/100</p>
      </div>

      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-center text-muted-foreground">Gas Value: {gasValue}</div>
    </Card>
  );
};

export default AirQualityCard;
