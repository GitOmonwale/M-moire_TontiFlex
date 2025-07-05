// Types TypeScript basés fidèlement sur l'API
export type StatutAdhesion = 
  | 'demande_soumise' 
  | 'validee_agent' 
  | 'en_cours_paiement' 
  | 'paiement_effectue' 
  | 'adherent' 
  | 'rejetee';

export type EtapeAdhesion = 
  | 'etape_1' // Étape 1 - Validation agent
  | 'etape_2' // Étape 2 - Paiement frais
  | 'etape_3'; // Étape 3 - Intégration tontine

export interface Adhesion {
  id: string; // UUID, readOnly - Identifiant unique du workflow d'adhésion
  client: string; // UUID, readOnly - Client demandant l'adhésion
  client_nom: string; // readOnly
  tontine: string; // UUID - Tontine à rejoindre
  tontine_nom: string; // readOnly
  montant_mise: string; // decimal pattern: ^-?\d{0,10}(?:\.\d{0,2})?$ - Montant de mise souhaité (FCFA)
  numero_telephone_paiement: string | null; // readOnly, nullable - Numéro de téléphone pour les paiements Mobile Money (saisi lors du paiement)
  document_identite: string | null; // URI, nullable - Document d'identité (PDF, JPG, PNG) - Upload de fichier
  statut_actuel: StatutAdhesion; // readOnly - Statut actuel du workflow
  etape_actuelle: EtapeAdhesion; // readOnly - Étape actuelle du processus
  date_creation: string; // datetime, readOnly - Date de soumission de la demande
  date_validation_agent: string | null; // datetime, readOnly, nullable - Date de validation par l'agent
  date_paiement_frais: string | null; // datetime, readOnly, nullable - Date de paiement des frais d'adhésion
  date_integration: string | null; // datetime, readOnly, nullable - Date d'intégration effective à la tontine
  frais_adhesion_calcules: string | null; // decimal pattern: ^-?\d{0,8}(?:\.\d{0,2})?$, readOnly, nullable - Frais d'adhésion calculés automatiquement
  agent_validateur: string | null; // UUID, readOnly, nullable - Agent SFD ayant validé la demande
  agent_nom: string; // readOnly
  commentaires_agent: string; // readOnly - Commentaires de l'agent lors de la validation
  raison_rejet: string; // readOnly - Raison du rejet de la demande
  prochaine_action: string; // readOnly
}

export interface CreateAdhesionData {
  tontine: string; // UUID - Tontine à rejoindre
  montant_mise: string; // decimal pattern: ^-?\d{0,10}(?:\.\d{0,2})?$ - Montant de mise souhaité (FCFA)
  document_identite?: File; // multipart/form-data - Document d'identité (PDF, JPG, PNG) - Upload de fichier
}

export interface UpdateAdhesionData {
  tontine: string; // UUID - Tontine à rejoindre (requis pour PUT)
  montant_mise: string; // decimal - Montant de mise souhaité (FCFA) (requis pour PUT)
  document_identite?: File; // multipart/form-data - Document d'identité (PDF, JPG, PNG) - Upload de fichier
}

export interface UpdateAdhesionPartialData {
  tontine?: string; // UUID - Tontine à rejoindre
  montant_mise?: string; // decimal - Montant de mise souhaité (FCFA)
  document_identite?: File; // multipart/form-data - Document d'identité (PDF, JPG, PNG) - Upload de fichier
}

export interface ValidateAgentData {
  commentaires?: string; // maxLength: 500 - Commentaires de l'agent lors de la validation
}

export interface PayerData {
  numero_telephone: string; // minLength: 1, maxLength: 15 - Numéro de téléphone pour le paiement KKiaPay
}

export interface PaginatedAdhesionList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Adhesion[];
}

export interface AdhesionFilters {
  page?: number;
  tontine?: string;
  statut?: StatutAdhesion;
  client?: string;
  agent_validateur?: string;
}