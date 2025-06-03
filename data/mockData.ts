export const mockTontines = [
  {
    id: "1",
    name: "Tontine d'Épargne des Femmes",
    sfd: "SFD Porto-Novo",
    minAmount: 500,
    maxAmount: 5000,
    frequency: "Quotidien",
    members: 25,
    type: "Épargne",
    description: "Tontine dédiée aux femmes entrepreneures pour développer leurs activités commerciales.",
    balance: 125000,
    status: "Active"
  },
  {
    id: "2",
    name: "Tontine de Crédit Solidaire",
    sfd: "SFD Cotonou",
    minAmount: 1000,
    maxAmount: 10000,
    frequency: "Hebdomadaire",
    members: 15,
    type: "Crédit",
    description: "Système de crédit rotatif pour les petits commerçants.",
    balance: 75000,
    status: "Active"
  },
  {
    id: "3",
    name: "Tontine Agricole Saisonnière",
    sfd: "SFD Abomey",
    minAmount: 2000,
    maxAmount: 15000,
    frequency: "Mensuel",
    members: 30,
    type: "Épargne",
    description: "Tontine pour les agricultrices en période de récolte.",
    balance: 200000,
    status: "Active"
  }
];

export const mockUserTontines = [
  {
    id: "1",
    name: "Tontine d'Épargne des Femmes",
    sfd: "SFD Porto-Novo",
    balance: 15000,
    lastContribution: "2025-05-29",
    nextContribution: "2025-05-31"
  },
  {
    id: "2",
    name: "Tontine de Crédit Solidaire",
    sfd: "SFD Cotonou",
    balance: 8500,
    lastContribution: "2025-05-27",
    nextContribution: "2025-06-03"
  }
];

export const mockTransactions = [
  {
    id: "1",
    type: "Contribution",
    amount: 2500,
    date: "2025-05-29",
    tontine: "Tontine d'Épargne des Femmes",
    status: "Confirmé",
    operator: "MTN"
  },
  {
    id: "2",
    type: "Retrait",
    amount: 5000,
    date: "2025-05-25",
    tontine: "Tontine de Crédit Solidaire",
    status: "En cours",
    operator: "Moov"
  },
  {
    id: "3",
    type: "Dépôt Épargne",
    amount: 10000,
    date: "2025-05-20",
    tontine: "Compte Épargne Personnel",
    status: "Confirmé",
    operator: "MTN"
  }
];

export const mockSavingsAccount = {
  balance: 50000,
  accountNumber: "EPA001234567",
  openingDate: "2025-01-15",
  interestRate: 3.5
};

export const mockLoanStatus = {
  amount: 100000,
  status: "En cours d'examen",
  monthlyPayment: 10000,
  duration: 12,
  interestRate: 8.5,
  applicationDate: "2025-05-15"
};

export const mockPendingRequests = [
  {
    id: "1",
    type: "Adhésion Tontine",
    clientName: "Marie Adjovi",
    clientId: "BJ1234567890",
    amount: 2000,
    date: "2025-05-29",
    tontine: "Tontine d'Épargne des Femmes"
  },
  {
    id: "2",
    type: "Demande de Retrait",
    clientName: "Fatou Kone",
    clientId: "BJ0987654321",
    amount: 15000,
    date: "2025-05-28",
    tontine: "Tontine de Crédit Solidaire"
  },
  {
    id: "3",
    type: "Ouverture Compte Épargne",
    clientName: "Aïcha Dossou",
    clientId: "BJ1122334455",
    amount: 1000,
    date: "2025-05-27",
    tontine: "Compte Épargne"
  }
];

export const mockLoanApplications = [
  {
    id: "1",
    clientName: "Blessing Agbossou",
    amount: 500000,
    purpose: "Développement activité commerciale",
    reliabilityScore: 85,
    status: "En attente",
    submissionDate: "2025-05-20"
  },
  {
    id: "2",
    clientName: "Christelle Houeto",
    amount: 200000,
    purpose: "Achat équipement agricole",
    reliabilityScore: 92,
    status: "Approuvé",
    submissionDate: "2025-05-18"
  }
];

export const mockFAQs = [
  {
    question: "Comment rejoindre une tontine sur TontiFlex ?",
    answer: "Pour rejoindre une tontine, consultez la liste des tontines disponibles, choisissez celle qui correspond à vos besoins, et remplissez le formulaire d'adhésion avec vos informations personnelles et le montant de contribution souhaité."
  },
  {
    question: "Quels sont les frais d'utilisation de TontiFlex ?",
    answer: "Les frais varient selon le type de service : 2000 FCFA pour l'adhésion à une tontine, 1000 FCFA pour l'ouverture d'un compte épargne, et des frais de transaction Mobile Money selon votre opérateur."
  },
  {
    question: "Comment fonctionne le paiement Mobile Money ?",
    answer: "TontiFlex est intégré avec MTN Mobile Money et Moov Money. Vous pouvez effectuer vos contributions et retraits directement depuis l'application en utilisant votre numéro de téléphone mobile."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui, TontiFlex respecte les normes de sécurité BCEAO/UEMOA et protège vos données personnelles selon les réglementations en vigueur au Bénin."
  },
  {
    question: "Puis-je consulter l'historique de mes transactions ?",
    answer: "Absolument ! Votre tableau de bord personnel vous permet de consulter l'historique complet de toutes vos transactions, contributions et retraits."
  }
];