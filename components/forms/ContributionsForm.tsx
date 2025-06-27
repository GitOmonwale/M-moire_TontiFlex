import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Coins, Smartphone } from "lucide-react";

const ContributionForm = () => {
    
  const [stakes, setStakes] = useState("1");
  const [operator, setOperator] = useState("");
  const stakeAmount = 2000;
  const totalAmount = parseInt(stakes) * stakeAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paiement effectué avec succès !");
  };

  return (
    <div className="">
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <GlassCard>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Contribution</h1>
              <p className="text-gray-600">Effectuer une contribution</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stakes" className="text-primary font-medium">
                  <Coins className="inline mr-2" size={16} />
                  Nombre de parts
                </Label>
                <Input
                  id="stakes"
                  type="number"
                  min="1"
                  value={stakes}
                  onChange={(e) => setStakes(e.target.value)}
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-gray-700">Total à payer: <span className="font-bold text-primary">{totalAmount.toLocaleString()} FCFA</span></p>
              </div>

              <GlassButton type="submit" size="lg" className="w-full cursor-pointer">
                Payer {totalAmount.toLocaleString()} FCFA
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ContributionForm;
