// Types TypeScript basés sur l'API
export type StatutRetrait = 
  | 'pending'    // En attente
  | 'approved'   // Approuvé
  | 'rejected'   // Rejeté
  | 'confirmee'; // Confirmé

export interface Retrait {
  id: string; // UUID, readOnly
  client: string; // UUID
  client_nom: string;
  client_prenom: string;
  tontine: string; // UUID
  tontine_nom: string;
  participant: string | null; // UUID, nullable
  montant: string; // decimal, Montant demandé pour le retrait en FCFA
  date_demande_retrait: string; // datetime, readOnly
  date_validation_retrait: string | null; // datetime, nullable
  statut: StatutRetrait;
  agent_validateur: string | null; // UUID, nullable
  commentaires_agent: string;
  raison_rejet: string;
  transaction_kkiapay: string | null; // UUID, nullable
  telephone: string;
}

export interface CreateRetraitData {
  client: string; // UUID
  tontine: string; // UUID
  participant?: string; // UUID, nullable
  montant: string; // decimal
  date_validation_retrait?: string; // datetime
  statut?: StatutRetrait;
  agent_validateur?: string; // UUID
  commentaires_agent?: string;
  raison_rejet?: string;
  transaction_kkiapay?: string; // UUID
  telephone?: string;
}

export interface UpdateRetraitData {
  client?: string; // UUID
  tontine?: string; // UUID
  participant?: string; // UUID, nullable
  montant?: string; // decimal
  date_validation_retrait?: string; // datetime
  statut?: StatutRetrait;
  agent_validateur?: string; // UUID
  commentaires_agent?: string;
  raison_rejet?: string;
  transaction_kkiapay?: string; // UUID
  telephone?: string;
}

export interface ValidationData {
  decision: 'approved' | 'rejected';
  commentaire: string;
}

export interface InitierVirementData {
  telephone: string;
}

export interface ValidationRetraitResponse {
  message: string;
  statut: string;
  virement_initie?: boolean;
  transaction_mobile_money?: string;
}

export interface ValidationRetraitError {
  error: string;
  details?: string;
}

export interface PaginatedRetraitList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Retrait[];
}

export interface RetraitFilters {
  page?: number;
  participant?: string; // Filtrer par ID participant
  statut?: StatutRetrait; // Filtrer par statut
}