import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

import type {
  SavingsAccount,
  CreateSavingsAccountData,
  UpdateSavingsAccountData,
  DepositData,
  PayFeesData,
  WithdrawData,
  ValidateRequestData,
  CreateRequestData,
  TransactionHistory,
  SFDSelection,
  AccountStatusResponse,
  MyAccountSummary,
  PaginatedSavingsAccountList,
  PaginatedTransactionHistoryList,
  PaginatedSFDSelectionList,
  SavingsAccountFilters,
} from '../types/saving-accounts';

interface useSavingsAccountsAPIResults {
  savingsAccounts: SavingsAccount[];
  savingsAccount: SavingsAccount | null;
  myAccount: MyAccountSummary | null;
  transactionHistory: TransactionHistory[];
  availableSFDs: SFDSelection[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchSavingsAccounts: (filters?: SavingsAccountFilters) => Promise<PaginatedSavingsAccountList>;
  fetchSavingsAccountById: (id: string) => Promise<SavingsAccount | null>;
  createSavingsAccount: (accountData: CreateSavingsAccountData) => Promise<SavingsAccount>;
  updateSavingsAccount: (id: string, accountData: UpdateSavingsAccountData) => Promise<SavingsAccount>;
  updateSavingsAccountPartial: (id: string, accountData: Partial<UpdateSavingsAccountData>) => Promise<SavingsAccount>;
  deleteSavingsAccount: (id: string) => Promise<boolean>;

  // Specialized operations
  deposit: (id: string, depositData: DepositData) => Promise<AccountStatusResponse>;
  payFees: (id: string, payFeesData: PayFeesData) => Promise<AccountStatusResponse>;
  withdraw: (id: string, withdrawData: WithdrawData) => Promise<AccountStatusResponse>;
  validateRequest: (id: string, validateData: ValidateRequestData) => Promise<AccountStatusResponse>;
  fetchTransactionHistory: (id: string, page?: number) => Promise<PaginatedTransactionHistoryList>;
  fetchAvailableSFDs: (page?: number) => Promise<PaginatedSFDSelectionList>;
  createRequest: (requestData: CreateRequestData) => Promise<AccountStatusResponse>;
  fetchMyAccount: () => Promise<MyAccountSummary | null>;
}

export function useSavingsAccounts(): useSavingsAccountsAPIResults {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [savingsAccount, setSavingsAccount] = useState<SavingsAccount | null>(null);
  const [myAccount, setMyAccount] = useState<MyAccountSummary | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
  const [availableSFDs, setAvailableSFDs] = useState<SFDSelection[]>([]);
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

  // Récupérer la liste des comptes épargne
  const fetchSavingsAccounts = useCallback(async (filters: SavingsAccountFilters = {}): Promise<PaginatedSavingsAccountList> => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${baseUrl}/savings/accounts/?${searchParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des comptes épargne');
      }
      
      const data: PaginatedSavingsAccountList = await response.json();
      setSavingsAccounts(data.results || []);
      console.log("comptes épargne", data.results);
      return data;
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
      
      const accountData = await response.json();
      setSavingsAccount(accountData);
      return accountData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error('Erreur lors du chargement du compte épargne');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer une demande de compte épargne
  const createSavingsAccount = async (accountData: CreateSavingsAccountData): Promise<SavingsAccount> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs optionnels si présents
      if (accountData.statut) formData.append('statut', accountData.statut);
      formData.append('piece_identite', accountData.piece_identite);
      formData.append('photo_identite', accountData.photo_identite);
      if (accountData.numero_telephone_paiement) formData.append('numero_telephone_paiement', accountData.numero_telephone_paiement);
      if (accountData.frais_creation) formData.append('frais_creation', accountData.frais_creation);
      if (accountData.date_demande) formData.append('date_demande', accountData.date_demande);
      if (accountData.date_validation_agent) formData.append('date_validation_agent', accountData.date_validation_agent);
      if (accountData.date_paiement_frais) formData.append('date_paiement_frais', accountData.date_paiement_frais);
      if (accountData.date_activation) formData.append('date_activation', accountData.date_activation);
      if (accountData.commentaires_agent) formData.append('commentaires_agent', accountData.commentaires_agent);
      if (accountData.raison_rejet) formData.append('raison_rejet', accountData.raison_rejet);
      formData.append('client', accountData.client);
      if (accountData.sfd_choisie) formData.append('sfd_choisie', accountData.sfd_choisie);
      if (accountData.agent_validateur) formData.append('agent_validateur', accountData.agent_validateur);
      if (accountData.transaction_frais_creation) formData.append('transaction_frais_creation', accountData.transaction_frais_creation);

      const response = await fetch(`${baseUrl}/savings/accounts/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du compte épargne';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 400) {
            errorMessage = 'Données invalides ou client non éligible';
          } else if (response.status === 409) {
            errorMessage = 'Client possède déjà un compte épargne actif';
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
      toast.success('Demande de compte épargne créée avec succès');
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

  // Mettre à jour un compte épargne (PUT)
  const updateSavingsAccount = async (id: string, accountData: UpdateSavingsAccountData): Promise<SavingsAccount> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      if (accountData.statut) formData.append('statut', accountData.statut);
      if (accountData.piece_identite) formData.append('piece_identite', accountData.piece_identite);
      if (accountData.photo_identite) formData.append('photo_identite', accountData.photo_identite);
      if (accountData.numero_telephone_paiement) formData.append('numero_telephone_paiement', accountData.numero_telephone_paiement);
      if (accountData.frais_creation) formData.append('frais_creation', accountData.frais_creation);
      if (accountData.date_demande) formData.append('date_demande', accountData.date_demande);
      if (accountData.date_validation_agent) formData.append('date_validation_agent', accountData.date_validation_agent);
      if (accountData.date_paiement_frais) formData.append('date_paiement_frais', accountData.date_paiement_frais);
      if (accountData.date_activation) formData.append('date_activation', accountData.date_activation);
      if (accountData.commentaires_agent) formData.append('commentaires_agent', accountData.commentaires_agent);
      if (accountData.raison_rejet) formData.append('raison_rejet', accountData.raison_rejet);
      if (accountData.client) formData.append('client', accountData.client);
      if (accountData.sfd_choisie) formData.append('sfd_choisie', accountData.sfd_choisie);
      if (accountData.agent_validateur) formData.append('agent_validateur', accountData.agent_validateur);
      if (accountData.transaction_frais_creation) formData.append('transaction_frais_creation', accountData.transaction_frais_creation);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du compte épargne');
      }

      const updatedAccount = await response.json();
      setSavingsAccounts(prev => 
        prev.map(account => account.id === id ? { ...account, ...updatedAccount } : account)
      );
      setSavingsAccount(updatedAccount);
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

  // Mettre à jour partiellement un compte épargne (PATCH)
  const updateSavingsAccountPartial = async (id: string, accountData: Partial<UpdateSavingsAccountData>): Promise<SavingsAccount> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      if (accountData.statut) formData.append('statut', accountData.statut);
      if (accountData.piece_identite) formData.append('piece_identite', accountData.piece_identite);
      if (accountData.photo_identite) formData.append('photo_identite', accountData.photo_identite);
      if (accountData.numero_telephone_paiement) formData.append('numero_telephone_paiement', accountData.numero_telephone_paiement);
      if (accountData.frais_creation) formData.append('frais_creation', accountData.frais_creation);
      if (accountData.date_demande) formData.append('date_demande', accountData.date_demande);
      if (accountData.date_validation_agent) formData.append('date_validation_agent', accountData.date_validation_agent);
      if (accountData.date_paiement_frais) formData.append('date_paiement_frais', accountData.date_paiement_frais);
      if (accountData.date_activation) formData.append('date_activation', accountData.date_activation);
      if (accountData.commentaires_agent) formData.append('commentaires_agent', accountData.commentaires_agent);
      if (accountData.raison_rejet) formData.append('raison_rejet', accountData.raison_rejet);
      if (accountData.client) formData.append('client', accountData.client);
      if (accountData.sfd_choisie) formData.append('sfd_choisie', accountData.sfd_choisie);
      if (accountData.agent_validateur) formData.append('agent_validateur', accountData.agent_validateur);
      if (accountData.transaction_frais_creation) formData.append('transaction_frais_creation', accountData.transaction_frais_creation);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour partielle du compte épargne');
      }

      const updatedAccount = await response.json();
      setSavingsAccounts(prev => 
        prev.map(account => account.id === id ? { ...account, ...updatedAccount } : account)
      );
      setSavingsAccount(updatedAccount);
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
  const deleteSavingsAccount = async (id: string): Promise<boolean> => {
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
      if (savingsAccount?.id === id) {
        setSavingsAccount(null);
      }
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

  // Effectuer un dépôt via Mobile Money
  const deposit = async (id: string, depositData: DepositData): Promise<AccountStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('montant', depositData.montant);
      formData.append('numero_telephone', depositData.numero_telephone);
      if (depositData.commentaires) formData.append('commentaires', depositData.commentaires);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/deposit/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
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
      
      // Rafraîchir le compte si c'est le compte affiché
      if (savingsAccount?.id === id) {
        await fetchSavingsAccountById(id);
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

  // Payer les frais de création via Mobile Money
  const payFees = async (id: string, payFeesData: PayFeesData): Promise<AccountStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('numero_telephone', payFeesData.numero_telephone);
      formData.append('confirmer_montant', payFeesData.confirmer_montant);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/pay-fees/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
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
      if (savingsAccount?.id === id) {
        await fetchSavingsAccountById(id);
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

  // Effectuer un retrait via Mobile Money
  const withdraw = async (id: string, withdrawData: WithdrawData): Promise<AccountStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('montant', withdrawData.montant);
      formData.append('numero_telephone', withdrawData.numero_telephone);
      if (withdrawData.motif_retrait) formData.append('motif_retrait', withdrawData.motif_retrait);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/withdraw/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
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
      
      // Rafraîchir le compte
      if (savingsAccount?.id === id) {
        await fetchSavingsAccountById(id);
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

  // Valider une demande de compte épargne (Agent SFD)
  const validateRequest = async (id: string, validateData: ValidateRequestData): Promise<AccountStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('approuver', validateData.approuver.toString());
      if (validateData.commentaires) formData.append('commentaires', validateData.commentaires);
      if (validateData.raison_rejet) formData.append('raison_rejet', validateData.raison_rejet);

      const response = await fetch(`${baseUrl}/savings/accounts/${id}/validate-request/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
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
      toast.success(validateData.approuver ? 'Demande validée avec succès' : 'Demande rejetée');
      
      // Rafraîchir le compte
      if (savingsAccount?.id === id) {
        await fetchSavingsAccountById(id);
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

  // Récupérer l'historique des transactions du compte
  const fetchTransactionHistory = async (id: string, page?: number): Promise<PaginatedTransactionHistoryList> => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (page) searchParams.append('page', page.toString());

      const url = `${baseUrl}/savings/accounts/${id}/transactions/?${searchParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'historique des transactions');
      }
      
      const data: PaginatedTransactionHistoryList = await response.json();
      setTransactionHistory(data.results || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement de l\'historique des transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la liste des SFDs disponibles
  const fetchAvailableSFDs = async (page?: number): Promise<PaginatedSFDSelectionList> => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (page) searchParams.append('page', page.toString());

      const url = `${baseUrl}/savings/accounts/available-sfds/?${searchParams.toString()}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des SFDs disponibles');
      }
      
      const data: PaginatedSFDSelectionList = await response.json();
      setAvailableSFDs(data.results || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des SFDs disponibles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer une demande de compte épargne
  const createRequest = async (requestData: CreateRequestData): Promise<AccountStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('piece_identite', requestData.piece_identite);
      formData.append('photo_identite', requestData.photo_identite);
      formData.append('sfd_id', requestData.sfd_id);
      if (requestData.numero_telephone_paiement) formData.append('numero_telephone_paiement', requestData.numero_telephone_paiement);

      const response = await fetch(`${baseUrl}/savings/accounts/create-request/`, {
        method: 'POST',
        headers: getAuthHeaders(true), // multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création de la demande';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (response.status === 400) {
            errorMessage = 'Données invalides ou client non éligible';
          } else if (response.status === 409) {
            errorMessage = 'Client possède déjà un compte épargne';
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

  // Récupérer mes comptes épargne (Client)
  const fetchMyAccount = async (): Promise<MyAccountSummary | null> => {
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
      setMyAccount(accountData.accounts);
      return accountData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement de votre compte épargne');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    savingsAccounts,
    savingsAccount,
    myAccount,
    transactionHistory,
    availableSFDs,
    loading,
    error,
    fetchSavingsAccounts,
    fetchSavingsAccountById,
    createSavingsAccount,
    updateSavingsAccount,
    updateSavingsAccountPartial,
    deleteSavingsAccount,
    deposit,
    payFees,
    withdraw,
    validateRequest,
    fetchTransactionHistory,
    fetchAvailableSFDs,
    createRequest,
    fetchMyAccount,
  };
}