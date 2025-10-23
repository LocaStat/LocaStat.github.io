import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet } from "lucide-react";

interface SheetSelectorProps {
  sheets: string[];
  onSelect: (sheetName: string) => void;
  onCancel: () => void;
}

export const SheetSelector = ({ sheets, onSelect, onCancel }: SheetSelectorProps) => {
  const [selectedSheet, setSelectedSheet] = useState(sheets[0]);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Select Sheet
          </DialogTitle>
          <DialogDescription>
            This Excel file contains multiple sheets. Please select one to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedSheet} onValueChange={setSelectedSheet}>
            <div className="space-y-3">
              {sheets.map((sheet) => (
                <div
                  key={sheet}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedSheet(sheet)}
                >
                  <RadioGroupItem value={sheet} id={sheet} />
                  <Label htmlFor={sheet} className="flex-1 cursor-pointer font-medium">
                    {sheet}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSelect(selectedSheet)}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
