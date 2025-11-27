"use client";

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

const THINGSPEAK_URL =
  "https://api.thingspeak.com/channels/3184419/feeds.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const ThingSpeakGraphs = () => {
  const [tempHumidityData, setTempHumidityData] = useState<any[]>([]);
  const [gasData, setGasData] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchThingSpeakData = async () => {
    try {
      const response = await fetch(THINGSPEAK_URL);
      if (!response.ok) throw new Error("ThingSpeak fetch error");

      const data = await response.json();

      setTempHumidityData(
        data.feeds.map((f: any) => ({
          time: new Date(f.created_at).toLocaleTimeString(),
          temperature: parseFloat(f.field5),
          humidity: parseFloat(f.field6),
        }))
      );

      setGasData(
        data.feeds.map((f: any) => ({
          time: new Date(f.created_at).toLocaleTimeString(),
          ppm: parseFloat(f.field1),
        }))
      );
    } catch (err) {
      setError("Error fetching data from ThingSpeak");
    }
  };

  useEffect(() => {
    fetchThingSpeakData();
    const interval = setInterval(fetchThingSpeakData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* TEMP-HUM GRAPH */}
      <Card className="bg-baby-blue/50 p-6 rounded-3xl shadow-lg">
        <h3 className="text-lg font-bold mb-2 flex gap-2 items-center">
          <Cloud /> Temperature & Humidity
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempHumidityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff6b6b" />
              <Line type="monotone" dataKey="humidity" stroke="#4ecdc4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* GAS GRAPH */}
      <Card className="bg-baby-mint/50 p-6 rounded-3xl shadow-lg">
        <h3 className="text-lg font-bold mb-2 flex gap-2 items-center">
          <Activity /> Gas Levels (MQ-135)
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ppm" stroke="#a29bfe" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ThingSpeakGraphs;
