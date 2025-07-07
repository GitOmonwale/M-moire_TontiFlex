'use client'
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PiggyBank, Upload, CreditCard, Phone, Building2, FileText, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSavingsAccounts } from "@/hooks/useSavingAccounts";
import { useState, useCallback, ChangeEvent, useEffect } from "react";

const SavingsAccountForm = () => {
  const router = useRouter();
  const { createSavingsAccount, loading, fetchAvailableSFDs, availableSFDs } = useSavingsAccounts();
  const [formData, setFormData] = useState({
    sfd_choisie: "",
    numero_telephone_paiement: "",
  });
  const [pieceIdentite, setPieceIdentite] = useState<File | null>(null);
  const [photoIdentite, setPhotoIdentite] = useState<File | null>(null);

  useEffect(() => {
    fetchAvailableSFDs();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pieceIdentite || !photoIdentite) {
      toast.error("Veuillez télécharger tous les documents requis");
      return;
    }

    try {
      const accountData = new FormData();
      accountData.append('piece_identite', pieceIdentite);
      accountData.append('photo_identite', photoIdentite);
      accountData.append('sfd_choisie', formData.sfd_choisie);
      accountData.append('numero_telephone_paiement', formData.numero_telephone_paiement);

      await createSavingsAccount(accountData as any);
      
      toast.success("Demande de compte épargne créée avec succès !");
      setTimeout(() => router.push("/dashboards/dashboard-client/saving-accounts"), 1500);
    } catch (error) {
      console.error("Error creating savings account:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <GlassCard hover={false}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Ouvrir un Compte Courant</h1>
              <p className="text-gray-600">Compte Courant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
              <Label className="text-primary font-medium">
                  <FileText className="inline mr-2" size={16} />
                  Selectionner un SFD
                </Label>
                <select name="sfd_choisie" id="" className="bg-white/50 border-primary/20 p-2 rounded-md focus:outline focus:border-primary">
                  {availableSFDs.map((sfd) => (
                    <option key={sfd.id} value={sfd.id}>
                      {sfd.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
              <Label className="text-primary font-medium">
                  <Phone className="inline mr-2" size={16} />
              Votre numéro de téléphone
                </Label>
                <Input
                  type="tel"
                  name="numero_telephone_paiement"
                  className="bg-white/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-medium">
                  <FileText className="inline mr-2" size={16} />
                  Votre pièce d'identité (CIP, CNI)
                </Label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-white/50 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium">
                  <ImageIcon className="inline mr-2" size={16} />
                  Photo d'identité
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="bg-white/50 border-primary/20"
                />
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
