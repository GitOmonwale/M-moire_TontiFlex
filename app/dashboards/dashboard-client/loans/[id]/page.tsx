'use client'
import { useState } from 'react';
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  Phone,
  Mail,
  X
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

// Types fictifs basés sur le backend
type LoanStatus = 'accorde' | 'en_attente_decaissement' | 'decaisse' | 'en_remboursement' | 'solde' | 'en_defaut';
type EcheanceStatus = 'prevu' | 'en_cours' | 'en_retard' | 'paye' | 'paye_partiel';

interface MockLoan {
  id: string;
  demande: string;
  demande_info: string;
  client: string;
  client_nom: string;
  montant_accorde: string;
  statut: LoanStatus;
  date_creation: string;
  date_decaissement: string | null;
  admin_decaisseur: string | null;
  admin_decaisseur_nom: string;
  montant_total_rembourse: string;
  solde_restant_du: string;
  est_en_retard: string;
  progression_remboursement: string;
}

interface MockRepaymentSchedule {
  id: string;
  numero_echeance: number;
  date_echeance: string;
  montant_echeance: string;
  montant_capital: string;
  montant_interet: string;
  montant_paye: string;
  solde_restant: string;
  statut: EcheanceStatus;
  jours_retard?: number;
  penalites?: string;
  date_paiement?: string | null;
}

interface MockCalendrierRemboursement {
  echeances: MockRepaymentSchedule[];
  resume: {
    nombre_total_echeances: number;
    echeances_payees: number;
    echeances_restantes: number;
    montant_total_prevu: string;
    montant_total_rembourse: string;
    solde_restant_du: string;
    progression_pourcentage: number;
  };
  statistiques: {
    retard_moyen_jours: number;
    total_penalites: string;
    prochaine_echeance_date?: string;
    prochaine_echeance_montant?: string;
    est_en_retard: boolean;
    jours_retard_maximum: number;
  };
}

const LoanDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<MockRepaymentSchedule | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    reference: '',
    notes: ''
  });

  // Données fictives du prêt basées sur la structure backend
  const loanDetails: MockLoan = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    demande: "d1e2f3g4-h5i6-7890-jklm-no1234567890",
    demande_info: "Financement équipement agricole",
    client: "c1l2i3e4-n5t6-7890-user-id1234567890",
    client_nom: "Emile Bamba",
    montant_accorde: "500000.00",
    statut: "en_remboursement",
    date_creation: "2024-01-15T08:30:00Z",
    date_decaissement: "2024-01-20T10:15:00Z",
    admin_decaisseur: "a1d2m3i4-n5d6-7890-ecai-ss1234567890",
    admin_decaisseur_nom: "Clarisse Yao",
    montant_total_rembourse: "225000.00",
    solde_restant_du: "275000.00",
    est_en_retard: "true",
    progression_remboursement: "45.0"
  };

  // Calendrier de remboursement fictif basé sur la structure backend
  const schedule: MockCalendrierRemboursement = {
    echeances: [
      {
        id: "ech001",
        numero_echeance: 1,
        date_echeance: "2024-02-15",
        montant_echeance: "45000.00",
        montant_capital: "38500.00",
        montant_interet: "6500.00",
        montant_paye: "45000.00",
        solde_restant: "461500.00",
        statut: "paye",
        date_paiement: "2024-02-14"
      },
      {
        id: "ech002",
        numero_echeance: 2,
        date_echeance: "2024-03-15",
        montant_echeance: "45000.00",
        montant_capital: "38750.00",
        montant_interet: "6250.00",
        montant_paye: "45000.00",
        solde_restant: "422750.00",
        statut: "paye",
        date_paiement: "2024-03-15"
      },
      {
        id: "ech003",
        numero_echeance: 3,
        date_echeance: "2024-04-15",
        montant_echeance: "45000.00",
        montant_capital: "39000.00",
        montant_interet: "6000.00",
        montant_paye: "45000.00",
        solde_restant: "383750.00",
        statut: "paye",
        date_paiement: "2024-04-12"
      },
      {
        id: "ech004",
        numero_echeance: 4,
        date_echeance: "2024-05-15",
        montant_echeance: "45000.00",
        montant_capital: "39250.00",
        montant_interet: "5750.00",
        montant_paye: "45000.00",
        solde_restant: "344500.00",
        statut: "paye",
        date_paiement: "2024-05-15"
      },
      {
        id: "ech005",
        numero_echeance: 5,
        date_echeance: "2024-06-15",
        montant_echeance: "45000.00",
        montant_capital: "39500.00",
        montant_interet: "5500.00",
        montant_paye: "45000.00",
        solde_restant: "305000.00",
        statut: "paye",
        date_paiement: "2024-06-13"
      },
      {
        id: "ech006",
        numero_echeance: 6,
        date_echeance: "2024-07-15",
        montant_echeance: "45000.00",
        montant_capital: "39750.00",
        montant_interet: "5250.00",
        montant_paye: "20000.00",
        solde_restant: "265250.00",
        statut: "paye_partiel",
        jours_retard: 12,
        penalites: "2500.00"
      },
      {
        id: "ech007",
        numero_echeance: 7,
        date_echeance: "2024-08-15",
        montant_echeance: "45000.00",
        montant_capital: "40000.00",
        montant_interet: "5000.00",
        montant_paye: "0.00",
        solde_restant: "225250.00",
        statut: "en_retard",
        jours_retard: 45,
        penalites: "5000.00"
      },
      {
        id: "ech008",
        numero_echeance: 8,
        date_echeance: "2024-09-15",
        montant_echeance: "45000.00",
        montant_capital: "40250.00",
        montant_interet: "4750.00",
        montant_paye: "0.00",
        solde_restant: "185000.00",
        statut: "en_cours"
      },
      {
        id: "ech009",
        numero_echeance: 9,
        date_echeance: "2024-10-15",
        montant_echeance: "45000.00",
        montant_capital: "40500.00",
        montant_interet: "4500.00",
        montant_paye: "0.00",
        solde_restant: "144500.00",
        statut: "prevu"
      },
      {
        id: "ech010",
        numero_echeance: 10,
        date_echeance: "2024-11-15",
        montant_echeance: "45000.00",
        montant_capital: "40750.00",
        montant_interet: "4250.00",
        montant_paye: "0.00",
        solde_restant: "103750.00",
        statut: "prevu"
      },
      {
        id: "ech011",
        numero_echeance: 11,
        date_echeance: "2024-12-15",
        montant_echeance: "45000.00",
        montant_capital: "41000.00",
        montant_interet: "4000.00",
        montant_paye: "0.00",
        solde_restant: "62750.00",
        statut: "prevu"
      },
      {
        id: "ech012",
        numero_echeance: 12,
        date_echeance: "2025-01-15",
        montant_echeance: "45000.00",
        montant_capital: "41250.00",
        montant_interet: "3750.00",
        montant_paye: "0.00",
        solde_restant: "21500.00",
        statut: "prevu"
      }
    ],
    resume: {
      nombre_total_echeances: 12,
      echeances_payees: 5,
      echeances_restantes: 7,
      montant_total_prevu: "540000.00",
      montant_total_rembourse: "225000.00",
      solde_restant_du: "315000.00",
      progression_pourcentage: 41.7
    },
    statistiques: {
      retard_moyen_jours: 28,
      total_penalites: "7500.00",
      prochaine_echeance_date: "2024-09-15",
      prochaine_echeance_montant: "45000.00",
      est_en_retard: true,
      jours_retard_maximum: 45
    }
  };

  // Fonction pour formater la devise
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(numAmount);
  };

  // Fonction pour obtenir le badge de statut des échéances
  const getEcheanceStatusBadge = (status: EcheanceStatus) => {
    switch (status) {
      case "paye":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case "en_cours":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case "prevu":
        return <Badge className="bg-gray-100 text-gray-800">À venir</Badge>;
      case "en_retard":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      case "paye_partiel":
        return <Badge className="bg-orange-100 text-orange-800">Paiement partiel</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Fonction pour obtenir l'icône de statut des échéances
  const getEcheanceStatusIcon = (status: EcheanceStatus) => {
    switch (status) {
      case "paye":
        return <CheckCircle className="text-green-600" size={16} />;
      case "en_cours":
        return <Clock className="text-yellow-600" size={16} />;
      case "en_retard":
        return <AlertTriangle className="text-red-600" size={16} />;
      case "paye_partiel":
        return <AlertTriangle className="text-orange-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  // Fonction pour obtenir le badge de statut du prêt
  const getLoanStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case "accorde":
        return <Badge className="bg-blue-100 text-blue-800">Accordé</Badge>;
      case "en_attente_decaissement":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente décaissement</Badge>;
      case "decaisse":
        return <Badge className="bg-green-100 text-green-800">Décaissé</Badge>;
      case "en_remboursement":
        return <Badge className="bg-purple-100 text-purple-800">En remboursement</Badge>;
      case "solde":
        return <Badge className="bg-gray-100 text-gray-800">Soldé</Badge>;
      case "en_defaut":
        return <Badge className="bg-red-100 text-red-800">En défaut</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePayInstallment = (installment: MockRepaymentSchedule) => {
    setSelectedInstallment(installment);
    const montantRestant = parseFloat(installment.montant_echeance) - parseFloat(installment.montant_paye);
    setPaymentForm({
      amount: montantRestant.toString(),
      paymentMethod: '',
      reference: '',
      notes: ''
    });
    setIsPaymentFormOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!paymentForm.amount || !paymentForm.paymentMethod) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Simulation du traitement du paiement
    toast.success(`Paiement de ${formatCurrency(parseFloat(paymentForm.amount))} enregistré avec succès pour l'échéance ${selectedInstallment?.numero_echeance}`);

    // Fermer le formulaire
    setIsPaymentFormOpen(false);
    setSelectedInstallment(null);
    setPaymentForm({
      amount: '',
      paymentMethod: '',
      reference: '',
      notes: ''
    });
  };

  const handleCloseForm = () => {
    setIsPaymentFormOpen(false);
    setSelectedInstallment(null);
    setPaymentForm({
      amount: '',
      paymentMethod: '',
      reference: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboards/dashboard-client/loans">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Détails du Prêt</h1>
            <p className="text-gray-600">Prêt N° {loanDetails.id.slice(0, 8)}...</p>
          </div>
        </div>

        {/* Informations générales du prêt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard hover={false}>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <CreditCard size={24} />
              Informations du Prêt
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant emprunté :</span>
                <span className="font-semibold">
                  {formatCurrency(loanDetails.montant_accorde)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant remboursé :</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(loanDetails.montant_total_rembourse)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Solde restant dû :</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(loanDetails.solde_restant_du)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <div className="font-semibold">
                  {getLoanStatusBadge(loanDetails.statut)}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Objet du prêt :</span>
                <span className="font-semibold">
                  {loanDetails.demande_info}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de création :</span>
                <span className="font-semibold">
                  {new Date(loanDetails.date_creation).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En retard :</span>
                <span className={`font-semibold ${loanDetails.est_en_retard === 'true' ? 'text-red-600' : 'text-green-600'}`}>
                  {loanDetails.est_en_retard === 'true' ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progression du remboursement</span>
                <span className="text-sm font-medium">
                  {parseFloat(loanDetails.progression_remboursement).toFixed(1)}%
                </span>
              </div>
              <Progress value={parseFloat(loanDetails.progression_remboursement)} className="h-3" />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Building size={24} />
              Informations SFD & Client
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Client :</span>
                <span className="font-semibold">{loanDetails.client_nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone :</span>
                <span className="font-semibold">{user?.profile?.telephone || '+229 67 89 12 34'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="font-semibold">{user?.profile?.email || 'emile.bamba@email.com'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Référence client :</span>
                <span className="font-semibold">{loanDetails.client.slice(0, 8)}...</span>
              </div>
              {loanDetails.date_decaissement && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de décaissement :</span>
                  <span className="font-semibold">
                    {new Date(loanDetails.date_decaissement).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Décaisseur :</span>
                <span className="font-semibold">{loanDetails.admin_decaisseur_nom}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Échéancier de remboursement */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <Calendar size={24} />
              Échéancier de Remboursement
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Total échéances : {schedule.resume.nombre_total_echeances}</div>
              <div>Payées : {schedule.resume.echeances_payees}/{schedule.resume.nombre_total_echeances}</div>
            </div>
          </div>

          {/* Résumé et statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassCard hover={false} className="p-4">
              <h3 className="font-medium text-sm text-gray-600 mb-2">Résumé général</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Progression :</span>
                  <span className="font-semibold">{schedule.resume.progression_pourcentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant prévu :</span>
                  <span className="font-semibold">{formatCurrency(schedule.resume.montant_total_prevu)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Déjà remboursé :</span>
                  <span className="font-semibold text-green-600">{formatCurrency(schedule.resume.montant_total_rembourse)}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-4">
              <h3 className="font-medium text-sm text-gray-600 mb-2">Prochaine échéance</h3>
              <div className="space-y-1 text-sm">
                {schedule.statistiques.prochaine_echeance_date ? (
                  <>
                    <div className="flex justify-between">
                      <span>Date :</span>
                      <span className="font-semibold">
                        {new Date(schedule.statistiques.prochaine_echeance_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant :</span>
                      <span className="font-semibold">{formatCurrency(schedule.statistiques.prochaine_echeance_montant || '0')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">Aucune échéance à venir</div>
                )}
              </div>
            </GlassCard>

            {schedule.statistiques.est_en_retard && (
              <GlassCard hover={false} className="p-4 bg-red-50">
                <h3 className="font-medium text-sm text-red-800 mb-2">⚠️ Retards</h3>
                <div className="space-y-1 text-sm text-red-700">
                  <div className="flex justify-between">
                    <span>Retard moyen :</span>
                    <span className="font-semibold">{schedule.statistiques.retard_moyen_jours} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pénalités :</span>
                    <span className="font-semibold">{formatCurrency(schedule.statistiques.total_penalites)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retard max :</span>
                    <span className="font-semibold">{schedule.statistiques.jours_retard_maximum} jours</span>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Tableau des échéances */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">N°</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Intérêts</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Payé</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-center">Retard</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.echeances.map((echeance) => (
                  <TableRow key={echeance.id}>
                    <TableCell className="text-center font-medium">
                      {echeance.numero_echeance}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(echeance.date_echeance).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(echeance.montant_capital)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(echeance.montant_interet)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(echeance.montant_echeance)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(echeance.montant_paye)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getEcheanceStatusIcon(echeance.statut)}
                        {getEcheanceStatusBadge(echeance.statut)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {echeance.jours_retard && echeance.jours_retard > 0 ? (
                        <div className="text-red-600 text-sm font-medium">
                          {echeance.jours_retard} j
                          {echeance.penalites && parseFloat(echeance.penalites) > 0 && (
                            <div className="text-xs">
                              Pénalités: {formatCurrency(echeance.penalites)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {(echeance.statut === "en_cours" || echeance.statut === "en_retard" || echeance.statut === "paye_partiel") && (
                        <Button
                          size="sm"
                          onClick={() => handlePayInstallment(echeance)}
                          className="flex items-center gap-1"
                        >
                          <DollarSign size={14} />
                          Payer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modal du formulaire de paiement */}
        <Dialog open={isPaymentFormOpen} onOpenChange={setIsPaymentFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign size={20} />
                Paiement de l'échéance {selectedInstallment?.numero_echeance}
              </DialogTitle>
              <DialogDescription>
                Échéance du {selectedInstallment && new Date(selectedInstallment.date_echeance).toLocaleDateString('fr-FR')}
                {selectedInstallment?.jours_retard && selectedInstallment.jours_retard > 0 && (
                  <span className="text-red-600 ml-2">
                    (En retard de {selectedInstallment.jours_retard} jours)
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Montant à payer *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => handleFormChange('amount', e.target.value)}
                    placeholder="45000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
                  <Select
                    value={paymentForm.paymentMethod}
                    onValueChange={(value) => handleFormChange('paymentMethod', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reference">Référence de transaction</Label>
                <Input
                  id="reference"
                  value={paymentForm.reference}
                  onChange={(e) => handleFormChange('reference', e.target.value)}
                  placeholder="REF123456789 (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={paymentForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Commentaires additionnels (optionnel)"
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Récapitulatif du paiement</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Capital :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.montant_capital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intérêts :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.montant_interet)}</span>
                  </div>
                  {selectedInstallment?.penalites && parseFloat(selectedInstallment.penalites) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Pénalités de retard :</span>
                      <span>{formatCurrency(selectedInstallment.penalites)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.montant_echeance)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Déjà payé :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.montant_paye)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-orange-600 border-t pt-1">
                    <span>Restant à payer :</span>
                    <span>
                      {selectedInstallment && formatCurrency(
                        parseFloat(selectedInstallment.montant_echeance) - parseFloat(selectedInstallment.montant_paye)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  Confirmer le paiement
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoanDetail;