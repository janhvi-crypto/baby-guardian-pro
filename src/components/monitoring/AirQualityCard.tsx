"use client";

import { Card } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { useState, useEffect } from "react";
import cloudGood from "@/assets/cloud-good.png";
import cloudModerate from "@/assets/cloud-moderate.png";
import cloudUnhealthy from "@/assets/cloud-unhealthy.png";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const AirQualityCard = () => {
  const [gasValue, setGasValue] = useState(0);
  const [status, setStatus] = useState("Loading...");
  const [score, setScore] = useState(0);

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

      if (normalized >= 80) setStatus("Good");
      else if (normalized >= 60) setStatus("Moderate");
      else setStatus("Unhealthy");
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
    <Card className="bg-baby-yellow/50 p-6 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Air Quality Level</h3>
        <Wind className="w-6 h-6 text-primary" />
      </div>

      <div className="flex justify-center mb-4">
        <img src={cloudImg} className="w-24 h-24" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold">{status}</h2>
        <p className="text-4xl font-bold mt-2">{score}/100</p>
      </div>

      <div className="mt-4 text-sm text-center">Gas Value: {gasValue}</div>
    </Card>
  );
};

export default AirQualityCard;
