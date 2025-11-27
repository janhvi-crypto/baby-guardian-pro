import { Card } from "@/components/ui/card";
import { Wind, CloudRain } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import cloudGood from "@/assets/cloud-good.png";
import cloudModerate from "@/assets/cloud-moderate.png";
import cloudUnhealthy from "@/assets/cloud-unhealthy.png";

// 🟢 REPLACE THESE WITH YOUR REAL VALUES
const CHANNEL_ID = "3181835";      
const READ_API_KEY = "RKLNYQG9K92996XH";

// ThingSpeak endpoint (gets last entry)
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/3181835/feeds/last.json?api_key=RKLNYQG9K92996XH`;

const AirQualityCard = () => {
  const [airQuality, setAirQuality] = useState<number>(92);
  const [status, setStatus] = useState<string>("Good");
  const [needsVentilation, setNeedsVentilation] = useState<boolean>(false);

  const [gasReading, setGasReading] = useState<number>(0);

  // Dummy breakdown values based on gas reading
  const qualityData = [
    { name: "CO2", value: Math.floor(gasReading * 0.10) },
    { name: "NH3", value: Math.floor(gasReading * 0.02) },
    { name: "Smoke", value: Math.floor(gasReading * 0.01) },
  ];

  // 🔥 Convert MQ135 reading (0–4095) to 0–100 score
  const convertToScore = (raw: number): number => {
    let scaled = 100 - (raw / 4095) * 100;
    return Math.max(0, Math.min(100, Math.floor(scaled)));
  };

  const fetchAirQuality = async () => {
    try {
      const response = await fetch(THINGSPEAK_URL);
      if (!response.ok) throw new Error("Failed to fetch ThingSpeak data");

      const data = await response.json();

      // Field number depends on your ESP32 upload:
      // Example: field4 (or field5)
      const gasValue = parseInt(data.field4 || data.field5 || "0");

      setGasReading(gasValue);

      const score = convertToScore(gasValue);
      setAirQuality(score);

      // 🟢 Status logic
      if (score >= 80) {
        setStatus("Good");
        setNeedsVentilation(false);
      } else if (score >= 60) {
        setStatus("Moderate");
        setNeedsVentilation(false);
      } else {
        setStatus("Unhealthy");
        setNeedsVentilation(true);
      }
    } catch (error) {
      console.error("ThingSpeak Fetch Error:", error);
    }
  };

  // Fetch every 15 seconds
  useEffect(() => {
    fetchAirQuality();
    const interval = setInterval(fetchAirQuality, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-baby-yellow/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow lg:col-span-2">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-foreground">Air Quality Level</h3>
        <Wind className="w-6 h-6 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div>
          <div className="flex items-center justify-center mb-4">
            <img
              src={
                airQuality >= 80
                  ? cloudGood
                  : airQuality >= 60
                  ? cloudModerate
                  : cloudUnhealthy
              }
              alt="Air Quality"
              className="w-24 h-24"
            />
          </div>

          <div className="text-center mb-4">
            <div className="text-xl font-bold text-foreground mb-1">{status}</div>
            <div className="inline-flex items-center justify-center bg-baby-mint/60 rounded-full px-6 py-3">
              <span className="text-4xl font-bold text-foreground">{airQuality}/100</span>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "11px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "11px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <div className="bg-card/50 rounded-2xl p-4">
            <div className="text-sm text-muted-foreground mb-2">Room Freshness Score</div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {airQuality}/100
            </div>
            <div className="text-xs text-muted-foreground">
              Air quality is {status.toLowerCase()}
            </div>
          </div>

          {needsVentilation && (
            <div className="bg-baby-pink/60 rounded-2xl p-4 border border-destructive/20">
              <div className="flex items-start gap-3">
                <CloudRain className="w-5 h-5 text-destructive mt-1" />
                <div>
                  <div className="font-bold text-foreground mb-1">Ventilation Reminder</div>
                  <div className="text-sm text-muted-foreground">
                    Open windows for fresh air circulation
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card/50 rounded-2xl p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              Sensor Readings (MQ-135)
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CO2 Level:</span>
                <span className="font-semibold text-foreground">
                  {Math.floor(gasReading * 0.10)} ppm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NH3 Level:</span>
                <span className="font-semibold text-foreground">
                  {Math.floor(gasReading * 0.02)} ppm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Smoke:</span>
                <span className="font-semibold text-foreground">
                  {Math.floor(gasReading * 0.01)} ppm
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default AirQualityCard;
