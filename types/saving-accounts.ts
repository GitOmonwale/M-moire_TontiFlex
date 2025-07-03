export type OperateurMobileMoneyEnum = 'mtn' | 'moov' | 'orange';

export type SavingsAccountStatus = 
  | 'en_cours_creation' 
  | 'validee_agent' 
  | 'paiement_effectue' 
  | 'actif' 
  | 'suspendu' 
  | 'ferme' 
  | 'rejete';

export interface SavingsAccount {
  id: string;
  client_nom: string;
  agent_nom: string;
  sfd_nom: string;
  solde_disponible: string;
  prochaine_action: string;
  statut: SavingsAccountStatus;
  piece_identite: string;
  photo_identite: string;
  numero_telephone_paiement?: string;
  operateur_mobile_money?: OperateurMobileMoneyEnum;
  frais_creation: string;
  date_demande: string;
  date_validation_agent?: string;
  date_paiement_frais?: string;
  date_activation?: string;
  date_modification: string;
  commentaires_agent?: string;
  raison_rejet?: string;
  client: string;
  agent_validateur?: string;
  transaction_frais_creation?: string;
}

export interface SavingsAccountSummary {
  id: string;
  client_nom: string;
  statut: SavingsAccountStatus;
  date_demande: string;
  date_activation?: string;
  solde_disponible: string;
  nombre_transactions: string;
  derniere_transaction: string;
}

export interface AccountStatusResponse {
  compte_id: string;
  statut: string;
  message: string;
  prochaine_action: string;
  solde_disponible: string;
}

export interface TransactionHistory {
  id: string;
  type: 'depot' | 'retrait' | 'frais';
  montant: string;
  description?: string;
  date_transaction: string;
  statut: 'confirmee' | 'en_cours' | 'echouee';
  numero_telephone?: string;
  frais?: string;
}

export interface CreateSavingsAccountRequestData {
  piece_identite: string; // base64 encoded image
  photo_identite: string; // base64 encoded image
  type_piece_identite: 'CNI' | 'passeport' | 'permis';
  numero_telephone: string;
  commentaires?: string;
}

export interface CreateSavingsAccountData {
  client: number;
  piece_identite: string;
  photo_identite: string;
  type_piece_identite: 'CNI' | 'passeport' | 'permis';
  numero_telephone: string;
  commentaires?: string;
}

export interface UpdateSavingsAccountData {
  statut?: SavingsAccountStatus;
  piece_identite?: string;
  photo_identite?: string;
  numero_telephone_paiement?: string;
  operateur_mobile_money?: OperateurMobileMoneyEnum;
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

export interface DepositData {
  montant: number;
  numero_telephone: string;
  description?: string;
}

export interface WithdrawData {
  montant: number;
  numero_telephone: string;
  description?: string;
}

export interface PayFeesData {
  numero_telephone: string;
}

export interface ValidateRequestData {
  decision: 'valide' | 'rejete';
  commentaires_agent: string;
}
