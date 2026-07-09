import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDailyTip } from "@/lib/daily-tips";

export function DailyTip() {
  const tip = getDailyTip();
  return (
    <Card glass>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
          <Lightbulb size={18} className="text-gold" />
        </div>
        <div>
          <Badge variant="gold" className="mb-2">
            Today&apos;s Tip
          </Badge>
          <p className="text-sm text-foreground/90">{tip}</p>
        </div>
      </div>
    </Card>
  );
}
