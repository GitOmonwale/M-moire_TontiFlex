// app/dashboard-sfd-admin/loans/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  DollarSign, 
  User, 
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Download,
  TrendingUp,
  Shield,
  Star,
  MoreVertical,
  MessageSquare,
  Phone,
  Mail,
  Building,
  MapPin,
  Briefcase,
  ChevronRight,
  History,
  Target,
  Award,
  FileCheck,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLoansApplications } from '@/hooks/useLoansApplications';
import { LoanApplication, AdminDecisionData, RapportDemande } from '@/types/loans-applications';
import { Input } from '@heroui/react';

const AdminLoansValidation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [currentRapport, setCurrentRapport] = useState<RapportDemande | null>(null);
  const [loadingRapport, setLoadingRapport] = useState(false);
  const [decisionType, setDecisionType] = useState<'accorder' | 'rejeter' | null>(null);
  const [decisionComment, setDecisionComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const { 
    applications, 
    loading, 
    error, 
    fetchApplications, 
    adminDecision,
    fetchRapportAnalyse
  } = useLoansApplications();

  // Charger les demandes transférées à l'admin au montage du composant
  useEffect(() => {
    const loadApplications = async () => {
      try {
        await fetchApplications({ statut: 'transfere_admin' });
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
        toast.error('Erreur lors du chargement des demandes');
      }
    };
    
    loadApplications();
  }, []);

  // Fonction pour charger le rapport détaillé
  const handleViewRapport = async (application: LoanApplication) => {
    setSelectedLoan(application);
    setLoadingRapport(true);
    setShowRapportModal(true);
    
    try {
      const rapport = await fetchRapportAnalyse(application.id);
      setCurrentRapport(rapport);
    } catch (error) {
      console.error('Erreur lors du chargement du rapport:', error);
      toast.error('Erreur lors du chargement du rapport détaillé');
      setShowRapportModal(false);
    } finally {
      setLoadingRapport(false);
    }
  };

  // Filtrer les demandes selon les critères
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || app.type_pret === typeFilter;
    
    const montant = parseFloat(app.montant_souhaite);
    const matchesAmount = amountFilter === 'all' || 
      (amountFilter === 'small' && montant <= 50000) ||
      (amountFilter === 'medium' && montant > 50000 && montant <= 150000) ||
      (amountFilter === 'large' && montant > 150000);
    
    return matchesSearch && matchesType && matchesAmount;
  });

  // Gérer la décision de l'admin
  const handleAdminDecision = async () => {
    if (!selectedLoan || !decisionType) return;

    try {
      const decisionData: AdminDecisionData = {
        decision: decisionType,
        commentaires: decisionComment || undefined,
        raison_rejet: decisionType === 'rejeter' ? rejectReason : undefined
      };

      const result = await adminDecision(selectedLoan.id, decisionData);
      
      const action = decisionType === 'accorder' ? 'accordé' : 'rejeté';
      toast.success(`Prêt ${selectedLoan.id} ${action} avec succès!`);
      
      // Rafraîchir la liste
      await fetchApplications({ statut: 'transfere_admin' });
      
      // Fermer les modals
      setShowDecisionModal(false);
      setShowDetails(false);
      setDecisionComment('');
      setRejectReason('');
      
    } catch (error) {
      toast.error('Erreur lors de la validation');
      console.error('Erreur décision admin:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'transfere_admin':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
          <AlertTriangle size={12} />
          En attente validation
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {status}
        </span>;
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'consommation': 'Consommation',
      'immobilier': 'Immobilier',
      'professionnel': 'Professionnel',
      'urgence': 'Urgence'
    };
    return types[type as keyof typeof types] || type;
  };

  const getScoreColor = (score: string | number | undefined) => {
    if (!score) return 'text-gray-400';
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    if (numScore >= 85) return 'text-green-600';
    if (numScore >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toLocaleString('fr-FR') + ' FCFA';
  };

  // Composant pour afficher le rapport détaillé
  const RapportModal = () => {
    if (!showRapportModal || !selectedLoan) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto w-full">
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <FileCheck className="text-blue-600" size={24} />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Rapport d'Analyse Détaillé
                </h3>
                <p className="text-sm text-gray-600">
                  Demande {selectedLoan.id} - {selectedLoan.prenom} {selectedLoan.nom}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowRapportModal(false);
                setCurrentRapport(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          {loadingRapport ? (
            <div className="p-12 text-center">
              <Clock className="mx-auto mb-4 text-blue-500 animate-spin" size={48} />
              <p className="text-gray-600">Génération du rapport en cours...</p>
            </div>
          ) : currentRapport ? (
            <div className="p-6 space-y-6">
              
              {/* Informations générales de la demande */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-700">
                    <User size={16} />
                    Informations Demandeur
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom complet:</strong> {currentRapport.demande.prenom} {currentRapport.demande.nom}</div>
                    <div><strong>Téléphone:</strong> {currentRapport.demande.telephone}</div>
                    <div><strong>Email:</strong> {currentRapport.demande.email}</div>
                    <div><strong>Profession:</strong> {currentRapport.demande.situation_professionnelle}</div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                    <DollarSign size={16} />
                    Détails Financiers
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Montant demandé:</strong> {formatCurrency(currentRapport.demande.montant_souhaite)}</div>
                    <div><strong>Durée:</strong> {currentRapport.demande.duree_pret} mois</div>
                    <div><strong>Revenus:</strong> {formatCurrency(currentRapport.demande.revenu_mensuel)}/mois</div>
                    <div><strong>Ratio endettement:</strong> 
                      <span className={`ml-2 font-semibold ${parseFloat(currentRapport.demande.ratio_endettement) > 40 ? 'text-red-600' : 'text-green-600'}`}>
                        {currentRapport.demande.ratio_endettement}%
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-700">
                    <Award size={16} />
                    Score de Fiabilité
                  </h4>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(currentRapport.demande.score_fiabilite)}`}>
                      {currentRapport.demande.score_fiabilite || 'N/A'}/100
                    </div>
                    <div className="text-xs text-gray-600">
                      Score calculé automatiquement
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Détails du score de fiabilité */}
              {currentRapport.score_fiabilite_details && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-700">
                    <Target size={16} />
                    Détails du Score de Fiabilité
                  </h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(currentRapport.score_fiabilite_details, null, 2)}
                    </pre>
                  </div>
                </GlassCard>
              )}

              {/* Conditions de remboursement */}
              {currentRapport.conditions_remboursement && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                    <Calendar size={16} />
                    Conditions de Remboursement Proposées
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(currentRapport.conditions_remboursement, null, 2)}
                    </pre>
                  </div>
                </GlassCard>
              )}

              {/* Recommandations */}
              {currentRapport.recommandations && currentRapport.recommandations.length > 0 && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-700">
                    <Star size={16} />
                    Recommandations
                  </h4>
                  <div className="space-y-3">
                    {currentRapport.recommandations.map((rec, index) => (
                      <div key={index} className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                        <div className="flex items-start gap-2">
                          <Info size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <pre className="whitespace-pre-wrap text-gray-700">
                              {typeof rec === 'string' ? rec : JSON.stringify(rec, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Historique du workflow */}
              {currentRapport.historique_workflow && currentRapport.historique_workflow.length > 0 && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                    <History size={16} />
                    Historique du Traitement
                  </h4>
                  <div className="space-y-3">
                    {currentRapport.historique_workflow.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {typeof step === 'string' ? step : JSON.stringify(step, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Documents analysés */}
              {currentRapport.documents_analyses && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-teal-700">
                    <FileText size={16} />
                    Documents Analysés
                  </h4>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(currentRapport.documents_analyses, null, 2)}
                    </pre>
                  </div>
                </GlassCard>
              )}

              {/* Actions depuis le rapport */}
              <div className="border-t pt-4">
                <div className="flex gap-3 justify-end">
                  <GlassButton
                    variant="outline"
                    onClick={() => {
                      setShowRapportModal(false);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="mr-2" size={16} />
                    Voir Détails Complets
                  </GlassButton>
                  
                  <GlassButton
                    onClick={() => {
                      setShowRapportModal(false);
                      setDecisionType('accorder');
                      setShowDecisionModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Accorder ce Prêt
                  </GlassButton>
                  
                  <GlassButton
                    onClick={() => {
                      setShowRapportModal(false);
                      setDecisionType('rejeter');
                      setShowDecisionModal(true);
                    }}
                    className="border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    <XCircle className="mr-2" size={16} />
                    Rejeter ce Prêt
                  </GlassButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
              <p className="text-gray-600">Erreur lors du chargement du rapport</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto mb-4 text-gray-400 animate-spin" size={48} />
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Validation des Prêts</h1>
            <p className="text-gray-600">Demandes transférées par les superviseurs</p>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-4 text-center border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">En attente validation</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-green-500">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {applications.filter(app => app.type_pret === 'professionnel').length}
            </div>
            <div className="text-sm text-gray-600">Prêts professionnels</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-purple-500">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {applications.filter(app => app.type_pret === 'consommation').length}
            </div>
            <div className="text-sm text-gray-600">Prêts consommation</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-emerald-500">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {(applications.reduce((sum, app) => sum + parseFloat(app.montant_souhaite), 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Montant total (FCFA)</div>
          </GlassCard>
        </div>

        {/* Filtres et actions */}
        <div className="my-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher une demande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white/60 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36 bg-white/60">
                    <SelectValue placeholder="Type de prêt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="consommation">Consommation</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="immobilier">Immobilier</SelectItem>
                    <SelectItem value="urgence">Urgence</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={amountFilter} onValueChange={setAmountFilter}>
                  <SelectTrigger className="w-36 bg-white/60">
                    <SelectValue placeholder="Montant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous montants</SelectItem>
                    <SelectItem value="small">≤ 50K FCFA</SelectItem>
                    <SelectItem value="medium">50K - 150K FCFA</SelectItem>
                    <SelectItem value="large"> 150K FCFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <GlassButton variant="outline" size="sm" onClick={() => fetchApplications({ statut: 'transfere_admin' })}>
                <Filter className="mr-2" size={16} />
                Actualiser
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <GlassCard className="p-4 border-l-4 border-l-red-500">
            <div className="text-red-600 text-sm">{error}</div>
          </GlassCard>
        )}

        {/* Liste des demandes */}
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <GlassCard key={application.id} className="p-6" hover={false}>
              <div className="grid lg:grid-cols-4 gap-6">
                
                {/* Informations demandeur */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User size={16} className="text-emerald-600" />
                      {application.prenom} {application.nom}
                    </h3>
                    <div className="flex gap-2 text-xs text-nowrap">
                      {getStatusBadge(application.statut)}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={12} />
                      {application.telephone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} />
                      {application.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={12} />
                      {application.situation_professionnelle}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={12} />
                      {application.adresse_domicile}
                    </div>
                  </div>
                </div>

                {/* Détails de la demande */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-600" />
                    Demande de prêt
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(application.montant_souhaite)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span>{application.duree_pret} mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {getTypeLabel(application.type_pret)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <strong>Objet:</strong> {application.objet_pret}
                    </div>
                  </div>
                </div>

                {/* Évaluation financière */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    Situation financière
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Revenus:</span>
                      <span className="font-medium">
                        {formatCurrency(application.revenu_mensuel)}/mois
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Charges:</span>
                      <span className="font-medium">
                        {formatCurrency(application.charges_mensuelles)}/mois
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Ratio:</span>
                      <span className={`font-bold ${parseFloat(application.ratio_endettement) > 40 ? 'text-red-600' : 'text-green-600'}`}>
                        {application.ratio_endettement}%
                      </span>
                    </div>
                    {application.score_fiabilite && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className={`font-bold ${getScoreColor(application.score_fiabilite)}`}>
                          {application.score_fiabilite}/100
                        </span>
                      </div>
                    )}

                  </div>
                  <GlassButton
                    onClick={() => {
                      setShowRapportModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="mr-2" size={16} />
                    Voir rapport
                  </GlassButton>
                </div>

                {/* Actions et superviseur */}
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Superviseur:</div>
                    <div className="font-medium">{application.superviseur_examinateur || 'Non assigné'}</div>
                    <div className="text-xs text-gray-500">
                      Transféré le {application.date_transfert_admin ? 
                        format(new Date(application.date_transfert_admin), 'dd/MM/yyyy à HH:mm', { locale: fr })
                      : 'N/A'
                      }
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <GlassButton
                      size="sm"
                      onClick={() => {
                        setSelectedLoan(application);
                        setShowDetails(true);
                      }}
                      className="w-full"
                    >
                      <Eye className="mr-2" size={14} />
                      Voir détails
                    </GlassButton>
                    
                    <div className="flex gap-2">
                      <GlassButton
                        size="sm"
                        onClick={() => {
                          setSelectedLoan(application);
                          setDecisionType('accorder');
                          setShowDecisionModal(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-1" size={14} />
                        Accorder
                      </GlassButton>
                      
                      <GlassButton
                        size="sm"
                        onClick={() => {
                          setSelectedLoan(application);
                          setDecisionType('rejeter');
                          setShowDecisionModal(true);
                        }}
                        className="flex-1 border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        <XCircle className="mr-1" size={14} />
                        Rejeter
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Message si aucune demande */}
        {filteredApplications.length === 0 && !loading && (
          <GlassCard className="p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-2">Aucune demande en attente de validation</p>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || amountFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Toutes les demandes ont été traitées'
              }
            </p>
          </GlassCard>
        )}

        {/* Modal de détails */}
        {showDetails && selectedLoan && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  Détails de la demande {selectedLoan.id}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Informations personnelles */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User size={16} />
                      Informations personnelles
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom complet:</strong> {selectedLoan.prenom} {selectedLoan.nom}</div>
                      <div><strong>Date de naissance:</strong> {selectedLoan.date_naissance ? format(new Date(selectedLoan.date_naissance), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</div>
                      <div><strong>Situation familiale:</strong> {selectedLoan.situation_familiale}</div>
                      <div><strong>Téléphone:</strong> {selectedLoan.telephone}</div>
                      <div><strong>Email:</strong> {selectedLoan.email}</div>
                      <div><strong>Adresse domicile:</strong> {selectedLoan.adresse_domicile}</div>
                      {selectedLoan.adresse_bureau && (
                        <div><strong>Adresse bureau:</strong> {selectedLoan.adresse_bureau}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Informations professionnelles */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase size={16} />
                      Situation professionnelle
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Profession:</strong> {selectedLoan.situation_professionnelle}</div>
                      <div><strong>Revenus mensuels:</strong> {formatCurrency(selectedLoan.revenu_mensuel)}</div>
                      <div><strong>Charges mensuelles:</strong> {formatCurrency(selectedLoan.charges_mensuelles)}</div>
                      <div><strong>Ratio endettement:</strong> 
                        <span className={`ml-2 font-semibold ${parseFloat(selectedLoan.ratio_endettement) > 40 ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedLoan.ratio_endettement}%
                        </span>
                      </div>
                      {selectedLoan.historique_prets_anterieurs && (
                        <div><strong>Historique prêts:</strong> {selectedLoan.historique_prets_anterieurs}</div>
                      )}
                    </div>
                  </div>

                  {/* Détails de la demande */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign size={16} />
                      Détails de la demande
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Montant demandé:</strong> {formatCurrency(selectedLoan.montant_souhaite)}</div>
                      <div><strong>Durée:</strong> {selectedLoan.duree_pret} mois</div>
                      <div><strong>Type de prêt:</strong> {getTypeLabel(selectedLoan.type_pret)}</div>
                      <div><strong>Objet:</strong> {selectedLoan.objet_pret}</div>
                      <div><strong>Type de garantie:</strong> {selectedLoan.type_garantie}</div>
                      <div><strong>Détails garantie:</strong> {selectedLoan.details_garantie}</div>
                      {selectedLoan.score_fiabilite && (
                        <div><strong>Score de fiabilité:</strong> 
                          <span className={`ml-2 font-semibold ${getScoreColor(selectedLoan.score_fiabilite)}`}>
                            {selectedLoan.score_fiabilite}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Commentaires du superviseur */}
                {selectedLoan.commentaires_superviseur && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare size={16} />
                      Commentaires du superviseur
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedLoan.commentaires_superviseur}
                    </p>
                  </div>
                )}

                {/* Plan d'affaires si disponible */}
                {selectedLoan.plan_affaires && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Building size={16} />
                      Plan d'affaires
                    </h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                      {selectedLoan.plan_affaires}
                    </p>
                  </div>
                )}
                
                {/* Actions dans le modal */}
                <div className="mt-6 pt-4 border-t flex gap-3">
                  <GlassButton
                    onClick={() => {
                      setDecisionType('accorder');
                      setShowDecisionModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Accorder ce prêt
                  </GlassButton>
                  
                  <GlassButton
                    variant="outline"
                    onClick={() => {
                      setDecisionType('rejeter');
                      setShowDecisionModal(true);
                    }}
                    className="border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    <XCircle className="mr-2" size={16} />
                    Rejeter ce prêt
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de décision */}
        {showDecisionModal && selectedLoan && decisionType && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {decisionType === 'accorder' ? 'Accorder le prêt' : 'Rejeter le prêt'}
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Demande: <strong>{selectedLoan.id}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Demandeur: <strong>{selectedLoan.prenom} {selectedLoan.nom}</strong>
                  </p>
                </div>
                <Input
                  type="number"
                  // value={montantAccorde}
                  // onChange={(e) => setMontantAccorde(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Montant accordé"
                  required
                />

                {decisionType === 'rejeter' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raison du rejet *
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Expliquez la raison du rejet..."
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaires additionnels
                  </label>
                  <textarea
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                    placeholder="Ajoutez des commentaires (optionnel)..."
                  />
                </div>

                <div className="flex gap-3">
                  <GlassButton
                    onClick={handleAdminDecision}
                    disabled={decisionType === 'rejeter' && !rejectReason.trim()}
                    className={`flex-1 ${
                      decisionType === 'accorder' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {decisionType === 'accorder' ? 'Accorder ce prêt' : 'Rejeter ce prêt'}
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminLoansValidation;