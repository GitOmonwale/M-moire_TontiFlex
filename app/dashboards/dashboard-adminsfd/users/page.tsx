// app/dashboard-sfd-admin/users/page.tsx
'use client'
import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Users, 
  User, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  Key,
  Ban,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Données mockées des utilisateurs
  const users = [
    {
      id: 'USR001',
      nom: 'Marie JOHNSON',
      prenom: 'Marie',
      email: 'marie.johnson@email.com',
      telephone: '+229 97 12 34 56',
      adresse: 'Cotonou, Littoral',
      profession: 'Commerçante',
      role: 'Client',
      statut: 'actif',
      dateInscription: '2024-03-15T10:30:00Z',
      derniereConnexion: '2025-06-12T08:45:00Z',
      tontinesActives: 2,
      comptesEpargne: 1,
      scoreCredit: 85,
      totalCotisations: 45000,
      retraitsEffectues: 3,
      statsPeriode: {
        connexions: 12,
        transactions: 8
      }
    },
    {
      id: 'USR002',
      nom: 'AHOYO Bernadette',
      prenom: 'Bernadette',
      email: 'b.ahoyo@sfdportionovo.bj',
      telephone: '+229 97 23 45 67',
      adresse: 'Porto-Novo, Ouémé',
      profession: 'Agent SFD',
      role: 'Agent SFD',
      statut: 'actif',
      dateInscription: '2023-01-10T09:00:00Z',
      derniereConnexion: '2025-06-12T14:20:00Z',
      clientsGeres: 45,
      adhesionsValidees: 127,
      retraitsTraites: 89,
      performanceScore: 92,
      statsPeriode: {
        connexions: 25,
        actionsValidees: 15
      }
    },
    {
      id: 'USR003',
      nom: 'DOSSA Paulin',
      prenom: 'Paulin',
      email: 'p.dossa@sfdportionovo.bj',
      telephone: '+229 96 34 56 78',
      adresse: 'Parakou, Borgou',
      profession: 'Superviseur SFD',
      role: 'Superviseur SFD',
      statut: 'actif',
      dateInscription: '2022-08-20T14:15:00Z',
      derniereConnexion: '2025-06-12T13:10:00Z',
      pretsSupervises: 156,
      pretsApprouves: 142,
      tauxApprobation: 91.0,
      performanceScore: 88,
      statsPeriode: {
        connexions: 20,
        pretsTraites: 8
      }
    },
    {
      id: 'USR004',
      nom: 'Fatou AHOUNOU',
      prenom: 'Fatou',
      email: 'fatou.ahounou@email.com',
      telephone: '+229 95 45 67 89',
      adresse: 'Abomey, Zou',
      profession: 'Couturière',
      role: 'Client',
      statut: 'inactif',
      dateInscription: '2024-05-22T16:45:00Z',
      derniereConnexion: '2025-04-18T12:30:00Z',
      tontinesActives: 1,
      comptesEpargne: 0,
      scoreCredit: 78,
      totalCotisations: 32000,
      retraitsEffectues: 1,
      statsPeriode: {
        connexions: 0,
        transactions: 0
      }
    },
    {
      id: 'USR005',
      nom: 'KPADE Michel',
      prenom: 'Michel',
      email: 'm.kpade@sfdportionovo.bj',
      telephone: '+229 94 56 78 90',
      adresse: 'Bohicon, Zou',
      profession: 'Agent SFD',
      role: 'Agent SFD',
      statut: 'suspendu',
      dateInscription: '2023-11-05T11:20:00Z',
      derniereConnexion: '2025-05-28T09:15:00Z',
      clientsGeres: 32,
      adhesionsValidees: 78,
      retraitsTraites: 45,
      performanceScore: 65,
      motifSuspension: 'Validation incorrecte répétée',
      statsPeriode: {
        connexions: 5,
        actionsValidees: 2
      }
    },
    {
      id: 'USR006',
      nom: 'Adjoa MENSAH',
      prenom: 'Adjoa',
      email: 'adjoa.mensah@email.com',
      telephone: '+229 93 67 89 01',
      adresse: 'Natitingou, Atacora',
      profession: 'Agricultrice',
      role: 'Client',
      statut: 'actif',
      dateInscription: '2023-12-08T13:50:00Z',
      derniereConnexion: '2025-06-11T19:30:00Z',
      tontinesActives: 1,
      comptesEpargne: 2,
      scoreCredit: 72,
      totalCotisations: 28000,
      retraitsEffectues: 2,
      statsPeriode: {
        connexions: 8,
        transactions: 5
      }
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.telephone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.statut === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let message = '';
      switch (action) {
        case 'activate':
          message = 'Utilisateur activé avec succès';
          break;
        case 'deactivate':
          message = 'Utilisateur désactivé avec succès';
          break;
        case 'suspend':
          message = 'Utilisateur suspendu avec succès';
          break;
        case 'resetPassword':
          message = 'Mot de passe réinitialisé - Lien envoyé par SMS';
          break;
        case 'delete':
          message = 'Utilisateur supprimé avec succès';
          break;
        default:
          message = 'Action effectuée avec succès';
      }
      
      toast.success(message);
      console.log(`Action ${action} effectuée sur l'utilisateur ${userId}`);
      
    } catch (error) {
      toast.error('Erreur lors de l\'exécution de l\'action');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Client':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Client</span>;
      case 'Agent SFD':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Agent</span>;
      case 'Superviseur SFD':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Superviseur</span>;
      case 'Administrateur SFD':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Admin</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Utilisateur</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'actif':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={12} />
          Actif
        </span>;
      case 'inactif':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Inactif
        </span>;
      case 'suspendu':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
          <Ban size={12} />
          Suspendu
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inconnu</span>;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-4 text-center border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {users.filter(u => u.role === 'Client').length}
            </div>
            <div className="text-sm text-gray-600">Clients</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-emerald-500">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {users.filter(u => u.role === 'Agent SFD').length}
            </div>
            <div className="text-sm text-gray-600">Agents</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-purple-500">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {users.filter(u => u.role === 'Superviseur SFD').length}
            </div>
            <div className="text-sm text-gray-600">Superviseurs</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center border-l-4 border-l-red-500">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {users.filter(u => u.statut === 'inactif' || u.statut === 'suspendu').length}
            </div>
            <div className="text-sm text-gray-600">Inactifs/Suspendus</div>
          </GlassCard>
        </div>

        {/* Filtres et contrôles */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white/60 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40 bg-white/60">
                    <User className="mr-2" size={16} />
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="Client">Clients</SelectItem>
                    <SelectItem value="Agent SFD">Agents</SelectItem>
                    <SelectItem value="Superviseur SFD">Superviseurs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-white/60">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <GlassButton variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Exporter
              </GlassButton>
              
              <GlassButton
                size="sm"
                onClick={() => setShowCreateUser(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2" size={16} />
                Nouvel utilisateur
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50/50 border-b border-emerald-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-emerald-800">Utilisateur</th>
                  <th className="text-left p-4 font-semibold text-emerald-800">Contact</th>
                  <th className="text-left p-4 font-semibold text-emerald-800">Rôle & Statut</th>
                  <th className="text-left p-4 font-semibold text-emerald-800">Activité</th>
                  <th className="text-left p-4 font-semibold text-emerald-800">Performance</th>
                  <th className="text-right p-4 font-semibold text-emerald-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.prenom} {user.nom}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                          <div className="text-xs text-gray-500">{user.profession}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone size={12} className="text-gray-400" />
                          {user.telephone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail size={12} className="text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          {user.adresse}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.statut)}
                        {user.motifSuspension && (
                          <div className="text-xs text-red-600">
                            {user.motifSuspension}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Inscription:</strong> {format(new Date(user.dateInscription), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                        <div>
                          <strong>Dernière connexion:</strong> {format(new Date(user.derniereConnexion), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.statsPeriode.connexions} connexions ce mois
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {user.role === 'Client' ? (
                        <div className="space-y-1 text-sm">
                          <div>Tontines: {user.tontinesActives}</div>
                          <div>Épargne: {user.comptesEpargne}</div>
                          <div className={`font-medium ${getPerformanceColor(user.scoreCredit ?? 0)}`}>
                            Score: {user.scoreCredit}/100
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.totalCotisations?.toLocaleString()} FCFA cotisés
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm">
                          {user.role === 'Agent SFD' && (
                            <>
                              <div>Clients: {user.clientsGeres}</div>
                              <div>Validations: {user.adhesionsValidees}</div>
                              <div className={`font-medium ${getPerformanceColor(user.performanceScore ?? 0)}`}>
                                Performance: {user.performanceScore}%
                              </div>
                            </>
                          )}
                          {user.role === 'Superviseur SFD' && (
                            <>
                              <div>Prêts: {user.pretsSupervises}</div>
                              <div>Approuvés: {user.pretsApprouves}</div>
                              <div className={`font-medium ${getPerformanceColor(user.performanceScore ?? 0)}`}>
                                Taux: {user.tauxApprobation}%
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetails(true);
                          }}
                        >
                          <Eye size={14} className="mr-1" />
                          Voir
                        </GlassButton>
                        
                        <div className="relative group">
                          <GlassButton variant="outline" size="sm">
                            <MoreVertical size={14} />
                          </GlassButton>
                          
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleUserAction(user.id, 'resetPassword')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Key size={14} />
                                Réinitialiser mot de passe
                              </button>
                              
                              {user.statut === 'actif' ? (
                                <button
                                  onClick={() => handleUserAction(user.id, 'deactivate')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <UserX size={14} />
                                  Désactiver
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <UserCheck size={14} />
                                  Activer
                                </button>
                              )}
                              
                              {user.statut !== 'suspendu' ? (
                                <button
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 text-yellow-600 flex items-center gap-2"
                                >
                                  <Ban size={14} />
                                  Suspendre
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-600 flex items-center gap-2"
                                >
                                  <Unlock size={14} />
                                  Lever suspension
                                </button>
                              )}
                              
                              <hr className="my-1" />
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg mb-2">Aucun utilisateur trouvé</p>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos filtres' 
                  : 'Aucun utilisateur enregistré'
                }
              </p>
            </div>
          )}
        </div>

        {/* Modal de détails utilisateur (simplifié) */}
        {showDetails && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  Profil de {selectedUser.prenom} {selectedUser.nom}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Edit size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Informations personnelles</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom complet:</strong> {selectedUser.prenom} {selectedUser.nom}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      <div><strong>Téléphone:</strong> {selectedUser.telephone}</div>
                      <div><strong>Adresse:</strong> {selectedUser.adresse}</div>
                      <div><strong>Profession:</strong> {selectedUser.profession}</div>
                      <div><strong>Rôle:</strong> {selectedUser.role}</div>
                      <div><strong>Statut:</strong> {selectedUser.statut}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Activité sur la plateforme</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Inscription:</strong> {format(new Date(selectedUser.dateInscription), 'dd MMMM yyyy', { locale: fr })}</div>
                      <div><strong>Dernière connexion:</strong> {format(new Date(selectedUser.derniereConnexion), 'dd MMMM yyyy à HH:mm', { locale: fr })}</div>
                      <div><strong>Connexions ce mois:</strong> {selectedUser.statsPeriode.connexions}</div>
                      
                      {selectedUser.role === 'Client' && (
                        <>
                          <div><strong>Tontines actives:</strong> {selectedUser.tontinesActives}</div>
                          <div><strong>Comptes épargne:</strong> {selectedUser.comptesEpargne}</div>
                          <div><strong>Score de crédit:</strong> {selectedUser.scoreCredit}/100</div>
                          <div><strong>Total cotisations:</strong> {selectedUser.totalCotisations.toLocaleString()} FCFA</div>
                          <div><strong>Retraits effectués:</strong> {selectedUser.retraitsEffectues}</div>
                        </>
                      )}
                      
                      {selectedUser.role === 'Agent SFD' && (
                        <>
                          <div><strong>Clients gérés:</strong> {selectedUser.clientsGeres}</div>
                          <div><strong>Adhésions validées:</strong> {selectedUser.adhesionsValidees}</div>
                          <div><strong>Retraits traités:</strong> {selectedUser.retraitsTraites}</div>
                          <div><strong>Score performance:</strong> {selectedUser.performanceScore}%</div>
                        </>
                      )}
                      
                      {selectedUser.role === 'Superviseur SFD' && (
                        <>
                          <div><strong>Prêts supervisés:</strong> {selectedUser.pretsSupervises}</div>
                          <div><strong>Prêts approuvés:</strong> {selectedUser.pretsApprouves}</div>
                          <div><strong>Taux d'approbation:</strong> {selectedUser.tauxApprobation}%</div>
                          <div><strong>Score performance:</strong> {selectedUser.performanceScore}%</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedUser.motifSuspension && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Motif de suspension</h4>
                    <p className="text-sm text-red-700">{selectedUser.motifSuspension}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;