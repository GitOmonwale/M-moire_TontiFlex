import { Feature } from "@/types";
import { 
  Users,
  CreditCard,
  TrendingUp,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';

export const features: Feature[] = [
  {
    id: 1,
    title: "Tontines Digitales",
    description:
      "Rejoignez plusieurs tontines simultanément, suivez vos cotisations en temps réel et recevez des notifications SMS automatiques.",
    icon: Users,
  },
  {
    id: 2,
    title: "Comptes Épargne",
    description:
      "Ouvrez et gérez vos comptes épargne auprès de plusieurs SFD avec des dépôts et retraits via Mobile Money.",
    icon: CreditCard,
  },
  {
    id: 3,
    title: "Prêts Simplifiés",
    description:
      "Obtenez des financements rapidement avec un processus d'évaluation automatisé et des remboursements flexibles.",
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Mobile Money",
    description:
      "Effectuez toutes vos transactions via MTN Mobile Money et Moov Money, 24h/24 et 7j/7.",
    icon: Smartphone,
  },
  {
    id: 5,
    title: "Multi-SFD",
    description:
      "Accédez à plusieurs Systèmes Financiers Décentralisés depuis une seule plateforme unifiée.",
    icon: Globe,
  },
  {
    id: 6,
    title: "Sécurité Garantie",
    description:
      "Vos données sont protégées et chiffrées, conformément aux réglementations BCEAO du Bénin.",
    icon: Shield,
  },
];