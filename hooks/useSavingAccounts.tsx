import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Types
export type SavingsAccountStatus = 
  | 'en_cours_creation' 
  | 'validee_agent' 
  | 'paiement_effectue' 
  | 'actif' 
  | 'suspendu' 
  | 'ferme' 
  | 'rejete';

export type OperateurMobileMoney = 'mtn' | 'moov' | 'orange';
export type TypePieceIdentite = 'CNI' | 'passeport' | 'permis';

export interface SavingsAccount {
  id: string; // UUID
  client_nom: string;
  agent_nom: string;
  sfd_nom: string;
  solde_disponible: string;
  prochaine_action: string;
  statut: SavingsAccountStatus;
  piece_identite: string;
  photo_identite: string;
  numero_telephone_paiement?: string | null;
  operateur_mobile_money?: OperateurMobileMoney | null;
  frais_creation: string;
  date_demande: string;
  date_validation_agent?: string | null;
  date_paiement_frais?: string | null;
  date_activation?: string | null;
  date_modification: string;
  commentaires_agent?: string | null;
  raison_rejet?: string | null;
  client: string; // UUID
  agent_validateur?: string | null; // UUID
  transaction_frais_creation?: string | null; // UUID
}

export interface SavingsAccountSummary {
  id: string;
  client_nom: string;
  statut: SavingsAccountStatus;
  date_demande: string;
  date_activation?: string | null;
  solde_disponible: string;
  nombre_transactions: string;
  derniere_transaction: string;
}

export interface PaginatedSavingsAccountList {
  count: number;
  next: string | null;
  previous: string | null;
  results: SavingsAccount[];
}

export interface SavingsAccountCreate {
  client?: number;
  piece_identite: string; // Base64 encoded
  photo_identite: string; // Base64 encoded
  type_piece_identite: TypePieceIdentite;
  numero_telephone: string;
  commentaires?: string;
}

export interface SavingsAccountUpdate {
  statut?: SavingsAccountStatus;
  piece_identite?: string;
  photo_identite?: string;
  numero_telephone_paiement?: string;
  operateur_mobile_money?: OperateurMobileMoney;
  frais_creation?: string;
  date_demande?: string;
  date_validation_agent?: string;
  date_paiement_frais?: string;
  date_activation?: string;
  commentaires_agent?: string;
  raison_rejet?: string;
  client?: string;
  agent_validateur?: string;
  transaction_frais_creation?: string;
}

export interface AccountStatusResponse {
  compte_id: string;
  statut: string;
  message: string;
  prochaine_action: string;
  solde_disponible: string;
}

export interface DepositRequest {
  montant: number;
  numero_telephone: string;
  description?: string;
}

export interface WithdrawRequest {
  montant: number;
  numero_telephone: string;
  description?: string;
}

export interface PayFeesRequest {
  numero_telephone: string;
}

export interface ValidateRequestData {
  decision: 'valide' | 'rejete';
  commentaires_agent: string;
}

export interface TransactionHistory {
  id: string;
  type: 'depot' | 'retrait' | 'frais';
  montant: string;
  description: string;
  date_transaction: string;
  statut: 'confirmee' | 'en_cours' | 'echouee';
  numero_transaction: string;
  operateur: OperateurMobileMoney;
  frais_appliques?: string;
}

export interface PaginatedTransactionHistoryList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransactionHistory[];
}

export interface SavingsAccountsFilters {
  page?: number;
  statut?: SavingsAccountStatus;
  client_id?: string;
  agent_validateur?: string;
  date_debut?: string;
  date_fin?: string;
}

export interface TransactionFilters {
  page?: number;
  type?: 'depot' | 'retrait' | 'frais';
  date_debut?: string;
  date_fin?: string;
  statut?: 'confirmee' | 'en_cours' | 'echouee';
  montant_min?: number;
  montant_max?: number;
}

interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = 'https://tontiflexapp.onrender.com/api';

// Hook pour lister les comptes épargne
export const useSavingsAccounts = (filters: SavingsAccountsFilters = {}) => {
  const [accounts, setAccounts] = useState<PaginatedSavingsAccountList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchAccounts = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/savings/accounts/?${searchParams.toString()}`;
      
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

      const data: PaginatedSavingsAccountList = await response.json();
      setAccounts(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des comptes épargne',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, filters]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    refetch: fetchAccounts,
  };
};

// Hook pour récupérer un compte épargne spécifique
export const useSavingsAccount = (id: string | null) => {
  const [account, setAccount] = useState<SavingsAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchAccount = useCallback(async () => {
    if (!accessToken || !id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: SavingsAccount = await response.json();
      setAccount(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement du compte épargne',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (id) {
      fetchAccount();
    }
  }, [fetchAccount, id]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccount,
  };
};

// Hook pour le compte épargne du client connecté
export const useMyAccount = () => {
  const [myAccount, setMyAccount] = useState<SavingsAccountSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchMyAccount = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/my-account/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Aucun compte épargne trouvé');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: SavingsAccountSummary = await response.json();
      setMyAccount(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement de votre compte',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchMyAccount();
  }, [fetchMyAccount]);

  return {
    myAccount,
    isLoading,
    error,
    refetch: fetchMyAccount,
  };
};

// Hook pour l'historique des transactions d'un compte
export const useAccountTransactions = (accountId: string | null, filters: TransactionFilters = {}) => {
  const [transactions, setTransactions] = useState<PaginatedTransactionHistoryList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!accessToken || !accountId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/savings/accounts/${accountId}/transactions/?${searchParams.toString()}`;
      
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

      const data: PaginatedTransactionHistoryList = await response.json();
      setTransactions(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du chargement des transactions',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, accountId, filters]);

  useEffect(() => {
    if (accountId) {
      fetchTransactions();
    }
  }, [fetchTransactions, accountId]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};

// Hook pour créer une demande de compte épargne
export const useCreateAccountRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const createAccountRequest = useCallback(async (data: Omit<SavingsAccountCreate, 'client'>): Promise<AccountStatusResponse | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/create-request/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(errorData.detail || 'Données invalides ou client non éligible');
        }
        if (response.status === 409) {
          throw new Error('Client possède déjà un compte épargne');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result: AccountStatusResponse = await response.json();
      return result;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la création de la demande',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    createAccountRequest,
    isLoading,
    error,
  };
};

// Hook pour créer un compte épargne (admin/agent)
export const useCreateSavingsAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const createAccount = useCallback(async (data: SavingsAccountCreate): Promise<SavingsAccount | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(errorData.detail || 'Données invalides ou client non éligible');
        }
        if (response.status === 409) {
          throw new Error('Client possède déjà un compte épargne actif');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const account: SavingsAccount = await response.json();
      return account;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la création du compte',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    createAccount,
    isLoading,
    error,
  };
};

// Hook pour mettre à jour un compte épargne (PUT)
export const useUpdateSavingsAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const updateAccount = useCallback(async (
    id: string, 
    data: SavingsAccountUpdate
  ): Promise<SavingsAccount | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const account: SavingsAccount = await response.json();
      return account;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du compte',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    updateAccount,
    isLoading,
    error,
  };
};

// Hook pour mettre à jour partiellement un compte épargne (PATCH)
export const usePatchSavingsAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const patchAccount = useCallback(async (
    id: string, 
    data: Partial<SavingsAccountUpdate>
  ): Promise<SavingsAccount | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const account: SavingsAccount = await response.json();
      return account;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la mise à jour partielle du compte',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    patchAccount,
    isLoading,
    error,
  };
};

// Hook pour fermer un compte épargne
export const useCloseSavingsAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const closeAccount = useCallback(async (id: string): Promise<boolean> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la fermeture du compte',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    closeAccount,
    isLoading,
    error,
  };
};

// Hook pour effectuer un dépôt
export const useDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const deposit = useCallback(async (accountId: string, data: DepositRequest): Promise<boolean> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${accountId}/deposit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error('Montant invalide ou compte non actif');
        }
        if (response.status === 402) {
          throw new Error('Solde Mobile Money insuffisant');
        }
        if (response.status === 503) {
          throw new Error('Service Mobile Money indisponible');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du dépôt',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    deposit,
    isLoading,
    error,
  };
};

// Hook pour effectuer un retrait
export const useWithdraw = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const withdraw = useCallback(async (accountId: string, data: WithdrawRequest): Promise<boolean> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${accountId}/withdraw/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error('Montant invalide ou solde insuffisant');
        }
        if (response.status === 403) {
          throw new Error('Limite de retrait dépassée');
        }
        if (response.status === 503) {
          throw new Error('Service Mobile Money indisponible');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du retrait',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    withdraw,
    isLoading,
    error,
  };
};

// Hook pour payer les frais de création
export const usePayFees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const payFees = useCallback(async (accountId: string, data: PayFeesRequest): Promise<AccountStatusResponse | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${accountId}/pay-fees/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error('Erreur de paiement ou demande non validée');
        }
        if (response.status === 402) {
          throw new Error('Solde Mobile Money insuffisant');
        }
        if (response.status === 503) {
          throw new Error('Service Mobile Money temporairement indisponible');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result: AccountStatusResponse = await response.json();
      return result;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors du paiement des frais',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    payFees,
    isLoading,
    error,
  };
};

// Hook pour valider une demande de compte (Agent SFD)
export const useValidateRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken } = useAuth();

  const validateRequest = useCallback(async (accountId: string, data: ValidateRequestData): Promise<AccountStatusResponse | null> => {
    if (!accessToken) {
      setError({ message: 'Token d\'accès manquant' });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/savings/accounts/${accountId}/validate-request/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error('Données de validation invalides');
        }
        if (response.status === 403) {
          throw new Error('Agent non autorisé pour cette SFD');
        }
        if (response.status === 404) {
          throw new Error('Demande de compte introuvable');
        }
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result: AccountStatusResponse = await response.json();
      return result;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erreur lors de la validation',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    validateRequest,
    isLoading,
    error,
  };
};

// Hook combiné pour toutes les actions sur les comptes épargne
export const useSavingsAccountActions = () => {
  const { createAccount, isLoading: isCreating, error: createError } = useCreateSavingsAccount();
  const { updateAccount, isLoading: isUpdating, error: updateError } = useUpdateSavingsAccount();
  const { patchAccount, isLoading: isPatching, error: patchError } = usePatchSavingsAccount();
  const { closeAccount, isLoading: isClosing, error: closeError } = useCloseSavingsAccount();
  const { deposit, isLoading: isDepositing, error: depositError } = useDeposit();
  const { withdraw, isLoading: isWithdrawing, error: withdrawError } = useWithdraw();
  const { payFees, isLoading: isPayingFees, error: payFeesError } = usePayFees();
  const { validateRequest, isLoading: isValidating, error: validateError } = useValidateRequest();

  return {
    createAccount,
    updateAccount,
    patchAccount,
    closeAccount,
    deposit,
    withdraw,
    payFees,
    validateRequest,
    isLoading: isCreating || isUpdating || isPatching || isClosing || isDepositing || isWithdrawing || isPayingFees || isValidating,
    error: createError || updateError || patchError || closeError || depositError || withdrawError || payFeesError || validateError,
  };
};