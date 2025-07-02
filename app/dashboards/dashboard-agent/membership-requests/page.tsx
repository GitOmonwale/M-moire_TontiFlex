'use client'
import { useState } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Input } from '@/components/ui/input';
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
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';


// Interface pour les demandes d'adhésion
interface DemandeAdhesion {
  id: number;
  clientId: string;
  clientName: string;
  telephone: string;
  email?: string;
  adresse: string;
  profession: string;
  tontine: {
    id: string;
    name: string;
    type: string;
  };
  montantMise: number;
  datedemande: string;
  pieceIdentite: {
    recto: string;
    verso: string;
    type: string;
  };
  status: 'en_attente' | 'validee' | 'rejetee';
  notes?: string;
  limitesMise: {
    min: number;
    max: number;
  };
}

// Données mockées pour les demandes d'adhésion
const initialDemandesAdhesion: DemandeAdhesion[] = [
  {
    id: 1,
    clientId: "CLI001",
    clientName: "Fatou KONE",
    telephone: "+229 97 12 34 56",
    email: "fatou.kone@email.com",
    adresse: "Quartier Agblédo, Cotonou",
    profession: "Commerçante",
    tontine: {
      id: "TON001",
      name: "Tontine ALAFIA",
      type: "Épargne"
    },
    montantMise: 1500,
    datedemande: "2025-06-20T08:30:00Z",
    pieceIdentite: {
      recto: "CNI_123456789_recto.jpg",
      verso: "CNI_123456789_verso.jpg",
      type: "CNI"
    },
    status: "en_attente",
    limitesMise: { min: 500, max: 5000 }
  },
  {
    id: 2,
    clientId: "CLI002",
    clientName: "Aminata DIALLO",
    telephone: "+229 96 78 90 12",
    adresse: "Calavi, Abomey-Calavi",
    profession: "Couturière",
    tontine: {
      id: "TON002",
      name: "Tontine Entrepreneures",
      type: "Crédit"
    },
    montantMise: 2000,
    datedemande: "2025-06-19T14:15:00Z",
    pieceIdentite: {
      recto: "CNI_987654321_recto.jpg",
      verso: "CNI_987654321_verso.jpg",
      type: "CNI"
    },
    status: "en_attente",
    limitesMise: { min: 1000, max: 10000 }
  },
  {
    id: 3,
    clientId: "CLI003",
    clientName: "Ramatou BAKO",
    telephone: "+229 95 45 67 89",
    adresse: "Godomey, Abomey-Calavi",
    profession: "Vendeuse",
    tontine: {
      id: "TON003",
      name: "Tontine Commerce",
      type: "Épargne"
    },
    montantMise: 1200,
    datedemande: "2025-06-18T10:45:00Z",
    pieceIdentite: {
      recto: "CNI_456789123_recto.jpg",
      verso: "CNI_456789123_verso.jpg",
      type: "CNI"
    },
    status: "en_attente",
    limitesMise: { min: 500, max: 3000 }
  }
];

const AgentSFDAdhesionsPage = () => {
  const [demandesAdhesionState, setDemandesAdhesionState] = useState<DemandeAdhesion[]>(initialDemandesAdhesion);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState<DemandeAdhesion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Filtrage des demandes
  const filteredDemandes = demandesAdhesionState.filter(demande => {
    const searchMatch = demande.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       demande.telephone.includes(searchTerm) ||
                       demande.tontine.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = filterStatus === "all" || demande.status === filterStatus;
    
    return searchMatch && statusMatch;
  });

  const handleValidateAdhesion = (demande: DemandeAdhesion) => {
    setDemandesAdhesionState((prev) =>
      prev.map((d) =>
        d.id === demande.id ? { ...d, status: 'validee' } : d
      )
    );
    toast.success(`Adhésion de ${demande.clientName} validée avec succès.`);
    // Ici vous ajouteriez la logique pour valider l'adhésion
    // API call, etc.
  };

  const handleRejectAdhesion = (demande: DemandeAdhesion, raison: string) => {
    setDemandesAdhesionState((prev) =>
      prev.map((d) =>
        d.id === demande.id ? { ...d, status: 'rejetee' } : d
      )
    );
    toast.error(`Adhésion de ${demande.clientName} rejetée.`);
    // Ici vous ajouteriez la logique pour rejeter l'adhésion
  };

  const handleViewDetails = (demande: DemandeAdhesion) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'validee':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejetee':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
                  {demandesAdhesionState.filter(d => d.status === 'en_attente').length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
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
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="validee">Validées</SelectItem>
                  <SelectItem value="rejetee">Rejetées</SelectItem>
                </SelectContent>
              </Select>
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
                    {/* Tontine */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {demande.tontine.name} <span className="text-xs text-gray-400">({demande.tontine.type})</span>
                    </td>
                    {/* Mise */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {demande.montantMise.toLocaleString()} FCFA
                    </td>
                    {/* Date */}
                    <td className="px-2 py-2 text-gray-700 align-middle">
                      {format(new Date(demande.datedemande), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    {/* Statut */}
                    <td className="px-2 py-2 text-center align-middle">
                      <span className={cn("px-3 text-nowrap py-1 rounded-full text-xs font-medium border", getStatusBadge(demande.status))}>
                        {demande.status === 'en_attente' ? 'En attente' : demande.status === 'validee' ? 'Validée' : 'Rejetée'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-2 py-2 text-center align-middle">
                      <div className="flex gap-1 justify-center">
                        <GlassButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(demande)}
                          aria-label="Voir détails"
                          className="hover:bg-emerald-50"
                        >
                          <Eye size={16} />
                        </GlassButton>
                        {demande.status === 'en_attente' && (
                          <>
                            <GlassButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleValidateAdhesion(demande)}
                              aria-label="Valider"
                              className="hover:bg-green-100"
                            >
                              <CheckCircle size={18} className="text-green-600" />
                            </GlassButton>
                            <GlassButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectAdhesion(demande, 'Non conformité documents')}
                              aria-label="Rejeter"
                              className="hover:bg-red-100"
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
        {showModal && selectedDemande && (
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
                    <p className="text-gray-900">{selectedDemande.clientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Client</label>
                    <p className="text-gray-900">{selectedDemande.clientId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <p className="text-gray-900">{selectedDemande.telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedDemande.email || 'Non renseigné'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <p className="text-gray-900">{selectedDemande.adresse}</p>
                  </div>
                </div>

                {/* Pièce d'identité */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-2">Pièce d'identité <span className="text-xs text-gray-500">({selectedDemande.pieceIdentite.type})</span></h4>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-xs mb-1">Recto</span>
                      <img
                        src={selectedDemande.pieceIdentite.recto}
                        alt="Recto pièce d'identité"
                        className="w-40 h-28 object-cover rounded border"
                        onError={(e) => { e.currentTarget.src = '/placeholder-document.png'; }}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs mb-1">Verso</span>
                      <img
                        src={selectedDemande.pieceIdentite.verso}
                        alt="Verso pièce d'identité"
                        className="w-40 h-28 object-cover rounded border"
                        onError={(e) => { e.currentTarget.src = '/placeholder-document.png'; }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlassButton 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleValidateAdhesion(selectedDemande);
                      setShowModal(false);
                    }}
                  >
                    <Check size={16} className="mr-2" />
                    Valider la demande
                  </GlassButton>
                  
                  <GlassButton 
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleRejectAdhesion(selectedDemande, "Rejet depuis modal");
                      setShowModal(false);
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Rejeter
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal image */}
        {showImageModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Pièce d'identité</h3>
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
                  alt="Pièce d'identité"
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