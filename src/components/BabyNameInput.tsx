import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Baby, Edit2 } from "lucide-react";

interface BabyNameInputProps {
  babyName: string;
  onNameChange: (name: string) => void;
}

const BabyNameInput = ({ babyName, onNameChange }: BabyNameInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState(babyName);

  const handleSave = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim());
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={() => setTempName(babyName)}
        >
          <Baby className="w-4 h-4" />
          {babyName}
          <Edit2 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Baby's Name</DialogTitle>
          <DialogDescription>
            Enter your baby's name to personalize the monitoring dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter baby's name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="text-lg"
          />
          <Button onClick={handleSave} className="w-full">
            Save Name
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BabyNameInput;
