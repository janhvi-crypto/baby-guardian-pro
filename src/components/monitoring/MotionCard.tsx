import { Card } from "@/components/ui/card";
import { Footprints, Clock, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import babyAwake from "@/assets/baby-awake.png";
import babySleeping from "@/assets/baby-sleeping.png";
import personEntering from "@/assets/person-entering.png";
import door from "@/assets/door.png";

const MotionCard = () => {
  const [isAwake, setIsAwake] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [lastMotion, setLastMotion] = useState("2 min ago");
  const [roomEntry, setRoomEntry] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const motionDetected = Math.random() > 0.6;
      setIsAwake(motionDetected);
      setRoomEntry(Math.random() > 0.85);

      if (!motionDetected) {
        setSleepDuration((prev) => prev + 1);
      } else {
        setSleepDuration(0);
        setLastMotion("Just now");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-baby-mint/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-foreground">Baby Awakening Detector</h3>
          <Footprints className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <img src={isAwake ? babyAwake : babySleeping} alt={isAwake ? "Baby Awake" : "Baby Sleeping"} className="w-20 h-20" />
          <div>
            <div className="text-2xl font-bold text-foreground">{isAwake ? "Baby is Awake" : "Baby is Sleeping"}</div>
            <div className="text-sm text-muted-foreground">Last Sleep detected: {lastMotion}</div>
          </div>
        </div>

        <div className="bg-card/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sleep Duration Timer</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{formatSleepTime(sleepDuration)}</div>
        </div>
      </Card>

      <Card className="bg-baby-lavender/50 backdrop-blur-sm border-none shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-foreground">Room Entry Alert</h3>
          <DoorOpen className="w-6 h-6 text-primary" />
        </div>

        <div className={`rounded-2xl p-4 ${roomEntry ? "bg-primary/10 border border-primary/20" : "bg-card/50"}`}>
          <div className="flex items-center gap-3">
            <img src={roomEntry ? personEntering : door} alt={roomEntry ? "Person Entering" : "Door"} className="w-12 h-12" />
            <div>
              <div className="font-bold text-foreground">{roomEntry ? "Someone entered" : "No entry detected"}</div>
              <div className="text-sm text-muted-foreground">Monitoring room safety</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MotionCard;