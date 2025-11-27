"use client";

import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import babyCrying from "@/assets/baby-crying.png";
import babyHappy from "@/assets/baby-happy.png";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const SoundCard = ({ babyName }: { babyName: string }) => {
  const [soundLevel, setSoundLevel] = useState(0);
  const [isCrying, setIsCrying] = useState(false);
  const [soundHistory, setSoundHistory] = useState<any[]>([]);

  const fetchSound = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const sound = parseInt(data.field3);
      const cry = parseInt(data.field4);

      setSoundLevel(sound);
      setIsCrying(cry === 1);

      const now = new Date().toLocaleTimeString();

      setSoundHistory((prev) => [...prev.slice(-9), { time: now, level: sound }]);
    } catch {}
  };

  useEffect(() => {
    fetchSound();
    const i = setInterval(fetchSound, 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <Card className="bg-baby-purple/50 p-6 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Sound Level History</h3>
        <Volume2 className="w-6 h-6 text-primary" />
      </div>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={soundHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="level" stroke="#8a4fff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className={`mt-4 p-4 rounded-xl ${
          isCrying ? "bg-red-200/50 border border-red-400" : "bg-card/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={isCrying ? babyCrying : babyHappy}
            className="w-12 h-12"
          />
          <div>
            <h4 className="font-bold">{babyName} Cry Detector</h4>
            <p className="text-sm">
              {isCrying ? "Baby is Crying 😢" : "No crying detected 😊"}
            </p>
          </div>
        </div>

        <div className="text-xs mt-2 text-muted-foreground">
          Sound: {soundLevel}
        </div>
      </div>
    </Card>
  );
};

export default SoundCard;
