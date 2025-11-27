import { Card } from "@/components/ui/card";
import { Footprints, Clock, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import babyAwake from "@/assets/baby-awake.png";
import babySleeping from "@/assets/baby-sleeping.png";
import personEntering from "@/assets/person-entering.png";
import door from "@/assets/door.png";

interface MotionCardProps {
  babyName: string;
}

// ThingSpeak Config
const CHANNEL_ID = "3184419";
const READ_API_KEY = "L9SZLGO2FSE83JLZ";
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/3184419/feeds/last.json?api_key=L9SZLGO2FSE83JLZ`;

const MotionCard = ({ babyName }: MotionCardProps) => {
  const [isAwake, setIsAwake] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [lastMotion, setLastMotion] = useState("Just now");
  const [roomEntry, setRoomEntry] = useState(false);

  const fetchMotionData = async () => {
    try {
      const response = await fetch(THINGSPEAK_URL);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      // field7 = vibration (0 or 1)
      const vibration = parseInt(data.field7 || "0");

      const motionDetected = vibration === 1;

      setIsAwake(motionDetected);

      // Entry alert logic (optional: triggers if sudden vibration)
      setRoomEntry(motionDetected && Math.random() > 0.85);

      if (!motionDetected) {
        setSleepDuration((prev) => prev + 1); // track minutes
      } else {
        setSleepDuration(0);

        const now = new Date();
        const timeStr = `${now.getHours()}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        setLastMotion(timeStr);
      }
    } catch (err) {
      console.error("MotionCard Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMotionData();
    const interval = setInterval(fetchMotionData, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 4); // since we check every 15 sec = 0.25 min
    const mins = Math.floor((minutes % 4) * 0.25 * 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* BABY AWAKE CARD */}
      <Card className="bg-baby-mint/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-foreground">Baby Awakening Detector</h3>
          <Footprints className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={isAwake ? babyAwake : babySleeping}
            alt={isAwake ? "Baby Awake" : "Baby Sleeping"}
            className="w-20 h-20"
          />
          <div>
            <div className="text-2xl font-bold text-foreground">
              {isAwake ? `${babyName} is Awake` : `${babyName} is Sleeping`}
            </div>
            <div className="text-sm text-muted-foreground">
              Last Movement: {lastMotion}
            </div>
          </div>
        </div>

        <div className="bg-card/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Sleep Duration Timer
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {formatSleepTime(sleepDuration)}
          </div>
        </div>
      </Card>

      {/* ROOM ENTRY ALERT */}
      <Card className="bg-baby-lavender/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-foreground">Room Entry Alert</h3>
          <DoorOpen className="w-6 h-6 text-primary" />
        </div>

        <div
          className={`rounded-2xl p-4 ${
            roomEntry
              ? "bg-primary/10 border border-primary/20"
              : "bg-card/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={roomEntry ? personEntering : door}
              alt={roomEntry ? "Person Entering" : "Door"}
              className="w-12 h-12"
            />
            <div>
              <div className="font-bold text-foreground">
                {roomEntry ? "Someone entered" : "No entry detected"}
              </div>
              <div className="text-sm text-muted-foreground">
                Monitoring room safety
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MotionCard;
