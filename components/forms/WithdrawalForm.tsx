import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Minus, Smartphone, Phone } from "lucide-react";
import router from "next/router";

const WithdrawalForm = () => {
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(amount) > 50000) {
      toast.error("Solde insuffisant");
      return;
    }
    toast.success("Demande de retrait soumise avec succès !");
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
   <div className="">
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <GlassCard>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Retrait</h1>
              <p className="text-gray-600">Demander un retrait de fonds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-primary font-medium">
                  <Minus className="inline mr-2" size={16} />
                  Montant (FCFA)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-primary font-medium">
                  <Phone className="inline mr-2" size={16} />
                  Numéro de téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <GlassButton type="submit" size="lg" className="w-full cursor-pointer">
                Soumettre la demande
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;
