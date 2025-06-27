// hooks/useAgentSFD.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  DemandeAdhesion, 
  DemandeRetrait, 
  DemandeCompteEpargne, 
  ActionHistorique,
  StatistiquesPeriode,
  FiltresAgent,
  ValidationRequest,
  RejetRequest,
  ApiResponse
} from '@/types/agent-sfd';

// Interface pour les statistiques du dashboard
interface StatsDashboard {
  demandesEnAttente: number;
  demandesValidees: number;
  retraitsEnAttente: number;
  comptesEpargneEnAttente: number;
  montantEnAttente: number;
  tauxValidation: number;
  tempsTraitementMoyen: number;
}

// Hook principal pour l'agent SFD
export const useAgentSFD = () => {
  // États pour les données
  const [demandesAdhesion, setDemandesAdhesion] = useState<DemandeAdhesion[]>([]);
  const [demandesRetrait, setDemandesRetrait] = useState<DemandeRetrait[]>([]);
  const [demandesCompteEpargne, setDemandesCompteEpargne] = useState<DemandeCompteEpargne[]>([]);
  const [historiqueActions, setHistoriqueActions] = useState<ActionHistorique[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesPeriode | null>(null);
  const [statsDashboard, setStatsDashboard] = useState<StatsDashboard | null>(null);
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [filtres, setFiltres] = useState<FiltresAgent>({
    searchTerm: '',
    status: 'all',
    priorite: 'all',
    periode: '30j',
    type: 'all'
  });

  // Fonction pour charger les statistiques du dashboard
  const loadDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const stats: StatsDashboard = {
        demandesEnAttente: 12,
        demandesValidees: 156,
        retraitsEnAttente: 8,
        comptesEpargneEnAttente: 5,
        montantEnAttente: 2450000,
        tauxValidation: 94,
        tempsTraitementMoyen: 65
      };
      
      setStatsDashboard(stats);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger les demandes d'adhésion
  const loadDemandesAdhesion = useCallback(async (filters?: Partial<FiltresAgent>) => {
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données mockées - en production, remplacer par un appel API réel
      const mockData: DemandeAdhesion[] = [
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
          priorite: "urgente",
          notes: "Client VIP - Traiter en priorité",
          limitesMise: { min: 500, max: 5000 },
          fraisAdhesion: 1000
        }
        // Ajouter d'autres données mockées...
      ];
      
      setDemandesAdhesion(mockData);
    } catch (err) {
      setError('Erreur lors du chargement des demandes d\'adhésion');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour valider une adhésion
  const validerAdhesion = useCallback(async (request: ValidationRequest): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, remplacer par un appel API réel
      // const response = await api.post('/agent-sfd/adhesions/valider', request);
      
      // Mettre à jour l'état local
      setDemandesAdhesion(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'validee' as const }
            : demande
        )
      );
      
      // Ajouter à l'historique
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'adhesion',
        action: 'validation',
        clientName: demandesAdhesion.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesAdhesion.find(d => d.id === request.id)?.clientId || '',
        details: 'Adhésion validée avec succès',
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 120) + 15,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors de la validation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesAdhesion]);

  // Fonction pour rejeter une adhésion
  const rejeterAdhesion = useCallback(async (request: RejetRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDemandesAdhesion(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'rejetee' as const }
            : demande
        )
      );
      
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'adhesion',
        action: 'rejet',
        clientName: demandesAdhesion.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesAdhesion.find(d => d.id === request.id)?.clientId || '',
        details: 'Adhésion rejetée',
        raison: request.raison,
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 60) + 10,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors du rejet');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesAdhesion]);

  // Fonction pour valider un retrait
  const validerRetrait = useCallback(async (request: ValidationRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDemandesRetrait(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'approuve' as const }
            : demande
        )
      );
      
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'retrait',
        action: 'validation',
        clientName: demandesRetrait.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesRetrait.find(d => d.id === request.id)?.clientId || '',
        details: 'Retrait approuvé et traité',
        montant: demandesRetrait.find(d => d.id === request.id)?.montantDemande,
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 90) + 30,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors de la validation du retrait');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesRetrait]);

  // Fonction pour rejeter un retrait
  const rejeterRetrait = useCallback(async (request: RejetRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDemandesRetrait(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'rejete' as const }
            : demande
        )
      );
      
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'retrait',
        action: 'rejet',
        clientName: demandesRetrait.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesRetrait.find(d => d.id === request.id)?.clientId || '',
        details: 'Retrait rejeté',
        raison: request.raison,
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 45) + 5,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors du rejet du retrait');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesRetrait]);

  // Fonction pour valider un compte épargne
  const validerCompteEpargne = useCallback(async (request: ValidationRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      setDemandesCompteEpargne(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'valide' as const }
            : demande
        )
      );
      
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'compte_epargne',
        action: 'validation',
        clientName: demandesCompteEpargne.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesCompteEpargne.find(d => d.id === request.id)?.clientId || '',
        details: 'Compte épargne validé et créé',
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 100) + 40,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors de la validation du compte épargne');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesCompteEpargne]);

  // Fonction pour rejeter un compte épargne
  const rejeterCompteEpargne = useCallback(async (request: RejetRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setDemandesCompteEpargne(prev => 
        prev.map(demande => 
          demande.id === request.id 
            ? { ...demande, status: 'rejete' as const }
            : demande
        )
      );
      
      const nouvelleAction: ActionHistorique = {
        id: Date.now(),
        type: 'compte_epargne',
        action: 'rejet',
        clientName: demandesCompteEpargne.find(d => d.id === request.id)?.clientName || '',
        clientId: demandesCompteEpargne.find(d => d.id === request.id)?.clientId || '',
        details: 'Demande compte épargne rejetée',
        raison: request.raison,
        dateAction: new Date().toISOString(),
        dureeTraitement: Math.floor(Math.random() * 30) + 10,
        status: 'completed'
      };
      
      setHistoriqueActions(prev => [nouvelleAction, ...prev]);
      
      return true;
    } catch (err) {
      setError('Erreur lors du rejet du compte épargne');
      return false;
    } finally {
      setLoading(false);
    }
  }, [demandesCompteEpargne]);

  // Fonction pour charger les statistiques
  const loadStatistiques = useCallback(async (periode: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const stats: StatistiquesPeriode = {
        periode: `${periode} derniers jours`,
        adhesions: { validees: 45, rejetees: 8, total: 53 },
        retraits: { approuves: 32, rejetes: 6, total: 38, montant: 1250000 },
        comptesEpargne: { valides: 18, rejetes: 3, total: 21 },
        tempsTraitement: { moyen: 65, median: 45, min: 15, max: 180 },
        tauxValidation: 87
      };
      
      setStatistiques(stats);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour les filtres
  const updateFiltres = useCallback((nouveauxFiltres: Partial<FiltresAgent>) => {
    setFiltres((prev: FiltresAgent) => ({ ...prev, ...nouveauxFiltres }));
  }, []);

  // Fonction pour réinitialiser les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    loadDashboardStats();
    loadDemandesAdhesion();
    loadStatistiques('30');
  }, [loadDashboardStats, loadDemandesAdhesion, loadStatistiques]);

  // Calcul des données filtrées
  const demandesAdhesionFiltrees = demandesAdhesion.filter(demande => {
    if (filtres.searchTerm) {
      const searchLower = filtres.searchTerm.toLowerCase();
      if (!demande.clientName.toLowerCase().includes(searchLower) &&
          !demande.telephone.includes(filtres.searchTerm) &&
          !demande.tontine.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    if (filtres.status !== 'all' && demande.status !== filtres.status) {
      return false;
    }
    
    if (filtres.priorite !== 'all' && demande.priorite !== filtres.priorite) {
      return false;
    }
    
    return true;
  });

  return {
    // Données
    demandesAdhesion: demandesAdhesionFiltrees,
    demandesRetrait,
    demandesCompteEpargne,
    historiqueActions,
    statistiques,
    statsDashboard,
    
    // États
    loading,
    error,
    filtres,
    
    // Actions pour les adhésions
    validerAdhesion,
    rejeterAdhesion,
    
    // Actions pour les retraits
    validerRetrait,
    rejeterRetrait,
    
    // Actions pour les comptes épargne
    validerCompteEpargne,
    rejeterCompteEpargne,
    
    // Fonctions utilitaires
    loadDashboardStats,
    loadDemandesAdhesion,
    loadStatistiques,
    updateFiltres,
    clearError,
    
    // Métadonnées
    hasError: !!error,
    isEmpty: demandesAdhesion.length === 0 && demandesRetrait.length === 0 && demandesCompteEpargne.length === 0
  };
};

// Hook pour les notifications de l'agent SFD
export const useAgentNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification: any) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
};

export default useAgentSFD;