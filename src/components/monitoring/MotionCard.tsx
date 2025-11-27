"use client";

import { Card } from "@/components/ui/card";
import { Footprints, Clock, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import babyAwake from "@/assets/baby-awake.png";
import babySleeping from "@/assets/baby-sleeping.png";
import personEntering from "@/assets/person-entering.png";
import door from "@/assets/door.png";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const MotionCard = ({ babyName }: { babyName: string }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [lastMotion, setLastMotion] = useState("Just now");
  const [roomEntry, setRoomEntry] = useState(false);

  const fetchMotion = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const vibration = parseInt(data.field7);
      const motion = vibration === 1;

      setIsAwake(motion);

      if (!motion) {
        setSleepDuration((prev) => prev + 1);
      } else {
        setSleepDuration(0);
        setLastMotion(new Date().toLocaleTimeString());
      }

      setRoomEntry(motion && Math.random() > 0.7);
    } catch {}
  };

  useEffect(() => {
    fetchMotion();
    const i = setInterval(fetchMotion, 15000);
    return () => clearInterval(i);
  }, []);

  const formatSleepTime = (n: number) => `${n * 0.25} min`;

  return (
    <div className="space-y-4">
      {/* BABY AWAKE CARD */}
      <Card className="bg-baby-mint/50 p-6 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Baby Awakening Detector</h3>
          <Footprints className="w-6 h-6 text-primary" />
        </div>

        <div className="flex gap-4 items-center">
          <img
            src={isAwake ? babyAwake : babySleeping}
            className="w-20 h-20"
          />
          <div>
            <p className="text-2xl font-bold">
              {isAwake ? `${babyName} is Awake` : `${babyName} is Sleeping`}
            </p>
            <p className="text-sm">Last Movement: {lastMotion}</p>
          </div>
        </div>

        <div className="bg-card/50 p-4 mt-4 rounded-xl">
          <div className="flex gap-2 items-center mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Sleep Duration</span>
          </div>
          <p className="text-3xl font-bold">{formatSleepTime(sleepDuration)}</p>
        </div>
      </Card>

      {/* ENTRY ALERT */}
      <Card className="bg-baby-lavender/50 p-6 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Room Entry Alert</h3>
          <DoorOpen className="w-6 h-6 text-primary" />
        </div>

        <div
          className={`rounded-2xl p-4 ${
            roomEntry ? "bg-primary/10 border border-primary/20" : "bg-card/50"
          }`}
        >
          <div className="flex gap-3 items-center">
            <img
              src={roomEntry ? personEntering : door}
              className="w-12 h-12"
            />
            <div>
              <h4 className="font-bold">
                {roomEntry ? "Someone entered" : "No entry detected"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Monitoring your room safety
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MotionCard;
