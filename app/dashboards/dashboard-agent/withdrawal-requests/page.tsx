'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  ArrowDown,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  X,
  Check,
  Ban,
  Wallet,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Interface pour les demandes de retrait
interface DemandeRetrait {
  id: number;
  clientId: string;
  clientName: string;
  telephone: string;
  tontine: {
    id: string;
    name: string;
    type: string;
  };
  montantDemande: number;
  soldeClient: number;
  numeroMobileMoney: string;
  operateurMM: 'MTN' | 'Moov';
  datedemande: string;
  status: 'en_attente' | 'approuve' | 'rejete';
  notes?: string;
  raison?: string;
  fondsSFDDisponibles: number;
}

// Données mockées pour les demandes de retrait
const demandesRetrait: DemandeRetrait[] = [
  {
    id: 1,
    clientId: "CLI001",
    clientName: "Fatoumata SAGNA",
    telephone: "+229 97 11 22 33",
    tontine: {
      id: "TON001",
      name: "Tontine ALAFIA",
      type: "Épargne"
    },
    montantDemande: 15000,
    soldeClient: 25000,
    numeroMobileMoney: "+229 97 11 22 33",
    operateurMM: "MTN",
    datedemande: "2025-06-20T10:30:00Z",
    status: "en_attente",
    fondsSFDDisponibles: 150000
  },
  {
    id: 2,
    clientId: "CLI002",
    clientName: "Mariam TRAORE",
    telephone: "+229 96 44 55 66",
    tontine: {
      id: "TON002",
      name: "Tontine Entrepreneures",
      type: "Crédit"
    },
    montantDemande: 8000,
    soldeClient: 12000,
    numeroMobileMoney: "+229 96 44 55 66",
    operateurMM: "Moov",
    datedemande: "2025-06-19T15:45:00Z",
    status: "en_attente",
    notes: "Client prioritaire - traitement urgent",
    fondsSFDDisponibles: 45000
  },
  {
    id: 3,
    clientId: "CLI003",
    clientName: "Aissatou BARRY",
    telephone: "+229 95 77 88 99",
    tontine: {
      id: "TON001",
      name: "Tontine ALAFIA",
      type: "Épargne"
    },
    montantDemande: 5000,
    soldeClient: 45000,
    numeroMobileMoney: "+229 95 77 88 99",
    operateurMM: "MTN",
    datedemande: "2025-06-18T09:15:00Z",
    status: "en_attente",
    fondsSFDDisponibles: 150000
  }
];

const AgentSFDRetraitsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState<DemandeRetrait | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [fondsSFDTotal, setFondsSFDTotal] = useState(185000);

  // Filtrage des demandes
  const filteredDemandes = demandesRetrait.filter(demande => {
    const searchMatch = demande.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.telephone.includes(searchTerm) ||
      demande.tontine.name.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus === "all" || demande.status === filterStatus;

    return searchMatch && statusMatch;
  });

  const handleApproveRetrait = (demande: DemandeRetrait) => {
    console.log(`Approbation retrait pour ${demande.clientName} - Montant: ${demande.montantDemande} FCFA`);
    // Ici vous ajouteriez la logique pour approuver le retrait
    // API call, vérification fonds, etc.
  };

  const handleRejectRetrait = (demande: DemandeRetrait, raison: string) => {
    console.log(`Rejet retrait pour ${demande.clientName}. Raison: ${raison}`);
    // Ici vous ajouteriez la logique pour rejeter le retrait
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleViewDetails = (demande: DemandeRetrait) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const handleRejectClick = (demande: DemandeRetrait) => {
    setSelectedDemande(demande);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'approuve':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejete':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getOperatorColor = (operateur: string) => {
    return operateur === 'MTN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
  };

  const canApprove = (demande: DemandeRetrait) => {
    return demande.soldeClient >= demande.montantDemande &&
      demande.fondsSFDDisponibles >= demande.montantDemande;
  };

  const getValidationStatus = (demande: DemandeRetrait) => {
    if (demande.fondsSFDDisponibles < demande.montantDemande) {
      return {
        valid: false,
        message: "Fonds SFD insuffisants",
        icon: <AlertTriangle className="text-red-600" size={16} />,
        bgClass: "bg-red-50 border-red-200",
        textClass: "text-red-700"
      };
    }

    return {
      valid: true,
      message: "Retrait autorisé",
      icon: <CheckCircle className="text-green-600" size={16} />,
      bgClass: "bg-green-50 border-green-200",
      textClass: "text-green-700"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes de retrait</h1>
            <p className="text-gray-600">Gérez les demandes de retrait de votre SFD</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Actualiser fonds
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Exporter
            </GlassButton>
          </div>
        </div>

        {/* Statistiques et fonds disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {demandesRetrait.filter(d => d.status === 'en_attente').length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">42</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-xl font-bold text-blue-600">
                  {demandesRetrait.reduce((sum, d) => sum + (d.status === 'en_attente' ? d.montantDemande : 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <TrendingDown className="text-blue-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fonds SFD</p>
                <p className="text-xl font-bold text-purple-600">
                  {fondsSFDTotal.toLocaleString()}
                  <button
                    title="Actualiser les fonds"
                    onClick={async () => {
                      // Simule une requête API pour obtenir le nouveau montant
                      // Remplace ce setTimeout par un appel API réel si besoin
                      const nouveauMontant = Math.floor(180000 + Math.random() * 20000);
                      setFondsSFDTotal(nouveauMontant);
                    }}
                    className="ml-2 inline-flex items-center rounded-full bg-white border border-purple-200 px-2 py-0.5 text-xs text-purple-600 hover:bg-purple-50 transition"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Actualiser
                  </button>
                </p>
                <p className="text-xs text-gray-500">FCFA disponibles</p>
              </div>
              <Wallet className="text-purple-600" size={24} />
            </div>
          </GlassCard>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Rechercher par nom, téléphone, tontine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-white/60">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="approuve">Approuvées</SelectItem>
                <SelectItem value="rejete">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tableau des demandes de retrait */}
        <div className="overflow-x-auto mb-8 w-full">
          <table className="min-w-[1100px] w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 text-left">Client</th>
                <th className="px-2 py-2 text-left">Téléphone</th>
                <th className="px-2 py-2 text-left">Tontine</th>
                <th className="px-2 py-2 text-left">Montant</th>
                <th className="px-2 py-2 text-left">Opérateur</th>
                <th className="px-2 py-2 text-left">Date</th>
                <th className="px-2 py-2 text-center">Statut</th>
                <th className="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-gray-400 py-6">
                    <ArrowDown className="mx-auto mb-2 text-gray-300" size={36} />
                    <div>Aucune demande de retrait trouvée</div>
                    <div className="text-xs text-gray-500">Essayez de modifier vos filtres de recherche</div>
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((demande) => {
                  const validationStatus = getValidationStatus(demande);
                  return (
                    <tr key={demande.id}
                      className={cn("bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 transition-all hover:shadow-md")}
                    >
                      <td className="px-2 py-2 font-semibold text-gray-900 align-middle">{demande.clientName}</td>
                      <td className="px-2 py-2 text-gray-700 align-middle">{demande.telephone}</td>
                      <td className="px-2 py-2 text-gray-700 align-middle">{demande.tontine.name}</td>
                      <td className="px-2 py-2 text-green-700 align-middle font-bold">{demande.montantDemande.toLocaleString()} FCFA</td>
                      <td className="px-2 py-2 text-gray-700 align-middle">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getOperatorColor(demande.operateurMM))}>{demande.operateurMM}</span>
                      </td>
                      <td className="px-2 py-2 text-gray-700 align-middle">{format(new Date(demande.datedemande), 'dd/MM/yyyy HH:mm', { locale: fr })}</td>
                      <td className="px-2 py-2 text-center align-middle">
                        <span className={cn("px-3 py-1 text-nowrap rounded-full text-xs font-medium border", getStatusBadge(demande.status))}>
                          {demande.status === 'en_attente' ? 'En attente' :
                            demande.status === 'approuve' ? 'Approuvée' : 'Rejetée'}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="flex items-center gap-2 justify-center">
                          <GlassButton size="sm" variant="outline" onClick={() => handleViewDetails(demande)}>
                            <Eye size={16} className="mr-1" />
                          </GlassButton>
                          {demande.status === 'en_attente' && (
                            <>
                              <GlassButton
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveRetrait(demande)}
                                disabled={!canApprove(demande)}
                              >
                                <CheckCircle size={16} className="mr-1" />
                              </GlassButton>
                              <GlassButton
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleRejectClick(demande)}
                              >
                                <Ban size={16} className="mr-1" />
                              </GlassButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal détails */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Détails de la demande de retrait</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Client</label>
                    <p className="text-gray-900">{selectedDemande.clientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">ID Client</label>
                    <p className="text-gray-900">{selectedDemande.clientId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Téléphone</label>
                    <p className="text-gray-900">{selectedDemande.telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Tontine</label>
                    <p className="text-gray-900">{selectedDemande.tontine.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Montant demandé</label>
                    <p className="text-gray-900 font-bold">{selectedDemande.montantDemande.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Solde disponible</label>
                    <p className="text-gray-900">{selectedDemande.soldeClient.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Numéro Mobile Money</label>
                    <p className="text-gray-900">{selectedDemande.numeroMobileMoney}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Opérateur</label>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                      getOperatorColor(selectedDemande.operateurMM))}>
                      {selectedDemande.operateurMM}
                    </span>
                  </div>
                </div>
                {selectedDemande && (() => {
                  const validationStatus = getValidationStatus(selectedDemande);
                  return (
                    <div className={cn("mt-1 px-2 py-2 rounded mb-10 text-xs flex items-center gap-1 justify-center", validationStatus.bgClass, validationStatus.textClass)}>
                      {validationStatus.icon}
                      <span>{validationStatus.message}</span>
                    </div>
                  );
                })()}

                <div className="flex gap-3">
                  <GlassButton
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveRetrait(selectedDemande);
                      setShowModal(false);
                    }}
                    disabled={!canApprove(selectedDemande)}
                  >
                    <Check size={16} className="mr-2" />
                    Approuver le retrait
                  </GlassButton>

                  <GlassButton
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setShowModal(false);
                      handleRejectClick(selectedDemande);
                    }}
                  >
                    <Ban size={16} className="mr-2" />
                    Rejeter
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal rejet */}
        {showRejectModal && selectedDemande && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Rejeter la demande</h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Vous êtes sur le point de rejeter la demande de retrait de <strong>{selectedDemande.clientName}</strong>
                  pour un montant de <strong>{selectedDemande.montantDemande.toLocaleString()} FCFA</strong>.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raison du rejet</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner une raison</option>
                    <option value="fonds_sfd_insuffisants">Fonds SFD insuffisants</option>
                    <option value="documents_non_conformes">Documents non conformes</option>
                    <option value="suspicious_activity">Activité suspecte</option>
                    <option value="autre">Autre raison</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <GlassButton
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleRejectRetrait(selectedDemande, rejectReason)}
                    disabled={!rejectReason}
                  >
                    Confirmer le rejet
                  </GlassButton>

                  <GlassButton
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Annuler
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

export default AgentSFDRetraitsPage;