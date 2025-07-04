import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Types
export interface Client {
  id: string; // UUID
  tontines_count: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  profession: string;
  motDePasse: string;
  dateCreation?: string;
  statut?: 'actif' | 'inactif' | 'suspendu';
  derniere_connexion?: string | null;
  email_verifie: boolean;
  pieceIdentite?: string | null;
  photoIdentite?: string | null;
  scorefiabilite: string;
  user?: number | null;
}

export interface PaginatedClientList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}

export interface ClientsFilters {
  page?: number;
  sfd_id?: string;
  statut?: 'actif' | 'inactif' | 'suspendu';
  date_inscription_debut?: string;
  date_inscription_fin?: string;
  search?: string; // recherche textuelle (nom, email, téléphone)
}

export interface ClientCotisation {
  id: number;
  montant: string;
  date_cotisation: string;
  numero_transaction: string;
  statut: 'pending' | 'confirmee' | 'rejetee';
  tontine_nom: string;
  cycle_numero: number;
  jour_carnet: number | null;
  est_commission_sfd: boolean;
  cycle_display: string;
  type_cotisation: string;
  transaction_kkiapay: string | null;
}

export interface ClientRetrait {
  id: number;
  montant_demande: string;
  montant_recu?: string;
  date_demande: string;
  date_traitement?: string;
  statut: 'en_attente' | 'valide' | 'traite' | 'rejete';
  type_retrait: 'partiel' | 'fin_cycle' | 'urgence' | 'distribution';
  tontine_nom: string;
  agent_validateur?: string;
  motif_rejet?: string;
  frais_traitement?: string;
  justification?: string;
}

export interface ClientTontine {
  id: string;
  nom: string;
  description: string;
  sfd_gestionnaire: string;
  administrateur: string;
  montant_cotisation: string;
  nombre_participants: number;
  cycle_actuel: number;
  progression: number; // pourcentage
  statut_participation: 'actif' | 'suspendu' | 'en_attente' | 'termine';
  position_distribution: number;
  prochaine_date_reception?: string;
  solde_accumule: string;
  nombre_cotisations_effectuees: number;
  taux_ponctualite: number;
  montant_total_cotise: string;
  prochaines_echeances: string[];
  distributions_recues: number;
}

export interface ClientStats {
  total_cotisations: string;
  moyenne_mensuelle: string;
  jours_ponctualite: number;
  bonus_appliques: string;
  penalites_appliquees: string;
  total_retraits: string;
  delai_moyen_traitement: number;
  taux_approbation: number;
  solde_disponible: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = 'https://tontiflexapp.onrender.com/api';

// Hook pour lister les clients
export const useClients = (filters: ClientsFilters = {}) => {
  const [clients, setClients] = useState<PaginatedClientList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchClients = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Construction des paramètres de requête
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/accounts/clients/?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: PaginatedClientList = await response.json();
      setClients(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des clients',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
  };
};

// Hook pour récupérer un client spécifique
export const useClient = (id: string | null) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchClient = useCallback(async () => {
    if (!accessToken || !id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/clients/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé à ce profil');
        }
        if (response.status === 404) {
          throw new Error('Client introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: Client = await response.json();
      setClient(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement du client',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [fetchClient, id]);

  return {
    client,
    isLoading,
    error,
    refetch: fetchClient,
  };
};

// Hook pour l'historique des cotisations d'un client
export const useClientCotisations = (clientId: string | null) => {
  const [cotisations, setCotisations] = useState<ClientCotisation[] | null>(null);
  const [stats, setStats] = useState<Partial<ClientStats> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchClientCotisations = useCallback(async () => {
    if (!accessToken || !clientId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/clients/${clientId}/cotisations/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé à cet historique');
        }
        if (response.status === 404) {
          throw new Error('Client introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // La réponse peut contenir les cotisations et les statistiques
      if (Array.isArray(data)) {
        setCotisations(data);
      } else if (data.cotisations) {
        setCotisations(data.cotisations);
        setStats(data.stats);
      } else {
        setCotisations(data);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des cotisations du client',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, clientId]);

  useEffect(() => {
    if (clientId) {
      fetchClientCotisations();
    }
  }, [fetchClientCotisations, clientId]);

  return {
    cotisations,
    stats,
    isLoading,
    error,
    refetch: fetchClientCotisations,
  };
};

// Hook pour l'historique des retraits d'un client
export const useClientRetraits = (clientId: string | null) => {
  const [retraits, setRetraits] = useState<ClientRetrait[] | null>(null);
  const [stats, setStats] = useState<Partial<ClientStats> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchClientRetraits = useCallback(async () => {
    if (!accessToken || !clientId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/clients/${clientId}/retraits/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé à cet historique');
        }
        if (response.status === 404) {
          throw new Error('Client introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // La réponse peut contenir les retraits et les statistiques
      if (Array.isArray(data)) {
        setRetraits(data);
      } else if (data.retraits) {
        setRetraits(data.retraits);
        setStats(data.stats);
      } else {
        setRetraits(data);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des retraits du client',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, clientId]);

  useEffect(() => {
    if (clientId) {
      fetchClientRetraits();
    }
  }, [fetchClientRetraits, clientId]);

  return {
    retraits,
    stats,
    isLoading,
    error,
    refetch: fetchClientRetraits,
  };
};

// Hook pour les tontines d'un client
export const useClientTontines = (clientId: string | null) => {
  const [tontines, setTontines] = useState<ClientTontine[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchClientTontines = useCallback(async () => {
    if (!accessToken || !clientId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/clients/${clientId}/tontines/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé à ces informations');
        }
        if (response.status === 404) {
          throw new Error('Client introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: ClientTontine[] = await response.json();
      setTontines(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des tontines du client',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, clientId]);

  useEffect(() => {
    if (clientId) {
      fetchClientTontines();
    }
  }, [fetchClientTontines, clientId]);

  return {
    tontines,
    isLoading,
    error,
    refetch: fetchClientTontines,
  };
};

// Hook combiné pour toutes les données d'un client
export const useClientDetails = (clientId: string | null) => {
  const { client, isLoading: isLoadingClient, error: clientError, refetch: refetchClient } = useClient(clientId);
  const { cotisations, stats: cotisationsStats, isLoading: isLoadingCotisations, error: cotisationsError, refetch: refetchCotisations } = useClientCotisations(clientId);
  const { retraits, stats: retraitsStats, isLoading: isLoadingRetraits, error: retraitsError, refetch: refetchRetraits } = useClientRetraits(clientId);
  const { tontines, isLoading: isLoadingTontines, error: tontinesError, refetch: refetchTontines } = useClientTontines(clientId);

  const refetchAll = useCallback(() => {
    refetchClient();
    refetchCotisations();
    refetchRetraits();
    refetchTontines();
  }, [refetchClient, refetchCotisations, refetchRetraits, refetchTontines]);

  return {
    client,
    cotisations,
    retraits,
    tontines,
    stats: {
      ...cotisationsStats,
      ...retraitsStats,
    },
    isLoading: isLoadingClient || isLoadingCotisations || isLoadingRetraits || isLoadingTontines,
    error: clientError || cotisationsError || retraitsError || tontinesError,
    refetchAll,
  };
};

// Hook utilitaire pour rechercher des clients
export const useClientSearch = () => {
  const [searchResults, setSearchResults] = useState<Client[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const searchClients = useCallback(async (query: string, filters: Omit<ClientsFilters, 'search'> = {}) => {
    if (!accessToken || !query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const searchParams = new URLSearchParams({
        search: query.trim(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        ),
      });

      const response = await fetch(`${API_BASE_URL}/accounts/clients/?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: PaginatedClientList = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setSearchError({
        message: err instanceof Error ? err.message : 'Erreur lors de la recherche de clients',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsSearching(false);
    }
  }, [accessToken]);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchClients,
    clearSearch,
  };
};