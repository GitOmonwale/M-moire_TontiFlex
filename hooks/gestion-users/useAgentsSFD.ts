import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { AgentSFDAdmin, AgentSFDFilters, PaginatedAgentSFDAdminList, CreateAgentSFDData, UpdateAgentSFDData } from '../../types/agents-sfd';

interface useAgentsSFDResults {
  agentsSFD: AgentSFDAdmin[];
  agentSFD: AgentSFDAdmin | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchAgentsSFD: (filters?: AgentSFDFilters) => Promise<PaginatedAgentSFDAdminList>;
  fetchAgentSFDById: (id: string) => Promise<AgentSFDAdmin | null>;
  createAgentSFD: (agentData: CreateAgentSFDData) => Promise<AgentSFDAdmin>;
  updateAgentSFD: (id: string, agentData: UpdateAgentSFDData) => Promise<AgentSFDAdmin>;
  updateAgentSFDPartial: (id: string, agentData: Partial<UpdateAgentSFDData>) => Promise<AgentSFDAdmin>;
  deleteAgentSFD: (id: string) => Promise<boolean>;
}

export function useAgentsSFD(): useAgentsSFDResults {
  const [agentsSFD, setAgentsSFD] = useState<AgentSFDAdmin[]>([]);
  const [agentSFD, setAgentSFD] = useState<AgentSFDAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const baseUrl = 'https://tontiflexapp.onrender.com/api';

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };
  };

  // Récupérer la liste des agents SFD
  const fetchAgentsSFD = useCallback(async (filters: AgentSFDFilters = {}): Promise<PaginatedAgentSFDAdminList> => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${baseUrl}/admin/agents-sfd/?${searchParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des agents SFD');
      }
      
      const data: PaginatedAgentSFDAdminList = await response.json();
      setAgentsSFD(data.results || []);
      console.log("agents SFD", data.results);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des agents SFD');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Récupérer un agent SFD par ID
  const fetchAgentSFDById = async (id: string): Promise<AgentSFDAdmin | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/agents-sfd/${id}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'agent SFD');
      }
      
      const agentData = await response.json();
      setAgentSFD(agentData);
      return agentData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error('Erreur lors du chargement de l\'agent SFD');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un agent SFD
  const createAgentSFD = async (agentData: CreateAgentSFDData): Promise<AgentSFDAdmin> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/admin/agents-sfd/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création de l\'agent SFD';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 403) {
            errorMessage = 'Permissions insuffisantes - Administrateur plateforme requis';
          } else if (typeof errorData === 'object') {
            const validationErrors = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
            if (validationErrors) {
              errorMessage = `Erreurs de validation :\n${validationErrors}`;
            }
          }
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      const newAgent = await response.json();
      setAgentsSFD(prev => [newAgent, ...prev]);
      toast.success('Agent SFD créé avec succès');
      return newAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un agent SFD (PUT)
  const updateAgentSFD = async (id: string, agentData: UpdateAgentSFDData): Promise<AgentSFDAdmin> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/admin/agents-sfd/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour de l\'agent SFD';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 403) {
            errorMessage = 'Permissions insuffisantes - Administrateur plateforme requis';
          } else if (response.status === 404) {
            errorMessage = 'Agent SFD introuvable';
          }
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      const updatedAgent = await response.json();
      setAgentsSFD(prev => 
        prev.map(agent => agent.email === updatedAgent.email ? { ...agent, ...updatedAgent } : agent)
      );
      setAgentSFD(updatedAgent);
      toast.success('Agent SFD mis à jour avec succès');
      return updatedAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour partiellement un agent SFD (PATCH)
  const updateAgentSFDPartial = async (id: string, agentData: Partial<UpdateAgentSFDData>): Promise<AgentSFDAdmin> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/admin/agents-sfd/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour partielle de l\'agent SFD';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 403) {
            errorMessage = 'Permissions insuffisantes - Administrateur plateforme requis';
          } else if (response.status === 404) {
            errorMessage = 'Agent SFD introuvable';
          }
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      const updatedAgent = await response.json();
      setAgentsSFD(prev => 
        prev.map(agent => agent.email === updatedAgent.email ? { ...agent, ...updatedAgent } : agent)
      );
      setAgentSFD(updatedAgent);
      toast.success('Agent SFD mis à jour avec succès');
      return updatedAgent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un agent SFD
  const deleteAgentSFD = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/admin/agents-sfd/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        let errorMessage = 'Erreur lors de la suppression de l\'agent SFD';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 403) {
            errorMessage = 'Permissions insuffisantes - Administrateur plateforme requis';
          } else if (response.status === 404) {
            errorMessage = 'Agent SFD introuvable';
          }
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      // Retirer de la liste locale par email (pas d'ID unique visible)
      setAgentsSFD(prev => prev.filter((_, index) => index.toString() !== id));
      if (agentSFD) {
        setAgentSFD(null);
      }
      toast.success('Agent SFD supprimé avec succès');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    agentsSFD,
    agentSFD,
    loading,
    error,
    fetchAgentsSFD,
    fetchAgentSFDById,
    createAgentSFD,
    updateAgentSFD,
    updateAgentSFDPartial,
    deleteAgentSFD,
  };
}