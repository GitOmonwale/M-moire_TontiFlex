// hooks/useAllUsers.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminsPlateforme } from './useAdminsPlateforme';
import { useAgentsSFD } from './useAgentsSFD';
import { useSuperviseursSFD } from './useSuperviseursSFD';
import { useAdminsSFD } from './useAdminsSFD';
import { useClients } from './useClients';

// Types unifiés pour tous les utilisateurs
export type UserRole = 'Client' | 'Agent SFD' | 'Superviseur SFD' | 'Administrateur SFD' | 'Administrateur Plateforme';
export type UserStatus = 'actif' | 'inactif' | 'suspendu';

export interface UnifiedUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  profession: string;
  role: UserRole;
  statut: UserStatus;
  dateInscription: string;
  derniereConnexion?: string;
  
  // Données spécifiques selon le rôle
  // Pour clients
  tontinesActives?: number;
  comptesEpargne?: number;
  scoreCredit?: number;
  totalCotisations?: number;
  retraitsEffectues?: number;
  
  // Pour agents/superviseurs SFD
  clientsGeres?: number;
  adhesionsValidees?: number;
  retraitsTraites?: number;
  performanceScore?: number;
  pretsSupervises?: number;
  pretsApprouves?: number;
  tauxApprobation?: number;
  
  // Pour admin plateforme
  peut_gerer_comptes?: boolean;
  peut_gerer_sfd?: boolean;
  
  // Données communes
  statsPeriode?: {
    connexions: number;
    transactions?: number;
    actionsValidees?: number;
    pretsTraites?: number;
  };
  motifSuspension?: string;
  sfd_id?: string;
  sfd_nom?: string;
}

interface AgentSFD {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  profession: string;
  est_actif: boolean;
  sfd_id: string;
  sfd_nom: string;
  date_creation: string;
  derniere_connexion?: string;
  clients_geres?: number;
  adhesions_validees?: number;
  performance_score?: number;
}

interface SuperviseurSFD {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  profession: string;
  est_actif: boolean;
  sfd_id: string;
  sfd_nom: string;
  date_creation: string;
  derniere_connexion?: string;
  prets_supervises?: number;
  prets_approuves?: number;
  taux_approbation?: number;
  performance_score?: number;
}

interface AdminSFD {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  profession: string;
  est_actif: boolean;
  sfd_id: string;
  sfd_nom: string;
  date_creation: string;
  derniere_connexion?: string;
  tontines_gerees?: number;
  performance_score?: number;
}

interface useAllUsersResults {
  allUsers: UnifiedUser[];
  loading: boolean;
  error: string | null;
  
  // Fonctions de récupération
  fetchAllUsers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  
  // Filtres
  usersByRole: (role: UserRole) => UnifiedUser[];
  usersByStatus: (status: UserStatus) => UnifiedUser[];
  searchUsers: (searchTerm: string) => UnifiedUser[];
  
  // Actions utilisateur
  updateUserStatus: (userId: string, newStatus: UserStatus) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string, userRole: UserRole) => Promise<boolean>;
  
  // Statistiques
  getUserStats: () => {
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<UserRole, number>;
    usersByStatus: Record<UserStatus, number>;
  };
}

export function useAllUsers(): useAllUsersResults {
  const [allUsers, setAllUsers] = useState<UnifiedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const baseUrl = 'https://tontiflexapp.onrender.com/api';

  // Utilisation des hooks existants
  const { 
    clients, 
    fetchClients,
    loading: clientsLoading,
    error: clientsError 
  } = useClients();

  const { 
    adminsplateforme, 
    fetchAdminsPlateforme,
    loading: adminsLoading,
    error: adminsError 
  } = useAdminsPlateforme();

  const { 
    agentsSFD, 
    fetchAgentsSFD,
    loading: agentsLoading,
    error: agentsError 
  } = useAgentsSFD();

  const { 
    superviseursSFD, 
    fetchSuperviseursSFD,
    loading: superviseursLoading,
    error: superviseursError 
  } = useSuperviseursSFD();

  const { 
    adminsSFD, 
    fetchAdminsSFD,
    loading: adminsSFDLoading,
    error: adminsSFDError 
  } = useAdminsSFD();

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };
  };



  // Fonction pour convertir les clients en format unifié
  const convertClientsToUnified = (clients: any[]): UnifiedUser[] => {
    return clients.map(client => ({
      id: client.id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      profession: client.profession,
      role: 'Client' as UserRole,
      statut: client.statut || 'actif' as UserStatus,
      dateInscription: client.dateCreation || new Date().toISOString(),
      derniereConnexion: client.derniere_connexion,
      tontinesActives: parseInt(client.tontines_count) || 0,
      scoreCredit: parseFloat(client.scorefiabilite) || 0,
      statsPeriode: {
        connexions: Math.floor(Math.random() * 30), // Simulé pour l'instant
        transactions: Math.floor(Math.random() * 50)
      }
    }));
  };

  // Fonction pour convertir les admins plateforme en format unifié
  const convertAdminsPlateformeToUnified = (admins: any[]): UnifiedUser[] => {
    return admins.map(admin => ({
      id: admin.email, // Les admins plateforme n'ont pas d'ID unique visible
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      telephone: admin.telephone,
      adresse: admin.adresse,
      profession: admin.profession,
      role: 'Administrateur Plateforme' as UserRole,
      statut: admin.est_actif ? 'actif' : 'inactif' as UserStatus,
      dateInscription: new Date().toISOString(), // Non fourni par l'API
      peut_gerer_comptes: admin.peut_gerer_comptes,
      peut_gerer_sfd: admin.peut_gerer_sfd,
      statsPeriode: {
        connexions: Math.floor(Math.random() * 20)
      }
    }));
  };

  // Fonction pour convertir les agents SFD en format unifié
  const convertAgentsSFDToUnified = (agents: AgentSFD[]): UnifiedUser[] => {
    return agents.map(agent => ({
      id: agent.id,
      nom: agent.nom,
      prenom: agent.prenom,
      email: agent.email,
      telephone: agent.telephone,
      adresse: agent.adresse,
      profession: agent.profession,
      role: 'Agent SFD' as UserRole,
      statut: agent.est_actif ? 'actif' : 'inactif' as UserStatus,
      dateInscription: agent.date_creation,
      derniereConnexion: agent.derniere_connexion,
      clientsGeres: agent.clients_geres || 0,
      adhesionsValidees: agent.adhesions_validees || 0,
      performanceScore: agent.performance_score || 0,
      sfd_id: agent.sfd_id,
      sfd_nom: agent.sfd_nom,
      statsPeriode: {
        connexions: Math.floor(Math.random() * 25),
        actionsValidees: Math.floor(Math.random() * 15)
      }
    }));
  };

  // Fonction pour convertir les superviseurs SFD en format unifié
  const convertSuperviseursSFDToUnified = (superviseurs: SuperviseurSFD[]): UnifiedUser[] => {
    return superviseurs.map(superviseur => ({
      id: superviseur.id,
      nom: superviseur.nom,
      prenom: superviseur.prenom,
      email: superviseur.email,
      telephone: superviseur.telephone,
      adresse: superviseur.adresse,
      profession: superviseur.profession,
      role: 'Superviseur SFD' as UserRole,
      statut: superviseur.est_actif ? 'actif' : 'inactif' as UserStatus,
      dateInscription: superviseur.date_creation,
      derniereConnexion: superviseur.derniere_connexion,
      pretsSupervises: superviseur.prets_supervises || 0,
      pretsApprouves: superviseur.prets_approuves || 0,
      tauxApprobation: superviseur.taux_approbation || 0,
      performanceScore: superviseur.performance_score || 0,
      sfd_id: superviseur.sfd_id,
      sfd_nom: superviseur.sfd_nom,
      statsPeriode: {
        connexions: Math.floor(Math.random() * 20),
        pretsTraites: Math.floor(Math.random() * 8)
      }
    }));
  };

  // Fonction pour convertir les admins SFD en format unifié
  const convertAdminsSFDToUnified = (admins: AdminSFD[]): UnifiedUser[] => {
    return admins.map(admin => ({
      id: admin.id,
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      telephone: admin.telephone,
      adresse: admin.adresse,
      profession: admin.profession,
      role: 'Administrateur SFD' as UserRole,
      statut: admin.est_actif ? 'actif' : 'inactif' as UserStatus,
      dateInscription: admin.date_creation,
      derniereConnexion: admin.derniere_connexion,
      tontinesGerees: admin.tontines_gerees || 0,
      performanceScore: admin.performance_score || 0,
      sfd_id: admin.sfd_id,
      sfd_nom: admin.sfd_nom,
      statsPeriode: {
        connexions: Math.floor(Math.random() * 15)
      }
    }));
  };

  // Fonction principale pour récupérer tous les utilisateurs
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupération en parallèle de tous les types d'utilisateurs
      const [
        clientsData,
        adminsPlateformeData,
        agentsData,
        superviseursData,
        adminsSFDData
      ] = await Promise.allSettled([
        fetchClients(),
        fetchAdminsPlateforme(),
        fetchAgentsSFD(),
        fetchSuperviseursSFD(),
        fetchAdminsSFD()
      ]);

      const unifiedUsers: UnifiedUser[] = [];

      // Traitement des clients
      if (clientsData.status === 'fulfilled' && clientsData.value) {
        unifiedUsers.push(...convertClientsToUnified(clientsData.value.results || []));
      }

      // Traitement des admins plateforme
      if (adminsPlateformeData.status === 'fulfilled' && adminsPlateformeData.value) {
        unifiedUsers.push(...convertAdminsPlateformeToUnified(adminsPlateformeData.value.results || []));
      }

      // Traitement des agents SFD
      if (agentsData.status === 'fulfilled' && agentsData.value) {
        unifiedUsers.push(...convertAgentsSFDToUnified(agentsData.value.results || []));
      }

      // Traitement des superviseurs SFD
      if (superviseursData.status === 'fulfilled' && superviseursData.value) {
        unifiedUsers.push(...convertSuperviseursSFDToUnified(superviseursData.value));
      }

      // Traitement des admins SFD
      if (adminsSFDData.status === 'fulfilled' && adminsSFDData.value) {
        unifiedUsers.push(...convertAdminsSFDToUnified(adminsSFDData.value));
      }

      setAllUsers(unifiedUsers);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Fonction de rafraîchissement
  const refreshUsers = useCallback(async () => {
    await fetchAllUsers();
  }, [fetchAllUsers]);

  // Filtres
  const usersByRole = useCallback((role: UserRole) => {
    return allUsers.filter(user => user.role === role);
  }, [allUsers]);

  const usersByStatus = useCallback((status: UserStatus) => {
    return allUsers.filter(user => user.statut === status);
  }, [allUsers]);

  const searchUsers = useCallback((searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return allUsers.filter(user => 
      user.nom.toLowerCase().includes(term) ||
      user.prenom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.telephone.includes(searchTerm)
    );
  }, [allUsers]);

  // Actions utilisateur
  const updateUserStatus = async (userId: string, newStatus: UserStatus): Promise<boolean> => {
    try {
      // TODO: Implémenter selon le type d'utilisateur
      toast.success(`Statut utilisateur mis à jour: ${newStatus}`);
      
      // Mettre à jour localement
      setAllUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, statut: newStatus } : user
        )
      );
      
      return true;
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
      return false;
    }
  };

  const resetUserPassword = async (userId: string): Promise<boolean> => {
    try {
      // TODO: Implémenter l'API de reset de mot de passe
      toast.success('Lien de réinitialisation envoyé par SMS');
      return true;
    } catch (err) {
      toast.error('Erreur lors de la réinitialisation');
      return false;
    }
  };

  const deleteUser = async (userId: string, userRole: UserRole): Promise<boolean> => {
    try {
      // TODO: Implémenter selon le type d'utilisateur
      toast.success('Utilisateur supprimé avec succès');
      
      // Retirer localement
      setAllUsers(prev => prev.filter(user => user.id !== userId));
      
      return true;
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  // Statistiques
  const getUserStats = useCallback(() => {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.statut === 'actif').length;
    
    const usersByRole = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    const usersByStatus = allUsers.reduce((acc, user) => {
      acc[user.statut] = (acc[user.statut] || 0) + 1;
      return acc;
    }, {} as Record<UserStatus, number>);

    return {
      totalUsers,
      activeUsers,
      usersByRole,
      usersByStatus
    };
  }, [allUsers]);

  // Chargement initial
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    allUsers,
    loading: loading || clientsLoading || adminsLoading,
    error: error || clientsError || adminsError,
    fetchAllUsers,
    refreshUsers,
    usersByRole,
    usersByStatus,
    searchUsers,
    updateUserStatus,
    resetUserPassword,
    deleteUser,
    getUserStats
  };
}