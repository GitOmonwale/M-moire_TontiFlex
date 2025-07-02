'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ClipboardList, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  Send,
  Clock,
  User,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  FileText,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Interface pour l'historique des décisions
interface DecisionHistory {
  id: string;
  loanRequestId: string;
  clientName: string;
  clientId: string;
  requestedAmount: number;
  requestedDuration: number;
  reliabilityScore: number;
  decision: 'approved' | 'rejected' | 'transferred';
  decisionDate: string;
  processingTime: number; // en jours
  approvedAmount?: number;
  interestRate?: number;
  approvedDuration?: number;
  rejectionReason?: string;
  transferReason?: string;
  supervisorNotes: string;
  conditions?: string;
  urgency: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
}

// Données mockées pour l'historique
const mockDecisionHistory: DecisionHistory[] = [
  {
    id: "DH001",
    loanRequestId: "LR001",
    clientName: "Marie Adjovi",
    clientId: "CL001",
    requestedAmount: 500000,
    requestedDuration: 12,
    reliabilityScore: 85,
    decision: "approved",
    decisionDate: "2025-06-28T14:30:00Z",
    processingTime: 2,
    approvedAmount: 450000,
    interestRate: 2.5,
    approvedDuration: 12,
    supervisorNotes: "Client fiable avec bon historique d'épargne. Montant réduit pour minimiser le risque.",
    conditions: "Justificatif de revenus trimestriel requis",
    urgency: "medium",
    riskLevel: "low"
  },
  {
    id: "DH002", 
    loanRequestId: "LR002",
    clientName: "Fatima Osseni",
    clientId: "CL002",
    requestedAmount: 300000,
    requestedDuration: 8,
    reliabilityScore: 92,
    decision: "approved",
    decisionDate: "2025-06-27T16:45:00Z",
    processingTime: 1,
    approvedAmount: 300000,
    interestRate: 2.0,
    approvedDuration: 8,
    supervisorNotes: "Excellente cliente avec score de fiabilité très élevé. Approbation complète.",
    urgency: "low",
    riskLevel: "low"
  },
  {
    id: "DH003",
    loanRequestId: "LR003", 
    clientName: "Grace Kponou",
    clientId: "CL003",
    requestedAmount: 750000,
    requestedDuration: 18,
    reliabilityScore: 76,
    decision: "rejected",
    decisionDate: "2025-06-26T11:20:00Z",
    processingTime: 3,
    rejectionReason: "Score de fiabilité insuffisant et revenus irréguliers",
    supervisorNotes: "Historique de paiements irréguliers dans les tontines. Demande de montant trop élevé par rapport aux revenus.",
    urgency: "high",
    riskLevel: "high"
  },
  {
    id: "DH004",
    loanRequestId: "LR004",
    clientName: "Rachelle Bankole", 
    clientId: "CL004",
    requestedAmount: 400000,
    requestedDuration: 10,
    reliabilityScore: 88,
    decision: "transferred",
    decisionDate: "2025-06-25T09:15:00Z",
    processingTime: 4,
    transferReason: "Montant élevé nécessitant l'approbation de l'administrateur",
    supervisorNotes: "Cliente fiable mais demande de montant élevé. Recommandation d'approbation sous conditions.",
    urgency: "medium",
    riskLevel: "low"
  },
  {
    id: "DH005",
    loanRequestId: "LR005",
    clientName: "Aimée Gbaguidi",
    clientId: "CL005", 
    requestedAmount: 250000,
    requestedDuration: 6,
    reliabilityScore: 89,
    decision: "approved",
    decisionDate: "2025-06-24T13:30:00Z",
    processingTime: 2,
    approvedAmount: 250000,
    interestRate: 2.2,
    approvedDuration: 6,
    supervisorNotes: "Prêt de courte durée pour cliente fiable. Taux préférentiel accordé.",
    urgency: "low",
    riskLevel: "low"
  },
  {
    id: "DH006",
    loanRequestId: "LR006",
    clientName: "Sandrine Azonhiho",
    clientId: "CL006",
    requestedAmount: 180000,
    requestedDuration: 12,
    reliabilityScore: 72,
    decision: "rejected",
    decisionDate: "2025-06-23T15:45:00Z",
    processingTime: 5,
    rejectionReason: "Score de fiabilité insuffisant et documents incomplets",
    supervisorNotes: "Manque de justificatifs de revenus et historique de retards dans les tontines.",
    urgency: "low",
    riskLevel: "high"
  }
];

const DecisionHistoryPage = () => {
  const [filterDecision, setFilterDecision] = useState("tous");
  const [filterPeriod, setFilterPeriod] = useState("thisMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Calculs des statistiques
  const totalDecisions = mockDecisionHistory.length;
  const approvedDecisions = mockDecisionHistory.filter(d => d.decision === 'approved').length;
  const rejectedDecisions = mockDecisionHistory.filter(d => d.decision === 'rejected').length;
  const transferredDecisions = mockDecisionHistory.filter(d => d.decision === 'transferred').length;
  const averageProcessingTime = mockDecisionHistory.reduce((sum, d) => sum + d.processingTime, 0) / totalDecisions;
  const approvalRate = (approvedDecisions / totalDecisions) * 100;

  // Filtrage et tri des décisions
  const filteredDecisions = mockDecisionHistory
    .filter(decision => {
      const decisionMatch = filterDecision === "tous" || decision.decision === filterDecision;
      const searchMatch = searchTerm === "" || 
        decision.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        decision.loanRequestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        decision.clientId.toLowerCase().includes(searchTerm.toLowerCase());
      
      return decisionMatch && searchMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.decisionDate).getTime() - new Date(b.decisionDate).getTime();
          break;
        case "amount":
          comparison = a.requestedAmount - b.requestedAmount;
          break;
        case "score":
          comparison = a.reliabilityScore - b.reliabilityScore;
          break;
        case "name":
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case "processingTime":
          comparison = a.processingTime - b.processingTime;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={16} />;
      case 'transferred':
        return <Send className="text-blue-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getDecisionLabel = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'transferred':
        return 'Transféré';
      default:
        return decision;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'transferred':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProcessingTimeColor = (days: number) => {
    if (days <= 2) return 'text-green-600';
    if (days <= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Décisions</h1>
            <p className="text-gray-600">Consultez l'historique de vos décisions sur les demandes de prêt</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Exporter historique
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Actualiser
            </GlassButton>
          </div>
        </div>

        {/* Statistiques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total décisions</p>
                <p className="text-2xl font-bold text-gray-900">{totalDecisions}</p>
              </div>
              <ClipboardList className="text-emerald-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{approvedDecisions}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{rejectedDecisions}</p>
              </div>
              <XCircle className="text-red-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'approbation</p>
                <p className="text-2xl font-bold text-emerald-600">{approvalRate.toFixed(1)}%</p>
              </div>
              <Target className="text-emerald-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-blue-600">{averageProcessingTime.toFixed(1)}j</p>
              </div>
              <Clock className="text-blue-600" size={24} />
            </div>
          </GlassCard>
        </div>

        {/* Graphiques de tendances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-emerald-600" size={20} />
              Répartition des Décisions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={20} />
                  <span className="font-medium text-gray-900">Approuvés</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">{approvedDecisions}</span>
                  <span className="text-sm text-gray-600 ml-2">({((approvedDecisions / totalDecisions) * 100).toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="text-red-600 mr-3" size={20} />
                  <span className="font-medium text-gray-900">Rejetés</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600">{rejectedDecisions}</span>
                  <span className="text-sm text-gray-600 ml-2">({((rejectedDecisions / totalDecisions) * 100).toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Send className="text-blue-600 mr-3" size={20} />
                  <span className="font-medium text-gray-900">Transférés</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">{transferredDecisions}</span>
                  <span className="text-sm text-gray-600 ml-2">({((transferredDecisions / totalDecisions) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-emerald-600" size={20} />
              Performance Temporelle
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-700">Temps de traitement moyen</span>
                <span className="font-bold text-emerald-600">{averageProcessingTime.toFixed(1)} jours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Décisions ce mois</span>
                <span className="font-bold text-blue-600">{totalDecisions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Score fiabilité moyen</span>
                <span className="font-bold text-purple-600">
                  {(mockDecisionHistory.reduce((sum, d) => sum + d.reliabilityScore, 0) / totalDecisions).toFixed(0)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filtres et recherche */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="text-emerald-600" size={20} />
              <span className="text-emerald-600 font-medium">Filtres :</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Rechercher par nom, ID client ou demande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60"
                />
              </div>

              {/* Filtre par décision */}
              <Select value={filterDecision} onValueChange={setFilterDecision}>
                <SelectTrigger className="w-48 bg-white/60">
                  <SelectValue placeholder="Type de décision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes décisions</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                  <SelectItem value="transferred">Transféré</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtre par période */}
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-48 bg-white/60">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisMonth">Ce mois</SelectItem>
                  <SelectItem value="lastMonth">Mois dernier</SelectItem>
                  <SelectItem value="thisQuarter">Ce trimestre</SelectItem>
                  <SelectItem value="all">Toute la période</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/60">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date de décision</SelectItem>
                  <SelectItem value="amount">Montant demandé</SelectItem>
                  <SelectItem value="score">Score fiabilité</SelectItem>
                  <SelectItem value="processingTime">Temps de traitement</SelectItem>
                  <SelectItem value="name">Nom client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Liste des décisions */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            {filteredDecisions.length > 0 ? (
              filteredDecisions.map((decision) => (
                <div key={decision.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Informations principales */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{decision.clientName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="mr-1" size={14} />
                              ID: {decision.clientId}
                            </div>
                            <div className="flex items-center">
                              <FileText className="mr-1" size={14} />
                              Demande: {decision.loanRequestId}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1" size={14} />
                              {format(new Date(decision.decisionDate), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDecisionColor(decision.decision)}`}>
                            {getDecisionIcon(decision.decision)}
                            <span className="ml-1">{getDecisionLabel(decision.decision)}</span>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(decision.riskLevel)}`}>
                            Score: {decision.reliabilityScore}/100
                          </span>
                        </div>
                      </div>

                      {/* Détails de la demande */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Montant demandé</p>
                          <p className="font-bold text-emerald-600">{decision.requestedAmount.toLocaleString()} FCFA</p>
                        </div>
                        
                        {decision.decision === 'approved' && decision.approvedAmount && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Montant approuvé</p>
                            <p className="font-bold text-green-600">{decision.approvedAmount.toLocaleString()} FCFA</p>
                          </div>
                        )}
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Durée demandée</p>
                          <p className="font-bold text-blue-600">{decision.requestedDuration} mois</p>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Temps de traitement</p>
                          <p className={`font-bold ${getProcessingTimeColor(decision.processingTime)}`}>
                            {decision.processingTime} jour{decision.processingTime > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Détails de la décision */}
                      {decision.decision === 'approved' && decision.interestRate && (
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-green-800 mb-2">Conditions d'approbation</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-green-700">Taux d'intérêt: </span>
                              <span className="font-medium">{decision.interestRate}%</span>
                            </div>
                            <div>
                              <span className="text-green-700">Durée approuvée: </span>
                              <span className="font-medium">{decision.approvedDuration} mois</span>
                            </div>
                          </div>
                          {decision.conditions && (
                            <div className="mt-2">
                              <span className="text-green-700">Conditions: </span>
                              <span className="text-green-800">{decision.conditions}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {decision.decision === 'rejected' && decision.rejectionReason && (
                        <div className="bg-red-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-red-800 mb-2">Motif de rejet</h4>
                          <p className="text-red-700 text-sm">{decision.rejectionReason}</p>
                        </div>
                      )}

                      {decision.decision === 'transferred' && decision.transferReason && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-800 mb-2">Motif de transfert</h4>
                          <p className="text-blue-700 text-sm">{decision.transferReason}</p>
                        </div>
                      )}

                      {/* Notes du superviseur */}
                      {decision.supervisorNotes && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                            <MessageSquare className="mr-1" size={16} />
                            Notes du superviseur
                          </h4>
                          <p className="text-gray-700 text-sm">{decision.supervisorNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 lg:text-right">
                      <div className="flex lg:flex-col items-center lg:items-end gap-2">
                        <GlassButton 
                          size="sm" 
                          className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Eye className="mr-1" size={14} />
                          Voir dossier
                        </GlassButton>
                        
                        <GlassButton 
                          variant="outline" 
                          size="sm"
                          className="w-full lg:w-auto"
                        >
                          <Download className="mr-1" size={14} />
                          Rapport
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-600 text-lg mb-4">Aucune décision trouvée</p>
                <p className="text-gray-500">Essayez de modifier les filtres de recherche</p>
              </div>
            )}
          </div>
          
          {filteredDecisions.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              {filteredDecisions.length} décision(s) trouvée(s) sur {mockDecisionHistory.length} au total
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default DecisionHistoryPage;