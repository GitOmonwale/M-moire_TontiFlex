import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

import type {
  Loan,
  CreateLoanData,
  UpdateLoanData,
  DecaissementData,
  RepaymentData,
  CalendrierRemboursement,
  MyLoan,
  MyLoansResponse,
  PaginatedLoanList,
  LoanFilters,
} from '../types/loans';

interface useLoansAPIResults {
  loans: Loan[];
  loan: Loan | null;
  myLoans: MyLoan[];
  calendrierRemboursement: CalendrierRemboursement | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchLoans: (filters?: LoanFilters) => Promise<PaginatedLoanList>;
  fetchLoanById: (id: string) => Promise<Loan | null>;
  createLoan: (loanData: CreateLoanData) => Promise<Loan>;
  updateLoan: (id: string, loanData: UpdateLoanData) => Promise<Loan>;
  updateLoanPartial: (id: string, loanData: Partial<UpdateLoanData>) => Promise<Loan>;
  deleteLoan: (id: string) => Promise<boolean>;

  // Specialized operations
  fetchCalendrierRemboursement: (id: string) => Promise<CalendrierRemboursement>;
  decaissement: (id: string, decaissementData: DecaissementData) => Promise<Loan>;
  repay: (id: string, repaymentData: RepaymentData) => Promise<any>;
  fetchMyLoans: () => Promise<MyLoansResponse>;
}

export function useLoans(): useLoansAPIResults {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [myLoans, setMyLoans] = useState<MyLoan[]>([]);
  const [calendrierRemboursement, setCalendrierRemboursement] = useState<CalendrierRemboursement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const baseUrl = 'https://tontiflexapp.onrender.com/api';

  const getAuthHeaders = (isFormData = false) => {
    const headers: HeadersInit = {
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  // Récupérer la liste des prêts accordés
  const fetchLoans = useCallback(async (filters: LoanFilters = {}): Promise<PaginatedLoanList> => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${baseUrl}/loans/?${searchParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des prêts accordés');
      }
      
      const data: PaginatedLoanList = await response.json();
      setLoans(data.results || []);
      console.log("prêts accordés", data.results);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des prêts accordés');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Récupérer un prêt par ID
  const fetchLoanById = async (id: string): Promise<Loan | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/loans/${id}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du prêt');
      }
      
      const loanData = await response.json();
      setLoan(loanData);
      return loanData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error('Erreur lors du chargement du prêt');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un prêt (Interne)
  const createLoan = async (loanData: CreateLoanData): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du prêt';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
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

      const newLoan = await response.json();
      setLoans(prev => [newLoan, ...prev]);
      toast.success('Prêt créé avec succès');
      return newLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un prêt (PUT)
  const updateLoan = async (id: string, loanData: UpdateLoanData): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du prêt');
      }

      const updatedLoan = await response.json();
      setLoans(prev => 
        prev.map(loan => loan.id === id ? { ...loan, ...updatedLoan } : loan)
      );
      setLoan(updatedLoan);
      toast.success('Prêt mis à jour avec succès');
      return updatedLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour partiellement un prêt (PATCH)
  const updateLoanPartial = async (id: string, loanData: Partial<UpdateLoanData>): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour partielle du prêt');
      }

      const updatedLoan = await response.json();
      setLoans(prev => 
        prev.map(loan => loan.id === id ? { ...loan, ...updatedLoan } : loan)
      );
      setLoan(updatedLoan);
      toast.success('Prêt mis à jour avec succès');
      return updatedLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un prêt
  const deleteLoan = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Erreur lors de la suppression du prêt');
      }

      setLoans(prev => prev.filter(loan => loan.id !== id));
      if (loan?.id === id) {
        setLoan(null);
      }
      toast.success('Prêt supprimé avec succès');
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

  // Récupérer le calendrier de remboursement complet
  const fetchCalendrierRemboursement = async (id: string): Promise<CalendrierRemboursement> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/loans/${id}/calendrier-remboursement/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Non autorisé à consulter ce calendrier');
        } else if (response.status === 404) {
          throw new Error('Prêt non trouvé');
        }
        throw new Error('Erreur lors du chargement du calendrier de remboursement');
      }
      
      const data: CalendrierRemboursement = await response.json();
      setCalendrierRemboursement(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Marquer un prêt comme décaissé
  const decaissement = async (id: string, decaissementData: DecaissementData): Promise<Loan> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/${id}/decaissement/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(decaissementData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du décaissement';
        if (response.status === 400) {
          errorMessage = 'Prêt non décaissable ou données invalides';
        } else if (response.status === 403) {
          errorMessage = 'Non autorisé à effectuer le décaissement';
        } else if (response.status === 404) {
          errorMessage = 'Prêt non trouvé';
        }
        throw new Error(errorMessage);
      }

      const updatedLoan = await response.json();
      
      // Mettre à jour la liste des prêts
      setLoans(prev => 
        prev.map(loan => loan.id === id ? { ...loan, ...updatedLoan } : loan)
      );
      
      // Mettre à jour le prêt affiché
      if (loan?.id === id) {
        setLoan(updatedLoan);
      }
      
      toast.success('Prêt décaissé avec succès');
      return updatedLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Effectuer un remboursement via KKiaPay
  const repay = async (id: string, repaymentData: RepaymentData): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/loans/${id}/repay/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(repaymentData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du remboursement';
        if (response.status === 400) {
          errorMessage = 'Données invalides ou échéance non trouvée';
        } else if (response.status === 403) {
          errorMessage = 'Permission refusée';
        } else if (response.status === 404) {
          errorMessage = 'Prêt non trouvé';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Remboursement initié avec succès');
      
      // Rafraîchir le prêt si c'est le prêt affiché
      if (loan?.id === id) {
        await fetchLoanById(id);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer mes prêts (Client)
  const fetchMyLoans = async (): Promise<MyLoansResponse> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/loans/my-loans/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          const emptyResponse: MyLoansResponse = { success: true, count: 0, loans: [] };
          setMyLoans([]);
          return emptyResponse;
        }
        throw new Error('Erreur lors du chargement de vos prêts');
      }
      
      const data: MyLoansResponse = await response.json();
      setMyLoans(data.loans || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement de vos prêts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loans,
    loan,
    myLoans,
    calendrierRemboursement,
    loading,
    error,
    fetchLoans,
    fetchLoanById,
    createLoan,
    updateLoan,
    updateLoanPartial,
    deleteLoan,
    fetchCalendrierRemboursement,
    decaissement,
    repay,
    fetchMyLoans,
  };
}