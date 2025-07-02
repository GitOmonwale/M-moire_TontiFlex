// src/hooks/useCarnets.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  CarnetCotisation,
  CarnetCreateData,
  CarnetUpdateData,
  CarnetFilters,
  PaginatedCarnetResponse,
  CalendrierCarnet,
  JourCotisation,
  CarnetStatistiques,
  MisesCochees
} from '@/types/carnets';
import { ApiError } from '@/types/tontines';

interface UseCarnetsState {
  carnets: CarnetCotisation[];
  selectedCarnet: CarnetCotisation | null;
  calendrier: CalendrierCarnet | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    currentPage: number;
  };
}

export const useCarnets = () => {
  const { accessToken } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gep-api-fn92.onrender.com';

  const [state, setState] = useState<UseCarnetsState>({
    carnets: [],
    selectedCarnet: null,
    calendrier: null,
    loading: false,
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
    }
  });

  // Helper function pour les headers d'authentification
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // Helper function pour gérer les erreurs
  const handleError = (error: any): ApiError => {
    console.error('API Error:', error);
    
    if (error.response) {
      return {
        message: error.response.data?.detail || error.response.data?.message || 'Erreur serveur',
        details: error.response.data,
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'Erreur de réseau. Vérifiez votre connexion.',
        details: error.request
      };
    } else {
      return {
        message: error.message || 'Une erreur inattendue est survenue',
        details: error
      };
    }
  };

  // Helper function pour faire des requêtes authentifiées
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  };

  // 1. GET /api/api/tontines/carnets-cotisation/ - Liste des carnets
  const getCarnets = useCallback(async (filters: CarnetFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.client) params.append('client', filters.client);
      if (filters.tontine) params.append('tontine', filters.tontine);
      if (filters.cycle_debut) params.append('cycle_debut', filters.cycle_debut);

      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/?${params.toString()}`;
      const data: PaginatedCarnetResponse = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        carnets: data.results,
        loading: false,
        pagination: {
          count: data.count,
          next: data.next,
          previous: data.previous,
          currentPage: filters.page || 1
        }
      }));

      return data;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // 2. POST /api/api/tontines/carnets-cotisation/ - Créer un carnet
  const createCarnet = useCallback(async (data: CarnetCreateData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/`;
      const newCarnet: CarnetCotisation = await authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        carnets: [newCarnet, ...prev.carnets],
        loading: false
      }));

      return newCarnet;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // 3. GET /api/api/tontines/carnets-cotisation/{id}/ - Détails d'un carnet
  const getCarnetById = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/${id}/`;
      const carnet: CarnetCotisation = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        selectedCarnet: carnet,
        loading: false
      }));

      return carnet;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // 4. PUT /api/api/tontines/carnets-cotisation/{id}/ - Modifier un carnet
  const updateCarnet = useCallback(async (id: number, data: CarnetUpdateData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/${id}/`;
      const updatedCarnet: CarnetCotisation = await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        carnets: prev.carnets.map(c => c.id === id ? updatedCarnet : c),
        selectedCarnet: prev.selectedCarnet?.id === id ? updatedCarnet : prev.selectedCarnet,
        loading: false
      }));

      return updatedCarnet;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // 5. PATCH /api/api/tontines/carnets-cotisation/{id}/ - Modification partielle
  const partialUpdateCarnet = useCallback(async (id: number, data: Partial<CarnetUpdateData>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/${id}/`;
      const updatedCarnet: CarnetCotisation = await authenticatedFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        carnets: prev.carnets.map(c => c.id === id ? updatedCarnet : c),
        selectedCarnet: prev.selectedCarnet?.id === id ? updatedCarnet : prev.selectedCarnet,
        loading: false
      }));

      return updatedCarnet;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // 6. DELETE /api/api/tontines/carnets-cotisation/{id}/ - Supprimer un carnet
  const deleteCarnet = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/carnets-cotisation/${id}/`;
      await authenticatedFetch(url, {
        method: 'DELETE',
      });

      setState(prev => ({
        ...prev,
        carnets: prev.carnets.filter(c => c.id !== id),
        selectedCarnet: prev.selectedCarnet?.id === id ? null : prev.selectedCarnet,
        loading: false
      }));

      return true;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [accessToken, BASE_URL]);

  // Utilitaire: Marquer/démarquer une cotisation pour un jour
  const toggleCotisation = useCallback(async (carnetId: number, jour: number, payer: boolean) => {
    const carnet = state.carnets.find(c => c.id === carnetId) || state.selectedCarnet;
    if (!carnet) throw new Error('Carnet non trouvé');

    const nouvelleMisesCochees: MisesCochees = { ...carnet.mises_cochees };
    nouvelleMisesCochees[`jour_${jour}`] = payer;

    return await partialUpdateCarnet(carnetId, {
      mises_cochees: nouvelleMisesCochees
    });
  }, [state.carnets, state.selectedCarnet, partialUpdateCarnet]);

  // Utilitaire: Calculer le calendrier d'un carnet
  const generateCalendrierCarnet = useCallback((carnet: CarnetCotisation): CalendrierCarnet => {
    const cycleDebut = new Date(carnet.cycle_debut);
    const jours: JourCotisation[] = [];
    
    let joursPayes = 0;
    let joursManques = 0;

    for (let i = 1; i <= 31; i++) {
      const dateJour = new Date(cycleDebut);
      dateJour.setDate(cycleDebut.getDate() + i - 1);
      
      const estPaye = carnet.mises_cochees?.[`jour_${i}`] || false;
      const estCommissionSfd = i === 1;
      const estEnRetard = !estPaye && dateJour < new Date();

      if (estPaye) joursPayes++;
      else if (dateJour < new Date()) joursManques++;

      jours.push({
        numero: i,
        date: dateJour.toISOString().split('T')[0],
        est_paye: estPaye,
        est_commission_sfd: estCommissionSfd,
        est_en_retard: estEnRetard
      });
    }

    const dateFin = new Date(cycleDebut);
    dateFin.setDate(cycleDebut.getDate() + 30);

    const statistiques: CarnetStatistiques = {
      jours_payes: joursPayes,
      jours_manques: joursManques,
      taux_ponctualite: (joursPayes / 31) * 100,
      jours_retard: joursManques,
      montant_total_verse: joursPayes * 1500, // À adapter selon le montant réel
      prochaine_echeance: jours.find(j => !j.est_paye && new Date(j.date) >= new Date())?.date || null,
      commission_sfd_payee: jours[0]?.est_paye || false
    };

    return {
      carnet,
      jours,
      statistiques,
      cycle_actuel: Math.floor((Date.now() - cycleDebut.getTime()) / (31 * 24 * 60 * 60 * 1000)) + 1,
      date_fin_cycle: dateFin.toISOString().split('T')[0]
    };
  }, []);

  // Utilitaire: Obtenir le calendrier d'un carnet spécifique
  const getCalendrierCarnet = useCallback(async (carnetId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const carnet = await getCarnetById(carnetId);
      const calendrier = generateCalendrierCarnet(carnet);
      
      setState(prev => ({
        ...prev,
        calendrier,
        loading: false
      }));

      return calendrier;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: apiError.message 
      }));
      throw apiError;
    }
  }, [getCarnetById, generateCalendrierCarnet]);

  // Utilitaire: Obtenir les carnets d'une tontine spécifique
  const getCarnetsByTontine = useCallback(async (tontineId: string) => {
    return await getCarnets({ tontine: tontineId });
  }, [getCarnets]);

  // Utilitaire: Obtenir les carnets d'un client spécifique
  const getCarnetsByClient = useCallback(async (clientId: string) => {
    return await getCarnets({ client: clientId });
  }, [getCarnets]);

  // Utilitaire: Créer un nouveau carnet pour une tontine
  const initializerCarnet = useCallback(async (clientId: string, tontineId: string) => {
    const today = new Date();
    const cycleDebut = today.toISOString().split('T')[0];
    
    // Initialiser les mises cochées (toutes à false)
    const misesInitiales: MisesCochees = {};
    for (let i = 1; i <= 31; i++) {
      misesInitiales[`jour_${i}`] = false;
    }

    return await createCarnet({
      cycle_debut: cycleDebut,
      mises_cochees: misesInitiales,
      client: clientId,
      tontine: tontineId
    });
  }, [createCarnet]);

  // Fonction utilitaire pour nettoyer les erreurs
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fonction utilitaire pour nettoyer les données
  const clearData = useCallback(() => {
    setState({
      carnets: [],
      selectedCarnet: null,
      calendrier: null,
      loading: false,
      error: null,
      pagination: {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1
      }
    });
  }, []);

  return {
    // État
    ...state,
    
    // Actions CRUD
    getCarnets,
    createCarnet,
    getCarnetById,
    updateCarnet,
    partialUpdateCarnet,
    deleteCarnet,
    
    // Actions spécialisées
    toggleCotisation,
    getCalendrierCarnet,
    getCarnetsByTontine,
    getCarnetsByClient,
    initializerCarnet,
    generateCalendrierCarnet,
    
    // Utilitaires
    clearError,
    clearData,
    
    // État dérivé
    isLoading: state.loading,
    hasError: !!state.error,
    isEmpty: state.carnets.length === 0 && !state.loading,
    totalPages: Math.ceil(state.pagination.count / 10),
  };
};