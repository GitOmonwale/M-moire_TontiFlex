'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  PiggyBank,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  X,
  Check,
  Ban,
  DollarSign,
  Plus,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
// Interface pour les demandes de comptes épargne
interface DemandeCompteEpargne {
  id: number;
  clientId: string;
  clientName: string;
  telephone: string;
  email?: string;
  adresse: string;
  profession: string;
  datedemande: string;
  documents: {
    pieceIdentiteRecto: string;
    pieceIdentiteVerso: string;
    photoIdentite: string;
    type: string;
  };
  status: 'en_attente' | 'valide' | 'rejete';
  priorite: 'normale' | 'urgente';
  notes?: string;
  fraisCreation: number;
  compteUtilisateurExist: boolean;
}

// Données mockées pour les demandes de comptes épargne
const demandesCompteEpargne: DemandeCompteEpargne[] = [
  {
    id: 1,
    clientId: "CLI001",
    clientName: "Aicha BARRY",
    telephone: "+229 97 33 44 55",
    email: "aicha.barry@email.com",
    adresse: "Quartier Zongo, Cotonou",
    profession: "Couturière",
    datedemande: "2025-06-20T09:15:00Z",
    documents: {
      pieceIdentiteRecto: "CNI_111_recto.jpg",
      pieceIdentiteVerso: "CNI_111_verso.jpg",
      photoIdentite: "Photo_ID_111.jpg",
      type: "CNI"
    },
    status: "en_attente",
    priorite: "normale",
    fraisCreation: 2500,
    compteUtilisateurExist: true
  },
  {
    id: 2,
    clientId: "CLI002",
    clientName: "Kadidja CAMARA",
    telephone: "+229 96 66 77 88",
    adresse: "Akpakpa, Cotonou",
    profession: "Vendeuse",
    datedemande: "2025-06-19T14:30:00Z",
    documents: {
      pieceIdentiteRecto: "CNI_222_recto.jpg",
      pieceIdentiteVerso: "CNI_222_verso.jpg",
      photoIdentite: "Photo_ID_222.jpg",
      type: "CNI"
    },
    status: "en_attente",
    priorite: "urgente",
    notes: "Demande prioritaire - client VIP",
    fraisCreation: 2500,
    compteUtilisateurExist: true
  },
  {
    id: 3,
    clientId: "CLI003",
    clientName: "Salimata CISSE",
    telephone: "+229 95 88 99 00",
    adresse: "Godomey, Abomey-Calavi",
    profession: "Commerçante",
    datedemande: "2025-06-18T11:45:00Z",
    documents: {
      pieceIdentiteRecto: "CNI_333_recto.jpg",
      pieceIdentiteVerso: "CNI_333_verso.jpg",
      photoIdentite: "Photo_ID_333.jpg",
      type: "CNI"
    },
    status: "en_attente",
    priorite: "normale",
    fraisCreation: 2500,
    compteUtilisateurExist: false,
    notes: "Vérifier création du compte utilisateur TontiFlex"
  }
];

// Comptes épargne actifs (pour statistiques)
const comptesActifs = [
  {
    id: 1,
    clientName: "Fatou KONE",
    numeroCompte: "EPG001234",
    solde: 125000,
    dateOuverture: "2025-05-15",
    dernierDepot: "2025-06-18"
  },
  {
    id: 2,
    clientName: "Aminata DIALLO",
    numeroCompte: "EPG001235",
    solde: 89000,
    dateOuverture: "2025-05-20",
    dernierDepot: "2025-06-19"
  }
];

const AgentSFDEpargnePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriorite, setFilterPriorite] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState<DemandeCompteEpargne | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string, title: string }>({ url: "", title: "" });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState<'demandes' | 'actifs'>('demandes');
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState<any | null>(null);
  // Modal création compte
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompte, setNewCompte] = useState({
    clientName: '',
    telephone: '',
    profession: '',
    adresse: ''
  });

  // Données mockées pour l'historique
  const historiquesMock: Record<string, Array<{ date: string; type: string; montant: number; solde: number; commentaire?: string }>> = {
    'EPG001234': [
      { date: '2025-06-18', type: 'Dépôt', montant: 25000, solde: 125000, commentaire: 'Dépôt mensuel' },
      { date: '2025-05-15', type: 'Ouverture', montant: 100000, solde: 100000, commentaire: 'Premier versement' },
    ],
    'EPG001235': [
      { date: '2025-06-19', type: 'Dépôt', montant: 20000, solde: 89000, commentaire: 'Dépôt régulier' },
      { date: '2025-05-20', type: 'Ouverture', montant: 69000, solde: 69000, commentaire: 'Premier versement' },
    ],
  };

  // Ajout pour rendre les demandes réactives
  const [demandes, setDemandes] = useState<DemandeCompteEpargne[]>(demandesCompteEpargne);

  // Filtrage des demandes
  const filteredDemandes = demandes.filter(demande => {
    const searchMatch = demande.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.telephone.includes(searchTerm);

    const statusMatch = filterStatus === "all" || demande.status === filterStatus;
    const prioriteMatch = filterPriorite === "all" || demande.priorite === filterPriorite;

    return searchMatch && statusMatch && prioriteMatch;
  });

  // Actions interactives
  const handleValidateCompte = (demande: DemandeCompteEpargne) => {
    setDemandes(prev => prev.map(d => d.id === demande.id ? { ...d, status: 'valide' } : d));
    toast.success(`Compte épargne de ${demande.clientName} validé avec succès !`);
    setShowModal(false);
  };

  const handleRejectCompte = (demande: DemandeCompteEpargne, raison: string) => {
    setDemandes(prev => prev.map(d => d.id === demande.id ? { ...d, status: 'rejete' } : d));
    toast.error(`Demande de ${demande.clientName} rejetée. Raison : ${raison ? raison : 'Non spécifiée'}`);
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleViewDetails = (demande: DemandeCompteEpargne) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const handleViewImage = (imageUrl: string, title: string) => {
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  const handleRejectClick = (demande: DemandeCompteEpargne) => {
    setSelectedDemande(demande);
    setShowRejectModal(true);
  };

  const handleNouveauCompte = () => {
    setShowCreateModal(true);
  };

  const handleCreateCompte = () => {
    if (!newCompte.clientName || !newCompte.telephone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }
    // Ajout mock à la liste comptesActifs (dans une vraie app, il faudrait setComptesActifs)
    comptesActifs.push({
      id: comptesActifs.length + 1,
      clientName: newCompte.clientName,
      numeroCompte: 'EPG00' + (Math.floor(Math.random() * 9000) + 1000),
      solde: 0,
      dateOuverture: format(new Date(), 'yyyy-MM-dd'),
      dernierDepot: format(new Date(), 'yyyy-MM-dd')
    });
    toast.success("Compte épargne créé !");
    setShowCreateModal(false);
    setNewCompte({ clientName: '', telephone: '', profession: '', adresse: '' });
  };


  const handleTelechargerReleve = (compte?: any) => {
    toast.success(`Téléchargement du relevé du compte ${compte ? compte.numeroCompte : ''}`);
    if (!compte) return;
    // Générer un CSV à partir de l'historique
    const historique = historiquesMock[compte.numeroCompte] || [];
    let csv = 'Date,Type,Montant,Solde après,Commentaire\n';
    historique.forEach(op => {
      csv += `${op.date},${op.type},${op.montant},${op.solde},${op.commentaire ? op.commentaire.replace(/,/g, ' ') : ''}\n`;
    });
    // Créer un blob et lancer le téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `releve_${compte.numeroCompte}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'valide':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejete':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPrioriteIcon = (priorite: string) => {
    return priorite === 'urgente' ?
      <AlertTriangle className="text-red-500" size={16} /> :
      <Clock className="text-blue-500" size={16} />;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}


        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demandes en attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {demandes.filter(d => d.status === 'en_attente').length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comptes actifs</p>
                <p className="text-2xl font-bold text-green-600">{comptesActifs.length}</p>
              </div>
              <PiggyBank className="text-green-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Épargne totale</p>
                <p className="text-xl font-bold text-blue-600">
                  {comptesActifs.reduce((sum, compte) => sum + compte.solde, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Créés ce mois</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <UserCheck className="text-purple-600" size={24} />
            </div>
          </GlassCard>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'demandes', label: 'Demandes en attente', icon: Clock },
              { id: 'actifs', label: 'Comptes actifs', icon: PiggyBank }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'demandes' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Recherche */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Rechercher par nom, téléphone..."
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
                      <SelectItem value="valide">Validées</SelectItem>
                      <SelectItem value="rejete">Rejetées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/dashboards/dashboard-agent/saving-accounts/new">
                  <GlassButton size="sm">
                    <Plus size={16} className="mr-2" />
                    Nouveau compte
                  </GlassButton>
                </Link>

                {/* Modal création compte */}
                {showCreateModal && (
                  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full overflow-auto">
                      <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-xl font-semibold">Nouveau compte épargne</h3>
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client *</label>
                          <input type="text" className="w-full p-2 border rounded" value={newCompte.clientName} onChange={e => setNewCompte(v => ({ ...v, clientName: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                          <input type="text" className="w-full p-2 border rounded" value={newCompte.telephone} onChange={e => setNewCompte(v => ({ ...v, telephone: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                          <input type="text" className="w-full p-2 border rounded" value={newCompte.profession} onChange={e => setNewCompte(v => ({ ...v, profession: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                          <input type="text" className="w-full p-2 border rounded" value={newCompte.adresse} onChange={e => setNewCompte(v => ({ ...v, adresse: e.target.value }))} />
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                          <GlassButton className="bg-green-600 hover:bg-green-700" onClick={handleCreateCompte}>
                            <Check size={16} className="mr-2" />
                            Créer
                          </GlassButton>
                          <GlassButton variant="outline" onClick={() => setShowCreateModal(false)}>
                            Annuler
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Filtres et recherche */}

            <div className="overflow-x-auto mb-8 w-full">
              <table className="min-w-[900px] w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-2 text-left">Client</th>
                    <th className="px-2 py-2 text-left">Téléphone</th>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-left">Compte utilisateur</th>
                    <th className="px-2 py-2 text-center">Statut</th>
                    <th className="px-2 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-6">
                        <UserCheck className="mx-auto mb-2 text-gray-300" size={36} />
                        <div>Aucune demande trouvée</div>
                        <div className="text-xs text-gray-500">Essayez de modifier vos filtres de recherche</div>
                      </td>
                    </tr>
                  ) : (
                    filteredDemandes.map((demande) => (
                      <tr key={demande.id}
                        className={
                          "bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 transition-all hover:shadow-md"
                        }
                      >
                        {/* Client */}
                        <td className="px-2 py-2 font-semibold text-gray-900 align-middle">
                          {demande.clientName}
                        </td>
                        {/* Téléphone */}
                        <td className="px-2 py-2 text-gray-700 align-middle">
                          {demande.telephone}
                        </td>
                        {/* Date */}
                        <td className="px-2 py-2 text-gray-700 align-middle">
                          {format(new Date(demande.datedemande), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-2 py-2 text-gray-700 align-middle">
                          <span className={cn("ml-2 px-2 py-1 rounded-full text-xs font-medium",
                            demande.compteUtilisateurExist
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            {demande.compteUtilisateurExist ? 'Existant' : 'À créer'}
                          </span>
                        </td>
                        {/* Statut */}
                        <td className="px-2 py-2 text-center align-middle">
                          <span className={cn("px-3 text-nowrap py-1 rounded-full text-xs font-medium border", getStatusBadge(demande.status))}>
                            {demande.status === 'en_attente' ? 'En attente' : demande.status === 'valide' ? 'Validée' : 'Rejetée'}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-2 py-2 text-center align-middle">
                          <div className="flex items-center gap-3">
                            <GlassButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(demande)}
                            >
                              <Eye size={16} className="mr-1" />
                            </GlassButton>

                            {demande.status === 'en_attente' && (
                              <>
                                <GlassButton
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleValidateCompte(demande)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Onglet comptes actifs */}
        {activeTab === 'actifs' && (
          <table className="min-w-[900px] w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 text-left">Client</th>
                <th className="px-2 py-2 text-left">N° Compte</th>
                <th className="px-2 py-2 text-left">Solde</th>
                <th className="px-2 py-2 text-left">Date ouverture</th>
                <th className="px-2 py-2 text-left">Dernier dépôt</th>
                <th className="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptesActifs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">
                    <PiggyBank className="mx-auto mb-2 text-gray-300" size={36} />
                    <div>Aucun compte épargne actif</div>
                  </td>
                </tr>
              ) : (
                comptesActifs.map((compte) => (
                  <tr key={compte.id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 transition-all hover:shadow-md"
                  >
                    {/* Client */}
                    <td className="px-2 py-2 font-semibold text-gray-900 align-middle">
                      {compte.clientName}
                    </td>
                    {/* N° Compte */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {compte.numeroCompte}
                    </td>
                    {/* Solde */}
                    <td className="px-2 py-2 text-green-700 align-middle font-bold">
                      {compte.solde.toLocaleString()} FCFA
                    </td>
                    {/* Date ouverture */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {format(new Date(compte.dateOuverture), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    {/* Dernier dépôt */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {format(new Date(compte.dernierDepot), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    {/* Actions */}
                    <td className="px-2 py-2 text-center align-middle">
                      <div className="flex items-center gap-3 justify-center">
                        <GlassButton size="sm" variant="outline" onClick={() => { setSelectedCompte(compte); setShowHistoriqueModal(true); }}>
                          <Eye size={16} className="mr-1" />
                        </GlassButton>
                        <GlassButton size="sm" variant="outline" onClick={() => handleTelechargerReleve(compte)}>
                          <Download size={16} className="mr-1" />
                        </GlassButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Modal détails */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                    <label className="block text-sm font-medium text-green-700 mb-1">Client</label>
                    <p className="text-gray-900">{selectedDemande.clientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">ID Client</label>
                    <p className="text-gray-900">{selectedDemande.clientId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Téléphone</label>
                    <p className="text-gray-900">{selectedDemande.telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedDemande.email || 'Non renseigné'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-green-700 mb-1">Adresse</label>
                    <p className="text-gray-900">{selectedDemande.adresse}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Profession</label>
                    <p className="text-gray-900">{selectedDemande.profession}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Frais de création</label>
                    <p className="text-gray-900">{selectedDemande.fraisCreation.toLocaleString()} FCFA</p>
                  </div>
                </div>

                {/* Pièces à vérifier */}
                <div className="mb-6">
                  <div className="font-semibold text-green-700 mb-2">Pièces à vérifier</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-3 border">
                      <span className="text-xs text-green-700 mb-1">Recto pièce ({selectedDemande.documents.type})</span>
                      <img
                        src={selectedDemande.documents.pieceIdentiteRecto}
                        alt="Recto pièce"
                        className="w-20 h-14 object-cover rounded shadow mb-2 border"
                        onClick={() => handleViewImage(selectedDemande.documents.pieceIdentiteRecto, 'Recto pièce')}
                        style={{ cursor: 'pointer' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder-document.png'; }}
                      />
                      <GlassButton size="sm" variant="outline" onClick={() => handleViewImage(selectedDemande.documents.pieceIdentiteRecto, 'Recto pièce')}>
                        Voir
                      </GlassButton>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-3 border">
                      <span className="text-xs text-gray-500 mb-1">Verso pièce ({selectedDemande.documents.type})</span>
                      <img
                        src={selectedDemande.documents.pieceIdentiteVerso}
                        alt="Verso pièce"
                        className="w-20 h-14 object-cover rounded shadow mb-2 border"
                        onClick={() => handleViewImage(selectedDemande.documents.pieceIdentiteVerso, 'Verso pièce')}
                        style={{ cursor: 'pointer' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder-document.png'; }}
                      />
                      <GlassButton size="sm" variant="outline" onClick={() => handleViewImage(selectedDemande.documents.pieceIdentiteVerso, 'Verso pièce')}>
                        Voir
                      </GlassButton>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-3 border">
                      <span className="text-xs text-gray-500 mb-1">Photo d'identité</span>
                      <img
                        src={selectedDemande.documents.photoIdentite}
                        alt="Photo identité"
                        className="w-20 h-14 object-cover rounded shadow mb-2 border"
                        onClick={() => handleViewImage(selectedDemande.documents.photoIdentite, 'Photo identité')}
                        style={{ cursor: 'pointer' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder-document.png'; }}
                      />
                      <GlassButton size="sm" variant="outline" onClick={() => handleViewImage(selectedDemande.documents.photoIdentite, 'Photo identité')}>
                        Voir
                      </GlassButton>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlassButton
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleValidateCompte(selectedDemande);
                      setShowModal(false);
                    }}
                  >
                    <Check size={16} className="mr-2" />
                    Valider le compte
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

        {/* Modal image */}
        {showImageModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-document.png';
                  }}
                />
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
                  Vous êtes sur le point de rejeter la demande de compte épargne de <strong>{selectedDemande.clientName}</strong>.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raison du rejet</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner une raison</option>
                    <option value="documents_non_conformes">Documents non conformes</option>
                    <option value="photo_non_lisible">Photo d'identité non lisible</option>
                    <option value="informations_incorrectes">Informations incorrectes</option>
                    <option value="compte_utilisateur_manquant">Compte utilisateur manquant</option>
                    <option value="autre">Autre raison</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <GlassButton
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleRejectCompte(selectedDemande, rejectReason)}
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

        {/* Modal historique compte actif */}
        {showHistoriqueModal && selectedCompte && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Historique du compte</h3>
                <button
                  onClick={() => setShowHistoriqueModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="font-semibold text-lg text-gray-900 mb-1">{selectedCompte.clientName}</div>
                  <div className="text-sm text-gray-600">N° {selectedCompte.numeroCompte}</div>
                </div>
                <table className="w-full text-sm border-separate border-spacing-y-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">Date</th>
                      <th className="px-2 py-2 text-left">Type</th>
                      <th className="px-2 py-2 text-right">Montant</th>
                      <th className="px-2 py-2 text-right">Solde après</th>
                      <th className="px-2 py-2 text-left">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historiquesMock[selectedCompte.numeroCompte]?.length ? (
                      historiquesMock[selectedCompte.numeroCompte].map((op, idx) => (
                        <tr key={idx} className="bg-white/80">
                          <td className="px-2 py-2 text-gray-800">{format(new Date(op.date), 'dd/MM/yyyy', { locale: fr })}</td>
                          <td className="px-2 py-2 text-gray-700">{op.type}</td>
                          <td className="px-2 py-2 text-green-700 text-right font-bold">{op.montant.toLocaleString()} FCFA</td>
                          <td className="px-2 py-2 text-gray-700 text-right">{op.solde.toLocaleString()} FCFA</td>
                          <td className="px-2 py-2 text-gray-600">{op.commentaire || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-400 py-4">Aucune opération trouvée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentSFDEpargnePage;