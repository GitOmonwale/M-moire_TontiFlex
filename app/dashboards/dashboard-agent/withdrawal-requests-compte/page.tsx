'use client'
import { useEffect, useState } from 'react';
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
import { useSavingsTransactions } from '@/hooks/useTransactions';
import { SavingsTransaction } from '@/types/transactions';


const AgentSFDRetraitsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState<SavingsTransaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [fondsSFDTotal, setFondsSFDTotal] = useState(185000);
const {fetchSavingsTransactions, savingsTransactions,} = useSavingsTransactions();
useEffect(() => {
  fetchSavingsTransactions();
  console.log("savingsTransactions",savingsTransactions);
}, []);
  // Filtrage des demandes
  const filteredDemandes = savingsTransactions.filter(demande => {
    const searchMatch = demande.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.telephone.includes(searchTerm) ||
      demande.compte_epargne.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus === "all" || demande.statut === filterStatus;

    return searchMatch && statusMatch;
  });

  const handleApproveRetrait = (demande: SavingsTransaction) => {
    console.log(`Approbation retrait pour ${demande.client_nom} - Montant: ${demande.montant} FCFA`);
    // Ici vous ajouteriez la logique pour approuver le retrait
    // API call, vérification fonds, etc.
  };

  const handleRejectRetrait = (demande: SavingsTransaction, raison: string) => {
    console.log(`Rejet retrait pour ${demande.client_nom}. Raison: ${raison}`);
    // Ici vous ajouteriez la logique pour rejeter le retrait
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleViewDetails = (demande: SavingsTransaction) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const handleRejectClick = (demande: SavingsTransaction) => {
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

  const getValidationStatus = (demande: SavingsTransaction) => {
    if (fondsSFDTotal < Number(demande.montant)) {
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques et fonds disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {savingsTransactions.filter(d => d.statut === 'en_cours').length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">
                  {savingsTransactions.filter(d => d.statut === 'annulee').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-xl font-bold text-blue-600">
                  {savingsTransactions.reduce((sum, d) => sum + (d.statut === 'confirmee' ? Number(d.montant) : 0), 0).toLocaleString()}
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
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="confirmee">Confirmées</SelectItem>
                <SelectItem value="echouee">Rejetées</SelectItem>
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
                      <td className="px-2 py-2 font-semibold text-gray-900 align-middle">{demande.client_nom} {demande.client_prenom}</td>
                      <td className="px-2 py-2 text-gray-700 align-middle">{demande.telephone}</td>
                      <td className="px-2 py-2 text-gray-700 align-middle">{demande.compte_epargne}</td>
                      <td className="px-2 py-2 text-green-700 align-middle font-bold">{demande.montant.toLocaleString()} FCFA</td>
                      <td className="px-2 py-2 text-center align-middle">
                        <span className={cn("px-3 py-1 text-nowrap rounded-full text-xs font-medium border", getStatusBadge(demande.statut))}>
                          {demande.statut === 'en_cours' ? 'En cours' :
                            demande.statut === 'confirmee' ? 'Confirmée' : 'Rejetée'}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="flex items-center gap-2 justify-center">
                          <GlassButton size="sm" variant="outline" onClick={() => handleViewDetails(demande)}>
                            <Eye size={16} className="mr-1" />
                          </GlassButton>
                          {demande.statut === 'en_cours' && (
                            <>
                              <GlassButton
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveRetrait(demande)}
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
                    <p className="text-gray-900">{selectedDemande.client_nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">ID Client</label>
                    <p className="text-gray-900">{selectedDemande.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Téléphone</label>
                    <p className="text-gray-900">{selectedDemande.telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Tontine</label>
                    <p className="text-gray-900">{selectedDemande.compte_epargne}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Montant demandé</label>
                    <p className="text-gray-900 font-bold">{selectedDemande.montant.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Numéro Mobile Money</label>
                    <p className="text-gray-900">{selectedDemande.telephone}</p>
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
                  Vous êtes sur le point de rejeter la demande de retrait de <strong>{selectedDemande.client_nom}</strong>
                  pour un montant de <strong>{selectedDemande.montant.toLocaleString()} FCFA</strong>.
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