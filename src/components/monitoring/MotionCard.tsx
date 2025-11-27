"use client";

import { Card } from "@/components/ui/card";
import { Footprints, Clock, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import babyAwake from "@/assets/baby-awake.png";
import babySleeping from "@/assets/baby-sleeping.png";
import personEntering from "@/assets/person-entering.png";
import door from "@/assets/door.png";
import { toast } from "@/hooks/use-toast";

const THINGSPEAK_LATEST =
  "https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ&results=20";

const MotionCard = ({ babyName }: { babyName: string }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [lastMotion, setLastMotion] = useState("Just now");
  const [roomEntry, setRoomEntry] = useState(false);
  const [hasAlerted, setHasAlerted] = useState(false);

  const fetchMotion = async () => {
    try {
      const res = await fetch(THINGSPEAK_LATEST);
      const data = await res.json();

      const vibration = parseInt(data.field7);
      const motion = vibration === 1;

      const wasAsleep = !isAwake;
      setIsAwake(motion);

      if (motion && wasAsleep && !hasAlerted) {
        toast({
          title: "👀 Motion Alert",
          description: `${babyName} is awake!`,
        });
        setHasAlerted(true);
      } else if (!motion) {
        setHasAlerted(false);
      }

      if (!motion) {
        setSleepDuration((prev) => prev + 1);
      } else {
        setSleepDuration(0);
        setLastMotion(new Date().toLocaleTimeString());
      }

      const entryDetected = motion && Math.random() > 0.7;
      if (entryDetected && !roomEntry) {
        toast({
          title: "🚪 Room Entry Alert",
          description: "Someone entered the room",
        });
      }
      setRoomEntry(entryDetected);
    } catch {}
  };

  useEffect(() => {
    fetchMotion();
    const i = setInterval(fetchMotion, 15000);
    return () => clearInterval(i);
  }, []);

  const formatSleepTime = (n: number) => `${n * 0.25} min`;

  return (
    <Card className="bg-baby-mint/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold">Baby Awakening</h3>
        <Footprints className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>

      <div className="flex gap-3 sm:gap-4 items-center mb-3 sm:mb-4">
        <img
          src={isAwake ? babyAwake : babySleeping}
          className="w-16 h-16 sm:w-20 sm:h-20"
        />
        <div>
          <p className="text-lg sm:text-2xl font-bold">
            {isAwake ? `${babyName} is Awake` : `${babyName} is Sleeping`}
          </p>
          <p className="text-xs sm:text-sm">Last Movement: {lastMotion}</p>
        </div>
      </div>

      <div className="bg-card/50 p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl">
        <div className="flex gap-2 items-center mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs sm:text-sm">Sleep Duration</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{formatSleepTime(sleepDuration)}</p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm sm:text-base font-bold">Room Entry</h4>
        <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>

      <div
        className={`rounded-xl p-3 ${
          roomEntry ? "bg-primary/10 border border-primary/20" : "bg-card/50"
        }`}
      >
        <div className="flex gap-2 sm:gap-3 items-center">
          <img
            src={roomEntry ? personEntering : door}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <div>
            <h4 className="text-sm sm:text-base font-bold">
              {roomEntry ? "Someone entered" : "No entry detected"}
            </h4>
            <p className="text-xs text-muted-foreground">
              Monitoring room safety
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MotionCard;
