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
import { toast } from "@/hooks/use-toast";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const SoundCard = ({ babyName }: { babyName: string }) => {
  const [soundLevel, setSoundLevel] = useState(0);
  const [isCrying, setIsCrying] = useState(false);
  const [soundHistory, setSoundHistory] = useState<any[]>([]);
  const [hasAlerted, setHasAlerted] = useState(false);

  const fetchSound = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const sound = parseInt(data.field3);
      const cry = parseInt(data.field4);

      setSoundLevel(sound);
      const wasCrying = cry === 1;
      setIsCrying(wasCrying);

      if (wasCrying && !hasAlerted) {
        toast({
          title: "👶 Baby Alert",
          description: `${babyName} is crying!`,
          variant: "destructive",
        });
        setHasAlerted(true);
      } else if (!wasCrying) {
        setHasAlerted(false);
      }

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
    <Card className="bg-baby-purple/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold">Sound Level History</h3>
        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>

      <div className="h-28 sm:h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={soundHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="level" stroke="#8a4fff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl ${
          isCrying ? "bg-red-200/50 border border-red-400" : "bg-card/50"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={isCrying ? babyCrying : babyHappy}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <div>
            <h4 className="text-sm sm:text-base font-bold">{babyName} Cry Detector</h4>
            <p className="text-xs sm:text-sm">
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
