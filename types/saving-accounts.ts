// Types TypeScript basés sur l'API des comptes épargne
export type SavingsAccountStatus = 
  | 'en_cours_creation' 
  | 'validee_agent' 
  | 'paiement_effectue' 
  | 'actif' 
  | 'suspendu' 
  | 'ferme' 
  | 'rejete';

export type TransactionType = 'depot' | 'retrait' | 'frais';
export type TransactionStatus = 'confirmee' | 'en_cours' | 'echouee';

export interface SavingsAccount {
  id: string; // UUID, readOnly
  client_nom: string; // readOnly
  agent_nom: string; // readOnly
  sfd_nom: string; // readOnly
  solde_disponible: string; // readOnly
  prochaine_action: string; // readOnly
  statut: SavingsAccountStatus;
  piece_identite: string; // URI
  photo_identite: string; // URI
  numero_telephone_paiement: string | null; // nullable, maxLength: 15
  frais_creation: string | null; // decimal, nullable
  date_demande: string; // datetime
  date_validation_agent: string | null; // datetime, nullable
  date_paiement_frais: string | null; // datetime, nullable
  date_activation: string | null; // datetime, nullable
  date_modification: string; // datetime, readOnly
  commentaires_agent: string | null; // nullable, maxLength: 1000
  raison_rejet: string | null; // nullable, maxLength: 500
  client: string; // UUID
  sfd_choisie: string | null; // nullable
  agent_validateur: string | null; // UUID, nullable
  transaction_frais_creation: string | null; // UUID, nullable
}

export interface CreateSavingsAccountData {
  statut?: SavingsAccountStatus;
  piece_identite: File; // binary
  photo_identite: File; // binary
  numero_telephone_paiement?: string; // maxLength: 15
  frais_creation?: string; // decimal
  date_demande?: string; // datetime
  date_validation_agent?: string; // datetime
  date_paiement_frais?: string; // datetime
  date_activation?: string; // datetime
  commentaires_agent?: string; // maxLength: 1000
  raison_rejet?: string; // maxLength: 500
  client: string; // UUID
  sfd_choisie?: string;
  agent_validateur?: string; // UUID
  transaction_frais_creation?: string; // UUID
}

export interface UpdateSavingsAccountData {
  statut?: SavingsAccountStatus;
  piece_identite?: File; // binary
  photo_identite?: File; // binary
  numero_telephone_paiement?: string; // maxLength: 15
  frais_creation?: string; // decimal
  date_demande?: string; // datetime
  date_validation_agent?: string; // datetime
  date_paiement_frais?: string; // datetime
  date_activation?: string; // datetime
  commentaires_agent?: string; // maxLength: 1000
  raison_rejet?: string; // maxLength: 500
  client?: string; // UUID
  sfd_choisie?: string;
  agent_validateur?: string; // UUID
  transaction_frais_creation?: string; // UUID
}

export interface DepositData {
  montant: string; // decimal
  numero_telephone: string; // minLength: 1, maxLength: 15
  commentaires?: string; // maxLength: 500
}

export interface PayFeesData {
  numero_telephone: string; // minLength: 1, maxLength: 15
  confirmer_montant: string; // decimal
}

export interface WithdrawData {
  montant: string; // decimal
  numero_telephone: string; // minLength: 1, maxLength: 15
  motif_retrait?: string; // maxLength: 500
}

export interface ValidateRequestData {
  approuver: boolean; // True pour approuver, False pour rejeter
  commentaires?: string; // maxLength: 1000
  raison_rejet?: string; // maxLength: 500
}

export interface CreateRequestData {
  piece_identite: File; // binary
  photo_identite: File; // binary
  sfd_id: string; // minLength: 1, maxLength: 50
  numero_telephone_paiement?: string; // minLength: 1, maxLength: 15
}

export interface TransactionHistory {
  id: string;
  type: TransactionType;
  montant: string;
  description?: string;
  date_transaction: string;
  statut: TransactionStatus;
  numero_telephone?: string;
  frais?: string;
}

export interface SFDSelection {
  id: string;
  nom: string;
  adresse: string;
  telephone?: string;
  email?: string;
}

export interface AccountStatusResponse {
  compte_id: string; // UUID
  statut: string;
  message: string;
  prochaine_action: string;
  solde_disponible: string; // decimal
}

export interface MyAccountSummary {
  id: string;
  idAdherents: string;
  sfdName: string;
  accountNumber: string;
  solde: string;
  dateCreation: string;
  statut: SavingsAccountStatus;
  totalDepose: string;
  totalRetire: string;
  nombreTransactions: number;
  eligibiliteCredit: boolean;
  derniereMouvement?: string;
}

export interface PaginatedSavingsAccountList {
  count: number;
  next: string | null;
  previous: string | null;
  results: SavingsAccount[];
}

export interface PaginatedTransactionHistoryList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransactionHistory[];
}

export interface PaginatedSFDSelectionList {
  count: number;
  next: string | null;
  previous: string | null;
  results: SFDSelection[];
}

export interface SavingsAccountFilters {
  page?: number;
  statut?: SavingsAccountStatus;
  client?: string;
  agent_validateur?: string;
  date_debut?: string;
  date_fin?: string;
}