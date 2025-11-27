import { Card } from "@/components/ui/card";
import { Cloud, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


// 👉👉 REPLACE THESE WITH YOUR REAL VALUES
const CHANNEL_ID = "3181835";        // Example: "3181835"
const READ_API_KEY = "RKLNYQG9K92996XH";    // Example: "HEN9O0LQ201OJZ5S"

const THINGSPEAK_URL = `https://api.thingspeak.com/channels/3181835/feeds.json?api_key=RKLNYQG9K92996XH&results=20`;

const ThingSpeakGraphs = () => {
  const [tempHumidityData, setTempHumidityData] = useState<any[]>([]);
  const [gasData, setGasData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchThingSpeakData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(THINGSPEAK_URL);
      if (!response.ok) throw new Error("Failed to fetch ThingSpeak data");

      const data = await response.json();

      if (!data.feeds) throw new Error("No data found in ThingSpeak channel");

      // 🌡 TEMP & HUMIDITY
      const tempHumData = data.feeds.map((feed: any) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        temperature: parseFloat(feed.field1),   // Temp (field1)
        humidity: parseFloat(feed.field2),      // Humidity (field2)
      }));

      // 🟣 GAS SENSOR
      const gasDataProcessed = data.feeds.map((feed: any) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        ppm: parseFloat(feed.field5),           // Gas (field5)
      }));

      setTempHumidityData(tempHumData);
      setGasData(gasDataProcessed);

    } catch (err) {
      console.error(err);
      setError("Error fetching ThingSpeak data. Check your Channel ID & API key.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThingSpeakData();  
    const interval = setInterval(fetchThingSpeakData, 15000);  
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 🌡 Temperature & Humidity Graph */}
      <Card className="bg-baby-blue/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Cloud Graphs (ThingSpeak)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Temperature/Humidity Trend (DHT22)
            </p>
          </div>
          <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
            Live
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3 mb-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempHumidityData}>
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
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="temperature" stroke="#ff6b6b" strokeWidth={2} dot={{ fill: "#ff6b6b" }} name="Temp (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#4ecdc4" strokeWidth={2} dot={{ fill: "#4ecdc4" }} name="Humidity (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>


      {/* 🟣 Gas Sensor Graph */}
      <Card className="bg-baby-mint/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Gas Sensor (MQ-135)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">PPM vs Time Graph</p>
          </div>
          <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Live</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "10px" }}
                label={{ value: "PPM", angle: -90, position: "insideLeft", style: { fontSize: "10px" } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="ppm" stroke="#a29bfe" strokeWidth={2} dot={{ fill: "#a29bfe" }} name="Gas (PPM)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-card/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground">Safe Range</div>
            <div className="font-bold text-foreground">0-400 PPM</div>
          </div>
          <div className="bg-card/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground">Moderate</div>
            <div className="font-bold text-foreground">400-600 PPM</div>
          </div>
          <div className="bg-card/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground">Warning</div>
            <div className="font-bold text-destructive">&gt;600 PPM</div>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default ThingSpeakGraphs;
