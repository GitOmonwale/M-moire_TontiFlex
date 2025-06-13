'use client'
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Coins, Users, Calendar, Building, FileImage, X, Eye, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { mockTontines } from "@/data/mockData";
import TontineSkeleton from "@/skeletons/TontineJoiningSkeleton";

interface FileWithPreview {
    file: File;
    preview: string;
    type: 'image' | 'pdf';
}

interface FormData {
    tontineId: string;
    contributionAmount: number;
    rectoFile: File | null;
    versoFile: File | null;
}

const TontineJoining = ({ id }: { id: string }) => {
    const router = useRouter();
    const [tontine, setTontine] = useState<any>(null);
    const [contributionAmount, setContributionAmount] = useState("");
    const [rectoFile, setRectoFile] = useState<FileWithPreview | null>(null);
    const [versoFile, setVersoFile] = useState<FileWithPreview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState<'recto' | 'verso' | null>(null);
    
    useEffect(() => {
        console.log("TontineJoining - ID reçu:", id);
        
        const fetchTontine = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const found = mockTontines.find(t => t.id === id);
            console.log("Tontine trouvée:", found);
            
            if (found) {
                setTontine(found);
            } else {
                toast.error("Tontine non trouvée");
                router.push("/tontines");
            }
            
            setIsLoading(false);
        };

        if (id) {
            fetchTontine();
        }
    }, [id, router]);

    const createFilePreview = (file: File): Promise<FileWithPreview> => {
        return new Promise((resolve) => {
            const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
            
            if (fileType === 'image') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        file,
                        preview: e.target?.result as string,
                        type: fileType
                    });
                };
                reader.readAsDataURL(file);
            } else {
                // Pour les PDFs, on utilise une icône générique
                resolve({
                    file,
                    preview: '/pdf-icon.svg', // Vous pouvez mettre une icône PDF ici
                    type: fileType
                });
            }
        });
    };

    const handleRectoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                const fileWithPreview = await createFilePreview(file);
                setRectoFile(fileWithPreview);
                toast.success(`Recto sélectionné: ${file.name}`);
            } else {
                toast.error("Veuillez sélectionner une image ou un PDF");
                e.target.value = '';
            }
        }
    };

    const handleVersoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                const fileWithPreview = await createFilePreview(file);
                setVersoFile(fileWithPreview);
                toast.success(`Verso sélectionné: ${file.name}`);
            } else {
                toast.error("Veuillez sélectionner une image ou un PDF");
                e.target.value = '';
            }
        }
    };

    const removeFile = (type: 'recto' | 'verso') => {
        if (type === 'recto') {
            setRectoFile(null);
            // Reset input
            const input = document.getElementById('recto') as HTMLInputElement;
            if (input) input.value = '';
        } else {
            setVersoFile(null);
            const input = document.getElementById('verso') as HTMLInputElement;
            if (input) input.value = '';
        }
        toast.info(`${type === 'recto' ? 'Recto' : 'Verso'} supprimé`);
    };

    const submitToBackend = async (formData: FormData): Promise<boolean> => {
        // Simulation d'envoi au backend
        console.log("=== ENVOI AU BACKEND ===");
        console.log("Données du formulaire:", {
            tontineId: formData.tontineId,
            contributionAmount: formData.contributionAmount,
            rectoFileName: formData.rectoFile?.name,
            versoFileName: formData.versoFile?.name,
        });

        // Simulation FormData pour envoi multipart
        const backendFormData = new FormData();
        backendFormData.append('tontineId', formData.tontineId);
        backendFormData.append('contributionAmount', formData.contributionAmount.toString());
        
        if (formData.rectoFile) {
            backendFormData.append('rectoFile', formData.rectoFile);
        }
        
        if (formData.versoFile) {
            backendFormData.append('versoFile', formData.versoFile);
        }

        // Simulation d'appel API
        try {
            // Remplacez cette partie par votre vraie API
            /*
            const response = await fetch('/api/tontines/join', {
                method: 'POST',
                body: backendFormData,
                headers: {
                    // N'ajoutez pas Content-Type pour FormData, le navigateur le fera
                    'Authorization': `Bearer ${yourAuthToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result.success;
            */

            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulation d'une réponse réussie (90% de chance)
            const success = Math.random() > 0.1;
            
            if (!success) {
                throw new Error("Erreur de simulation du serveur");
            }
            
            console.log("✅ Envoi simulé réussi");
            return true;

        } catch (error) {
            console.error("❌ Erreur lors de l'envoi:", error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!contributionAmount) {
            toast.error("Veuillez saisir le montant de contribution");
            return;
        }
        
        if (!rectoFile || !versoFile) {
            toast.error("Veuillez uploader le recto et le verso de votre pièce d'identité");
            return;
        }

        const contribution = parseFloat(contributionAmount);
        if (contribution < tontine.minAmount || contribution > tontine.maxAmount) {
            toast.error(`Le montant doit être entre ${tontine.minAmount} et ${tontine.maxAmount} FCFA`);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData: FormData = {
                tontineId: id,
                contributionAmount: contribution,
                rectoFile: rectoFile.file,
                versoFile: versoFile.file,
            };

            const success = await submitToBackend(formData);
            
            if (success) {
                toast.success("Demande d'adhésion envoyée avec succès !");
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Une erreur inattendue s'est produite.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !tontine) {
        return <TontineSkeleton />;
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <GlassCard>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-primary mb-2">{tontine.name}</h1>
                            <p className="text-gray-600">Remplissez le formulaire pour adhérer</p>
                        </div>

                        {/* Détails de la tontine */}
                        <div className="rounded-lg p-4 mb-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                                    <span>Durée: {tontine.duration}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Users className="w-5 h-5 mr-2 text-primary" />
                                    <span>{tontine.currentMembers}/{tontine.members} membres</span>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Building className="w-5 h-5 mr-2 text-primary" />
                                <span>SFD: {tontine.sfd}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="contribution" className="text-primary font-medium">
                                    <Coins className="inline mr-2" size={16} />
                                    Contribution quotidienne (FCFA)
                                </Label>
                                <Input
                                    id="contribution"
                                    type="number"
                                    placeholder={`${tontine.minAmount.toLocaleString()} FCFA - ${tontine.maxAmount.toLocaleString()} FCFA`}
                                    min={tontine.minAmount}
                                    max={tontine.maxAmount}
                                    value={contributionAmount}
                                    onChange={(e) => setContributionAmount(e.target.value)}
                                    required
                                    className="bg-white/50 border-primary/20"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Upload Recto/Verso */}
                            <div className="space-y-4">
                                <Label className="text-primary font-medium">
                                    <Upload className="inline mr-2" size={16} />
                                    Pièce d'identité (recto et verso requis)
                                </Label>
                                
                                {/* Recto */}
                                <div className="space-y-2">
                                    <Label htmlFor="recto" className="text-sm text-gray-600 flex items-center">
                                        <FileImage className="mr-1" size={14} />
                                        Recto de la pièce d'identité *
                                    </Label>
                                    <Input
                                        id="recto"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleRectoChange}
                                        required
                                        className="bg-white/50 border-primary/20"
                                        disabled={isSubmitting}
                                    />
                                    {rectoFile && (
                                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {rectoFile.type === 'image' ? (
                                                    <img 
                                                        src={rectoFile.preview} 
                                                        alt="Aperçu recto" 
                                                        className="w-12 h-12 object-cover rounded border"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-red-100 rounded border flex items-center justify-center">
                                                        <FileImage size={20} className="text-red-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm text-green-700 font-medium">
                                                        {rectoFile.file.name}
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        {(rectoFile.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {rectoFile.type === 'image' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPreview('recto')}
                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('recto')}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    disabled={isSubmitting}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Verso */}
                                <div className="space-y-2">
                                    <Label htmlFor="verso" className="text-sm text-gray-600 flex items-center">
                                        <FileImage className="mr-1" size={14} />
                                        Verso de la pièce d'identité *
                                    </Label>
                                    <Input
                                        id="verso"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleVersoChange}
                                        required
                                        className="bg-white/50 border-primary/20"
                                        disabled={isSubmitting}
                                    />
                                    {versoFile && (
                                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {versoFile.type === 'image' ? (
                                                    <img 
                                                        src={versoFile.preview} 
                                                        alt="Aperçu verso" 
                                                        className="w-12 h-12 object-cover rounded border"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-red-100 rounded border flex items-center justify-center">
                                                        <FileImage size={20} className="text-red-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm text-green-700 font-medium">
                                                        {versoFile.file.name}
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        {(versoFile.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {versoFile.type === 'image' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPreview('verso')}
                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                        disabled={isSubmitting}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('verso')}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    disabled={isSubmitting}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> Formats acceptés: JPG, PNG, PDF. Taille max: 5MB par fichier.
                                        Assurez-vous que les informations sont bien lisibles sur les deux faces.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-primary/10 p-4 rounded-lg">
                                <h3 className="font-semibold text-primary mb-2">Frais d'adhésion</h3>
                                <p className="text-gray-700">{tontine.fraisAdhesion} FCFA (paiement unique)</p>
                                <p><span className="text-red-400 font-bold">NB: </span>
                                    Les frais d'adhésion sont à payer après validation de votre demande par l'agent SFD</p>
                            </div>

                            <GlassButton 
                                type="submit" 
                                size="lg" 
                                className="w-full"
                                disabled={!contributionAmount || !rectoFile || !versoFile || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2" size={16} />
                                        Soumettre ma demande
                                    </>
                                )}
                            </GlassButton>
                        </form>
                    </GlassCard>
                </div>
            </div>

            {/* Modal de prévisualisation */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                Aperçu - {showPreview === 'recto' ? 'Recto' : 'Verso'}
                            </h3>
                            <button
                                onClick={() => setShowPreview(null)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4">
                            <img
                                src={showPreview === 'recto' ? rectoFile?.preview : versoFile?.preview}
                                alt={`Aperçu ${showPreview}`}
                                className="max-w-full h-auto mx-auto"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TontineJoiningPage = () => {
    const params = useParams();
    const id = params.id as string;
    
    return <TontineJoining id={id} />;
};

export default TontineJoiningPage;