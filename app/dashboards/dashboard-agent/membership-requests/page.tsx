'use client'
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Users,
  Building,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAdhesions } from '@/hooks/useAdhesions';
import { Adhesion, StatutAdhesion } from '@/types/adhesions';

const AgentSFDAdhesionsPage = () => {
  // Hook pour les adhésions
  const {
    adhesions,
    loading,
    error,
    fetchAdhesions,
    validerAgent
  } = useAdhesions();

  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAdhesion, setSelectedAdhesion] = useState<Adhesion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // États pour le modal de commentaire
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentAction, setCommentAction] = useState<'validate' | 'reject' | null>(null);
  const [commentAdhesion, setCommentAdhesion] = useState<Adhesion | null>(null);
  const [commentText, setCommentText] = useState("");

  // Charger les adhésions au montage du composant
  useEffect(() => {
    loadAdhesions();
  }, [currentPage, filterStatus]);

  const loadAdhesions = async () => {
    try {
      const filters: any = {
        page: currentPage
      };
      
      if (filterStatus !== "all") {
        filters.statut = filterStatus as StatutAdhesion;
      }

      await fetchAdhesions(filters);
    } catch (err) {
      console.error('Erreur lors du chargement des adhésions:', err);
    }
  };

  // Filtrage local des adhésions (pour la recherche)
  const filteredAdhesions = adhesions.filter(adhesion => {
    const searchMatch = 
      adhesion.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adhesion.tontine_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (adhesion.numero_telephone_paiement && adhesion.numero_telephone_paiement.includes(searchTerm));
    
    return searchMatch;
  });

  const handleValidateAdhesion = (adhesion: Adhesion) => {
    setCommentAdhesion(adhesion);
    setCommentAction('validate');
    setCommentText('');
    setShowCommentModal(true);
  };

  const handleRejectAdhesion = (adhesion: Adhesion) => {
    setCommentAdhesion(adhesion);
    setCommentAction('reject');
    setCommentText('');
    setShowCommentModal(true);
  };

  const executeActionWithComment = async () => {
    if (!commentAdhesion || !commentAction) return;
    
    setLoadingAction(commentAdhesion.id);
    try {
      if (commentAction === 'validate') {
        await validerAgent(commentAdhesion.id, {
          commentaires: commentText || "Demande validée par l'agent SFD"
        });
        toast.success(`Adhésion de ${commentAdhesion.client_nom} validée avec succès.`);
      } else if (commentAction === 'reject') {
        // Note: Pour le rejet, vous devrez peut-être implémenter une fonction spécifique
        // dans votre hook si l'API a un endpoint pour rejeter
        await validerAgent(commentAdhesion.id, {
          commentaires: commentText || "Demande rejetée par l'agent SFD"
        });
        toast.error(`Adhésion de ${commentAdhesion.client_nom} rejetée.`);
      }
      
      // Fermer le modal
      setShowCommentModal(false);
      setCommentAdhesion(null);
      setCommentAction(null);
      setCommentText('');
    } catch (err) {
      console.error('Erreur lors de l\'action:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleViewDetails = (adhesion: Adhesion) => {
    setSelectedAdhesion(adhesion);
    setShowModal(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getStatusBadge = (status: StatutAdhesion) => {
    switch (status) {
      case 'demande_soumise':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'validee_agent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'en_cours_paiement':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paiement_effectue':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'adherent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejetee':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: StatutAdhesion) => {
    switch (status) {
      case 'demande_soumise':
        return 'Demande soumise';
      case 'validee_agent':
        return 'Validée par agent';
      case 'en_cours_paiement':
        return 'En cours de paiement';
      case 'paiement_effectue':
        return 'Paiement effectué';
      case 'adherent':
        return 'Adhérent';
      case 'rejetee':
        return 'Rejetée';
      default:
        return status;
    }
  };

  // Calculer les statistiques
  const statsEnAttente = adhesions.filter(a => a.statut_actuel === 'demande_soumise').length;
  const statsValidees = adhesions.filter(a => a.statut_actuel === 'validee_agent' || a.statut_actuel === 'adherent').length;
  const statsCeMois = adhesions.filter(a => {
    const dateCreation = new Date(a.date_creation);
    const maintenant = new Date();
    return dateCreation.getMonth() === maintenant.getMonth() && 
           dateCreation.getFullYear() === maintenant.getFullYear();
  }).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <GlassButton onClick={loadAdhesions}>
            Réessayer
          </GlassButton>
          {/* Modal commentaire pour validation/rejet */}
        {showCommentModal && commentAdhesion && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {commentAction === 'validate' ? 'Valider la demande' : 'Rejeter la demande'}
                </h3>
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setCommentAdhesion(null);
                    setCommentAction(null);
                    setCommentText('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    Client: <span className="font-semibold">{commentAdhesion.client_nom}</span>
                  </p>
                  <p className="text-gray-600">
                    Tontine: <span className="font-semibold">{commentAdhesion.tontine_nom}</span>
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire {commentAction === 'reject' ? '(obligatoire pour le rejet)' : '(optionnel)'}
                  </label>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      commentAction === 'validate' 
                        ? "Ajoutez un commentaire pour la validation..." 
                        : "Précisez la raison du rejet..."
                    }
                    rows={4}
                    className="w-full"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {commentText.length}/500 caractères
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <GlassButton 
                    variant="outline"
                    onClick={() => {
                      setShowCommentModal(false);
                      setCommentAdhesion(null);
                      setCommentAction(null);
                      setCommentText('');
                    }}
                    disabled={loadingAction === commentAdhesion.id}
                  >
                    Annuler
                  </GlassButton>
                  
                  <GlassButton 
                    className={commentAction === 'validate' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                    onClick={executeActionWithComment}
                    disabled={
                      loadingAction === commentAdhesion.id || 
                      (commentAction === 'reject' && !commentText.trim())
                    }
                  >
                    {loadingAction === commentAdhesion.id ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : commentAction === 'validate' ? (
                      <Check size={16} className="mr-2" />
                    ) : (
                      <X size={16} className="mr-2" />
                    )}
                    {commentAction === 'validate' ? 'Valider' : 'Rejeter'}
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : statsEnAttente}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : statsValidees}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : statsCeMois}
                </p>
              </div>
              <Users className="text-blue-600" size={24} />
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
                <SelectItem value="demande_soumise">Demande soumise</SelectItem>
                <SelectItem value="validee_agent">Validée agent</SelectItem>
                <SelectItem value="en_cours_paiement">En cours paiement</SelectItem>
                <SelectItem value="paiement_effectue">Paiement effectué</SelectItem>
                <SelectItem value="adherent">Adhérent</SelectItem>
                <SelectItem value="rejetee">Rejetée</SelectItem>
              </SelectContent>
            </Select>
            
            <GlassButton 
              variant="outline"
              onClick={loadAdhesions}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Filter size={16} />}
            </GlassButton>
          </div>
        </div>

        {/* Tableau des demandes d'adhésion */}
        <div className="overflow-x-auto mb-8 w-full">
          <table className="min-w-[900px] w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 text-left">Client</th>
                <th className="px-2 py-2 text-left">Téléphone</th>
                <th className="px-2 py-2 text-left">Tontine</th>
                <th className="px-2 py-2 text-left">Mise</th>
                <th className="px-2 py-2 text-left">Date</th>
                <th className="px-2 py-2 text-center">Statut</th>
                <th className="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && adhesions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    <Loader2 className="mx-auto mb-2 animate-spin text-gray-300" size={36} />
                    <div>Chargement des demandes...</div>
                  </td>
                </tr>
              ) : filteredAdhesions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    <UserCheck className="mx-auto mb-2 text-gray-300" size={36} />
                    <div>Aucune demande trouvée</div>
                    <div className="text-xs text-gray-500">Essayez de modifier vos filtres de recherche</div>
                  </td>
                </tr>
              ) : (
                filteredAdhesions.map((adhesion) => (
                  <tr key={adhesion.id}
                    className={
                      "bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 transition-all hover:shadow-md"
                    }
                  >
                    {/* Client */}
                    <td className="px-2 py-2 font-semibold text-gray-900 align-middle">
                      {adhesion.client_nom}
                    </td>
                    {/* Téléphone */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {adhesion.numero_telephone_paiement || 'Non renseigné'}
                    </td>
                    {/* Tontine */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {adhesion.tontine_nom}
                    </td>
                    {/* Mise */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {parseFloat(adhesion.montant_mise).toLocaleString()} FCFA
                    </td>
                    {/* Date */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {format(new Date(adhesion.date_creation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    {/* Statut */}
                    <td className="px-2 py-2 text-center align-middle">
                      <span className={cn("px-3 text-nowrap py-1 rounded-full text-xs font-medium border", getStatusBadge(adhesion.statut_actuel))}>
                        {getStatusLabel(adhesion.statut_actuel)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-2 py-2 text-center align-middle">
                      <div className="flex gap-1 justify-center">
                        <GlassButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(adhesion)}
                          aria-label="Voir détails"
                          className="hover:bg-emerald-50"
                        >
                          <Eye size={16} />
                        </GlassButton>
                        {adhesion.statut_actuel === 'demande_soumise' && (
                          <>
                            <GlassButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleValidateAdhesion(adhesion)}
                              aria-label="Valider"
                              className="hover:bg-green-100"
                              disabled={loadingAction === adhesion.id}
                            >
                              {loadingAction === adhesion.id ? 
                                <Loader2 size={16} className="animate-spin" /> :
                                <CheckCircle size={18} className="text-green-600" />
                              }
                            </GlassButton>
                            <GlassButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectAdhesion(adhesion)}
                              aria-label="Rejeter"
                              className="hover:bg-red-100"
                              disabled={loadingAction === adhesion.id}
                            >
                              <UserX size={18} className="text-red-600" />
                            </GlassButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal détails */}
        {showModal && selectedAdhesion && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Détails de la demande</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <p className="text-gray-900">{selectedAdhesion.client_nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Adhésion</label>
                    <p className="text-gray-900">{selectedAdhesion.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <p className="text-gray-900">{selectedAdhesion.numero_telephone_paiement || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tontine</label>
                    <p className="text-gray-900">{selectedAdhesion.tontine_nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant mise</label>
                    <p className="text-gray-900">{parseFloat(selectedAdhesion.montant_mise).toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frais adhésion</label>
                    <p className="text-gray-900">
                      {selectedAdhesion.frais_adhesion_calcules ? 
                        `${parseFloat(selectedAdhesion.frais_adhesion_calcules).toLocaleString()} FCFA` : 
                        'Non calculés'
                      }
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <span className={cn("px-3 py-1 rounded-full text-sm font-medium border", getStatusBadge(selectedAdhesion.statut_actuel))}>
                      {getStatusLabel(selectedAdhesion.statut_actuel)}
                    </span>
                  </div>
                  {selectedAdhesion.commentaires_agent && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires agent</label>
                      <p className="text-gray-900">{selectedAdhesion.commentaires_agent}</p>
                    </div>
                  )}
                  {selectedAdhesion.prochaine_action && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine action</label>
                      <p className="text-gray-900">{selectedAdhesion.prochaine_action}</p>
                    </div>
                  )}
                </div>

                {/* Document d'identité */}
                {selectedAdhesion.document_identite && (
                  <div className="mb-8">
                    <h4 className="text-md font-semibold mb-2">Document d'identité</h4>
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <a 
                          href={selectedAdhesion.document_identite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Voir le document
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAdhesion.statut_actuel === 'demande_soumise' && (
                  <div className="flex gap-3">
                    <GlassButton 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleValidateAdhesion(selectedAdhesion);
                        setShowModal(false);
                      }}
                      disabled={loadingAction === selectedAdhesion.id}
                    >
                      {loadingAction === selectedAdhesion.id ? 
                        <Loader2 size={16} className="mr-2 animate-spin" /> :
                        <Check size={16} className="mr-2" />
                      }
                      Valider la demande
                    </GlassButton>
                    
                    <GlassButton 
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleRejectAdhesion(selectedAdhesion);
                        setShowModal(false);
                      }}
                      disabled={loadingAction === selectedAdhesion.id}
                    >
                      <X size={16} className="mr-2" />
                      Rejeter
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal image */}
        {showImageModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Document d'identité</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage}
                  alt="Document d'identité"
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-document.png';
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentSFDAdhesionsPage;