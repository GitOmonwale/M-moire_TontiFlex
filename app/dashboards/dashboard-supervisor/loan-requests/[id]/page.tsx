'use client'
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  User, 
  DollarSign, 
  Calendar, 
  Target, 
  FileText,
  Phone,
  Briefcase,
  CreditCard,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Send,
  Download,
  Eye,
  Clock,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { mockLoanRequests, type LoanRequest } from '@/data/supervisorMockData';
import { toast } from 'sonner';

const LoanRequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  
  const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'scoring' | 'decision'>('overview');
  
  // États pour la décision
  const [decision, setDecision] = useState<'approve' | 'reject' | 'transfer' | null>(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [conditions, setConditions] = useState("");
  const [supervisorNotes, setSupervisorNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const action = searchParams.get('action');
  
  useEffect(() => {
    if (defaultTab === 'decision') {
      setActiveTab('decision');
    }
  }, [defaultTab]);
  
  useEffect(() => {
    const fetchLoanRequest = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const found = mockLoanRequests.find(r => r.id === requestId);
      if (found) {
        setLoanRequest(found);
        setApprovedAmount(found.requestedAmount.toString());
        setLoanDuration(found.requestedDuration.toString());
        setInterestRate("2.5"); // Taux par défaut
      }
      
      setIsLoading(false);
    };

    if (requestId) {
      fetchLoanRequest();
    }
  }, [requestId]);

  const calculateMonthlyPayment = () => {
    if (!approvedAmount || !interestRate || !loanDuration) return 0;
    
    const principal = parseFloat(approvedAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanDuration);
    
    if (monthlyRate === 0) return principal / months;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    return monthlyPayment;
  };

  const handleDecisionSubmit = async () => {
    if (!decision) {
      toast.error("Veuillez sélectionner une décision");
      return;
    }

    if (decision === 'approve' && (!approvedAmount || !interestRate || !loanDuration)) {
      toast.error("Veuillez remplir tous les champs pour l'approbation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi au backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const actionText = decision === 'approve' ? 'approuvée' : 
                        decision === 'reject' ? 'rejetée' : 'transférée';
      
      toast.success(`Demande ${actionText} avec succès !`);
      setTimeout(() => router.push('/dashboard-supervisor/loan-requests'), 1500);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la décision");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!loanRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full">
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Demande introuvable</h2>
            <p className="text-gray-600 mb-6">La demande de prêt demandée n'existe pas.</p>
            <GlassButton onClick={() => router.push('/dashboard-supervisor/loan-requests')} size="lg">
              Retour aux demandes
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <GlassButton 
              variant="outline" 
              onClick={() => router.back()}
              className="mr-4 h-10 w-10 p-0 rounded-full"
            >
              <ArrowLeft size={18} />
            </GlassButton>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Demande de Prêt - {loanRequest.id}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="mr-2" size={16} />
                  {loanRequest.clientName}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Demandé le {format(new Date(loanRequest.requestDate), 'dd MMM yyyy', { locale: fr })}
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  loanRequest.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  loanRequest.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    loanRequest.urgency === 'high' ? 'bg-red-500' :
                    loanRequest.urgency === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  {loanRequest.urgency === 'high' ? 'Urgente' :
                   loanRequest.urgency === 'medium' ? 'Normale' : 'Faible'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <GlassButton variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Télécharger dossier
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-2xl">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'scoring', label: 'Évaluation', icon: BarChart3 },
            { id: 'decision', label: 'Décision', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all",
                activeTab === tab.id
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations client */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-emerald-600" size={20} />
                  Informations Client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-lg font-semibold text-gray-900">{loanRequest.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Téléphone</label>
                    <p className="text-gray-900">{loanRequest.clientPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Profession</label>
                    <p className="text-gray-900">{loanRequest.clientProfession}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Compte épargne</label>
                    <p className="text-gray-900">{loanRequest.savingsAccountId}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Détails de la demande */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 text-emerald-600" size={20} />
                  Détails de la Demande
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Montant demandé</label>
                    <p className="text-2xl font-bold text-emerald-600">
                      {loanRequest.requestedAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durée souhaitée</label>
                    <p className="text-xl font-semibold text-gray-900">{loanRequest.requestedDuration} mois</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Objet du prêt</label>
                    <p className="text-gray-900 mt-1">{loanRequest.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de garantie</label>
                    <p className="text-gray-900">{loanRequest.guaranteeType}</p>
                  </div>
                  {loanRequest.guaranteeValue && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Valeur de la garantie</label>
                      <p className="text-gray-900">{loanRequest.guaranteeValue.toLocaleString()} FCFA</p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Situation financière */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-emerald-600" size={20} />
                  Situation Financière
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-green-700">Revenus mensuels</label>
                    <p className="text-xl font-bold text-green-600">
                      {loanRequest.monthlyIncome.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-red-700">Charges mensuelles</label>
                    <p className="text-xl font-bold text-red-600">
                      {loanRequest.monthlyExpenses.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-blue-700">Capacité de remboursement</label>
                    <p className="text-xl font-bold text-blue-600">
                      {(loanRequest.monthlyIncome - loanRequest.monthlyExpenses).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar droite */}
            <div className="space-y-6">
              {/* Score de fiabilité */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="mr-2 text-emerald-600" size={20} />
                  Score de Fiabilité
                </h3>
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor(loanRequest.reliabilityScore)}`}>
                    {loanRequest.reliabilityScore}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Score global</p>
                </div>
                
                {/* Barre de progression du risque */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Niveau de risque</span>
                    <span>{loanRequest.reliabilityScore >= 85 ? 'Faible' : 
                           loanRequest.reliabilityScore >= 75 ? 'Moyen' : 'Élevé'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getRiskLevelColor(loanRequest.reliabilityScore)}`}
                      style={{ width: `${loanRequest.reliabilityScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Historique épargne:</span>
                    <span className="font-medium">{loanRequest.savingsHistory.regularityScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ancienneté compte:</span>
                    <span className="font-medium">{loanRequest.savingsHistory.accountAge} mois</span>
                  </div>
                  {loanRequest.tontineHistory && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tontines actives:</span>
                      <span className="font-medium">{loanRequest.tontineHistory.activeTontines}</span>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Documents */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-2 text-emerald-600" size={20} />
                  Documents
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pièce d'identité</span>
                    <div className="flex items-center">
                      {loanRequest.documents.identity ? (
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                      ) : (
                        <XCircle className="text-red-600 mr-2" size={16} />
                      )}
                      <GlassButton variant="outline" size="sm">
                        <Eye size={14} />
                      </GlassButton>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Justificatif revenus</span>
                    <div className="flex items-center">
                      {loanRequest.documents.income ? (
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                      ) : (
                        <XCircle className="text-red-600 mr-2" size={16} />
                      )}
                      <GlassButton variant="outline" size="sm">
                        <Eye size={14} />
                      </GlassButton>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Garantie</span>
                    <div className="flex items-center">
                      {loanRequest.documents.guarantee ? (
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                      ) : (
                        <XCircle className="text-red-600 mr-2" size={16} />
                      )}
                      <GlassButton variant="outline" size="sm">
                        <Eye size={14} />
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Historique épargne */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="mr-2 text-emerald-600" size={20} />
                  Historique Épargne
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total dépôts:</span>
                    <span className="font-medium">{loanRequest.savingsHistory.totalDeposits.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Solde moyen:</span>
                    <span className="font-medium">{loanRequest.savingsHistory.averageBalance.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ancienneté:</span>
                    <span className="font-medium">{loanRequest.savingsHistory.accountAge} mois</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'decision' && (
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8" hover={false}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="mr-3 text-emerald-600" size={24} />
                Prise de Décision
              </h3>

              {/* Sélection de la décision */}
              <div className="mb-8">
                <Label className="text-base font-medium text-gray-900 mb-4 block">
                  Quelle est votre décision ?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setDecision('approve')}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      decision === 'approve' 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-200 hover:border-green-300"
                    )}
                  >
                    <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                    <p className="font-medium text-green-700">Approuver</p>
                    <p className="text-sm text-gray-600">Accorder le prêt</p>
                  </button>
                  
                  <button
                    onClick={() => setDecision('reject')}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      decision === 'reject' 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-200 hover:border-red-300"
                    )}
                  >
                    <XCircle className="text-red-600 mx-auto mb-2" size={24} />
                    <p className="font-medium text-red-700">Rejeter</p>
                    <p className="text-sm text-gray-600">Refuser la demande</p>
                  </button>
                  
                  <button
                    onClick={() => setDecision('transfer')}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      decision === 'transfer' 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <Send className="text-blue-600 mx-auto mb-2" size={24} />
                    <p className="font-medium text-blue-700">Transférer</p>
                    <p className="text-sm text-gray-600">Vers l'administrateur</p>
                  </button>
                </div>
              </div>

              {/* Formulaire d'approbation */}
              {decision === 'approve' && (
                <div className="border-t pt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Conditions d'approbation</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label htmlFor="approvedAmount">Montant approuvé (FCFA)</Label>
                      <Input
                        id="approvedAmount"
                        type="number"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="loanDuration">Durée (mois)</Label>
                      <Input
                        id="loanDuration"
                        type="number"
                        value={loanDuration}
                        onChange={(e) => setLoanDuration(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Calcul du remboursement */}
                  {approvedAmount && interestRate && loanDuration && (
                    <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                      <h5 className="font-medium text-emerald-900 mb-2">Simulation de remboursement</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-emerald-700">Mensualité:</span>
                          <p className="font-bold text-emerald-900">
                            {calculateMonthlyPayment().toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <span className="text-emerald-700">Total à rembourser:</span>
                          <p className="font-bold text-emerald-900">
                            {(calculateMonthlyPayment() * parseInt(loanDuration || "0")).toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <span className="text-emerald-700">Intérêts:</span>
                          <p className="font-bold text-emerald-900">
                            {((calculateMonthlyPayment() * parseInt(loanDuration || "0")) - parseFloat(approvedAmount || "0")).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <Label htmlFor="conditions">Conditions particulières</Label>
                    <Textarea
                      id="conditions"
                      placeholder="Conditions spéciales ou exigences particulières..."
                      value={conditions}
                      onChange={(e) => setConditions(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Notes du superviseur */}
              <div className="border-t pt-6">
                <Label htmlFor="supervisorNotes">Notes du superviseur</Label>
                <Textarea
                  id="supervisorNotes"
                  placeholder="Commentaires, observations ou justifications de votre décision..."
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
                <GlassButton
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </GlassButton>
                <GlassButton
                  onClick={handleDecisionSubmit}
                  disabled={!decision || isSubmitting}
                  className={`${decision === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={16} />
                      Confirmer la décision
                    </>
                  )}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Autres onglets peuvent être ajoutés ici */}
      </div>
    </div>
  );
};

export default LoanRequestDetailPage;