// src/hooks/useTontines.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tontine,
  TontineCreateData,
  TontineUpdateData,
  TontineParticipant,
  PaginatedResponse,
  TontineFilters,
  ApiError
} from '@/types/tontines';

interface UseTontinesState {
  tontines: Tontine[];
  selectedTontine: Tontine | null;
  participants: TontineParticipant[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    currentPage: number;
  };
}

export const useTontines = () => {
  const { accessToken } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [state, setState] = useState<UseTontinesState>({
    tontines: [],
    selectedTontine: null,
    participants: [],
    loading: false,
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1
    }
  });

  // Helper function pour construire les headers d'authentification
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
    
    return null; // Pour les réponses 204 No Content
  };

  // 1. GET /api/api/tontines/tontines/ - Liste des tontines
  const getTontines = useCallback(async (filters: TontineFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.sfd) params.append('sfd', filters.sfd);

      const url = `${BASE_URL}/api/api/tontines/tontines/?${params.toString()}`;
      const data: PaginatedResponse<Tontine> = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        tontines: data.results,
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

  // 2. POST /api/api/tontines/tontines/ - Créer une nouvelle tontine
  const createTontine = useCallback(async (data: TontineCreateData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/tontines/`;
      const newTontine: Tontine = await authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        tontines: [newTontine, ...prev.tontines],
        loading: false
      }));

      return newTontine;
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

  // 3. GET /api/api/tontines/tontines/{id}/ - Détails d'une tontine
  const getTontineById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/tontines/${id}/`;
      const tontine: Tontine = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        selectedTontine: tontine,
        loading: false
      }));

      return tontine;
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

  // 4. PUT /api/api/tontines/tontines/{id}/ - Modifier une tontine
  const updateTontine = useCallback(async (id: string, data: TontineUpdateData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/tontines/${id}/`;
      const updatedTontine: Tontine = await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        tontines: prev.tontines.map(t => t.id === id ? updatedTontine : t),
        selectedTontine: prev.selectedTontine?.id === id ? updatedTontine : prev.selectedTontine,
        loading: false
      }));

      return updatedTontine;
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

  // 5. PATCH /api/api/tontines/tontines/{id}/ - Modification partielle
  const partialUpdateTontine = useCallback(async (id: string, data: Partial<TontineUpdateData>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/tontines/${id}/`;
      const updatedTontine: Tontine = await authenticatedFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      setState(prev => ({
        ...prev,
        tontines: prev.tontines.map(t => t.id === id ? updatedTontine : t),
        selectedTontine: prev.selectedTontine?.id === id ? updatedTontine : prev.selectedTontine,
        loading: false
      }));

      return updatedTontine;
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

  // 6. DELETE /api/api/tontines/tontines/{id}/ - Supprimer une tontine
  const deleteTontine = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = `${BASE_URL}/api/api/tontines/tontines/${id}/`;
      await authenticatedFetch(url, {
        method: 'DELETE',
      });

      setState(prev => ({
        ...prev,
        tontines: prev.tontines.filter(t => t.id !== id),
        selectedTontine: prev.selectedTontine?.id === id ? null : prev.selectedTontine,
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

  // 7. GET /api/api/tontines/tontines/{id}/participants/ - Participants d'une tontine
  const getTontineParticipants = useCallback(async (id: string, page = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page.toString());
      
      const url = `${BASE_URL}/api/api/tontines/tontines/${id}/participants/?${params.toString()}`;
      const data: PaginatedResponse<TontineParticipant> = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        participants: data.results,
        loading: false,
        pagination: {
          count: data.count,
          next: data.next,
          previous: data.previous,
          currentPage: page
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

  // 8. GET /api/api/tontines/tontines/available/ - Tontines disponibles
  const getAvailableTontines = useCallback(async (page = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page.toString());
      
      const url = `${BASE_URL}/api/api/tontines/tontines/available/?${params.toString()}`;
      const data: PaginatedResponse<Tontine> = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        tontines: data.results,
        loading: false,
        pagination: {
          count: data.count,
          next: data.next,
          previous: data.previous,
          currentPage: page
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

  // 9. GET /api/api/tontines/tontines/my-tontines/ - Mes tontines
  const getMyTontines = useCallback(async (page = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page.toString());
      
      const url = `${BASE_URL}/api/api/tontines/tontines/my-tontines/?${params.toString()}`;
      const data: PaginatedResponse<Tontine> = await authenticatedFetch(url);

      setState(prev => ({
        ...prev,
        tontines: data.results,
        loading: false,
        pagination: {
          count: data.count,
          next: data.next,
          previous: data.previous,
          currentPage: page
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

  // Fonction utilitaire pour nettoyer les erreurs
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fonction utilitaire pour nettoyer les données
  const clearData = useCallback(() => {
    setState({
      tontines: [],
      selectedTontine: null,
      participants: [],
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
    getTontines,
    createTontine,
    getTontineById,
    updateTontine,
    partialUpdateTontine,
    deleteTontine,
    
    // Actions spécialisées
    getTontineParticipants,
    getAvailableTontines,
    getMyTontines,
    
    // Utilitaires
    clearError,
    clearData,
    
    // État dérivé
    isLoading: state.loading,
    hasError: !!state.error,
    isEmpty: state.tontines.length === 0 && !state.loading,
    totalPages: Math.ceil(state.pagination.count / 10), // Assumant 10 items par page
  };
};