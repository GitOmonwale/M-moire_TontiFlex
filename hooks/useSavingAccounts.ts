import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import {SavingsAccount, SavingsAccountSummary, AccountStatusResponse, TransactionHistory, CreateSavingsAccountRequestData, CreateSavingsAccountData, UpdateSavingsAccountData, DepositData, WithdrawData, PayFeesData, ValidateRequestData} from '../types/saving-accounts';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface useSavingsAccountsResults {
  savingsAccounts: SavingsAccount[];
  myAccount: SavingsAccountSummary | null;
  loading: boolean;
  error: string | null;
  
  // Gestion des comptes
  fetchSavingsAccounts: () => Promise<void>;
  fetchSavingsAccountById: (id: string) => Promise<SavingsAccount | null>;
  fetchMyAccount: () => Promise<SavingsAccountSummary | null>;
  createSavingsAccount: (accountData: CreateSavingsAccountData | FormData) => Promise<SavingsAccount>;
  createAccountRequest: (requestData: CreateSavingsAccountRequestData | FormData) => Promise<AccountStatusResponse>;
  updateSavingsAccount: (id: string, accountData: UpdateSavingsAccountData | FormData) => Promise<SavingsAccount>;
  deleteSavingsAccount: (id: string) => Promise<boolean>;
  
  // Gestion des transactions
  deposit: (id: string, depositData: DepositData) => Promise<any>;
  withdraw: (id: string, withdrawData: WithdrawData) => Promise<any>;
  payFees: (id: string, payFeesData: PayFeesData) => Promise<AccountStatusResponse>;
  
  // Gestion des validations
  validateRequest: (id: string, validationData: ValidateRequestData) => Promise<AccountStatusResponse>;
  
  // Historique
  fetchTransactionHistory: (id: string) => Promise<TransactionHistory[]>;
}

export function useSavingsAccounts(): useSavingsAccountsResults {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [myAccount, setMyAccount] = useState<SavingsAccountSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const baseUrl = 'https://gep-api-fn92.onrender.com/api';

  const getAuthHeaders = (isFormData = false) => {
    const headers: HeadersInit = {
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  // Récupérer la liste des comptes épargne
  const fetchSavingsAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des comptes épargne');
      }
      
      const data: PaginatedResponse<SavingsAccount> = await response.json();
      setSavingsAccounts(data.results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des comptes épargne');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Récupérer un compte épargne par ID
  const fetchSavingsAccountById = async (id: string): Promise<SavingsAccount | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du compte épargne');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error('Erreur lors du chargement du compte épargne');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer mon compte épargne (client connecté)
  const fetchMyAccount = async (): Promise<SavingsAccountSummary | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/savings/accounts/my-account/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setMyAccount(null);
          return null;
        }
        throw new Error('Erreur lors du chargement de votre compte épargne');
      }
      
      const accountData = await response.json();
      setMyAccount(accountData);
      return accountData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error('Erreur lors du chargement de votre compte épargne');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un compte épargne (Admin/Agent)
  const createSavingsAccount = async (accountData: CreateSavingsAccountData | FormData) => {
    setLoading(true);
    setError(null);
    try {
      const isFormData = accountData instanceof FormData;
      
      const response = await fetch(`${baseUrl}/savings/accounts/`, {
        method: 'POST',
        headers: getAuthHeaders(isFormData),
        body: isFormData ? accountData : JSON.stringify(accountData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du compte épargne';
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

      const newAccount = await response.json();
      setSavingsAccounts(prev => [newAccount, ...prev]);
      toast.success('Compte épargne créé avec succès');
      return newAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer une demande de compte épargne (Client)
  const createAccountRequest = async (requestData: CreateSavingsAccountRequestData | FormData) => {
    setLoading(true);
    setError(null);
    try {
      const isFormData = requestData instanceof FormData;
      
      const response = await fetch(`${baseUrl}/savings/accounts/create-request/`, {
        method: 'POST',
        headers: getAuthHeaders(isFormData),
        body: isFormData ? requestData : JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création de la demande';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Demande de compte épargne créée avec succès');
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

  // Mettre à jour un compte épargne
  const updateSavingsAccount = async (id: string, accountData: UpdateSavingsAccountData | FormData) => {
    setLoading(true);
    setError(null);
    try {
      const isFormData = accountData instanceof FormData;
      
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(isFormData),
        body: isFormData ? accountData : JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du compte épargne');
      }

      const updatedAccount = await response.json();
      setSavingsAccounts(prev => 
        prev.map(account => account.id === id ? { ...account, ...updatedAccount } : account)
      );
      toast.success('Compte épargne mis à jour avec succès');
      return updatedAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fermer un compte épargne
  const deleteSavingsAccount = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Erreur lors de la fermeture du compte épargne');
      }

      setSavingsAccounts(prev => prev.filter(account => account.id !== id));
      toast.success('Compte épargne fermé avec succès');
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

  // Effectuer un dépôt
  const deposit = async (id: string, depositData: DepositData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/deposit/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du dépôt';
        if (response.status === 400) {
          errorMessage = 'Montant invalide ou compte non actif';
        } else if (response.status === 402) {
          errorMessage = 'Solde Mobile Money insuffisant';
        } else if (response.status === 503) {
          errorMessage = 'Service Mobile Money indisponible';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Dépôt effectué avec succès');
      // Rafraîchir le compte si c'est le compte de l'utilisateur
      if (myAccount?.id === id) {
        await fetchMyAccount();
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

  // Effectuer un retrait
  const withdraw = async (id: string, withdrawData: WithdrawData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/withdraw/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(withdrawData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du retrait';
        if (response.status === 400) {
          errorMessage = 'Montant invalide ou solde insuffisant';
        } else if (response.status === 403) {
          errorMessage = 'Limite de retrait dépassée';
        } else if (response.status === 503) {
          errorMessage = 'Service Mobile Money indisponible';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Retrait effectué avec succès');
      // Rafraîchir le compte si c'est le compte de l'utilisateur
      if (myAccount?.id === id) {
        await fetchMyAccount();
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

  // Payer les frais de création
  const payFees = async (id: string, payFeesData: PayFeesData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/pay-fees/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payFeesData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du paiement des frais';
        if (response.status === 400) {
          errorMessage = 'Erreur de paiement ou demande non validée';
        } else if (response.status === 402) {
          errorMessage = 'Solde Mobile Money insuffisant';
        } else if (response.status === 503) {
          errorMessage = 'Service Mobile Money temporairement indisponible';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Frais de création payés avec succès');
      // Rafraîchir le compte
      await fetchMyAccount();
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

  // Valider une demande (Agent SFD)
  const validateRequest = async (id: string, validationData: ValidateRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/validate-request/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(validationData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la validation';
        if (response.status === 400) {
          errorMessage = 'Données de validation invalides';
        } else if (response.status === 403) {
          errorMessage = 'Agent non autorisé pour cette SFD';
        } else if (response.status === 404) {
          errorMessage = 'Demande de compte introuvable';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success(validationData.decision === 'valide' ? 'Demande validée avec succès' : 'Demande rejetée');
      // Rafraîchir la liste des comptes
      await fetchSavingsAccounts();
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

  // Récupérer l'historique des transactions
  const fetchTransactionHistory = async (id: string): Promise<TransactionHistory[]> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/savings/accounts/${id}/transactions/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'historique des transactions');
      }
      
      const data: PaginatedResponse<TransactionHistory> = await response.json();
      return data.results || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement de l\'historique des transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    savingsAccounts,
    myAccount,
    loading,
    error,
    fetchSavingsAccounts,
    fetchSavingsAccountById,
    fetchMyAccount,
    createSavingsAccount,
    createAccountRequest,
    updateSavingsAccount,
    deleteSavingsAccount,
    deposit,
    withdraw,
    payFees,
    validateRequest,
    fetchTransactionHistory,
  };
}