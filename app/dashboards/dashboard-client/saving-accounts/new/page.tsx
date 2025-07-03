
'use client'
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PiggyBank, Upload, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

const router = useRouter();
const SavingsAccountForm = () => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Compte d'épargne créé avec succès !");
    setTimeout(() => router.push("/dashboards/dashboard-client/savings"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent">      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <GlassCard>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Ouvrir un Compte Épargne</h1>
              <p className="text-gray-600">Commencez à épargner dès aujourd'hui</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-primary font-medium">
                  <CreditCard className="inline mr-2" size={16} />
                  Pièce d'identité
                </Label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">
                  <Upload className="inline mr-2" size={16} />
                  Photo d'identité
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2 flex items-center">
                  <PiggyBank className="mr-2" size={20} />
                  Frais de création
                </h3>
                <p className="text-gray-700">1 000 FCFA (paiement unique)</p>
              </div>

              <GlassButton type="submit" size="lg" className="w-full">
                Créer mon compte épargne
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SavingsAccountForm;
