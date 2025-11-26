import { Card } from "@/components/ui/card";
import { Volume2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import babyCrying from "@/assets/baby-crying.png";
import babyHappy from "@/assets/baby-happy.png";

interface SoundCardProps {
  babyName: string;
}

const SoundCard = ({ babyName }: SoundCardProps) => {
  const [isCrying, setIsCrying] = useState(false);
  const [soundLevel, setSoundLevel] = useState(30);
  const [soundHistory, setSoundHistory] = useState<{ time: string; level: number }[]>([
    { time: "10:00", level: 25 },
    { time: "10:05", level: 30 },
    { time: "10:10", level: 28 },
    { time: "10:15", level: 35 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLevel = 20 + Math.random() * 40;
      setSoundLevel(parseFloat(newLevel.toFixed(1)));
      setIsCrying(newLevel > 50);

      // Update history
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
      setSoundHistory((prev) => [...prev.slice(-9), { time: timeStr, level: parseFloat(newLevel.toFixed(1)) }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-baby-purple/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-foreground">Sound Level History</h3>
        <Volume2 className="w-6 h-6 text-primary" />
      </div>

      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={soundHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
            />
            <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-2xl p-4 ${isCrying ? "bg-destructive/10 border border-destructive/20" : "bg-card/50"}`}>
        <div className="flex items-center gap-3 mb-2">
          <img src={isCrying ? babyCrying : babyHappy} alt={isCrying ? "Baby Crying" : "Baby Happy"} className="w-12 h-12" />
          <div>
            <div className="font-bold text-foreground">{babyName} Cry Detector</div>
            <div className="text-sm text-muted-foreground">{isCrying ? `${babyName} is crying!` : "No crying detected"}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Current: <span className="font-semibold">{soundLevel} dB</span> • CO2: 450ppm • Smoke: 0
        </div>
      </div>

      {soundLevel > 60 && (
        <div className="mt-3 bg-baby-yellow/60 rounded-2xl p-3 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-foreground" />
          <span className="text-sm font-medium text-foreground">Loud noise detected in room</span>
        </div>
      )}
    </Card>
  );
};

export default SoundCard;