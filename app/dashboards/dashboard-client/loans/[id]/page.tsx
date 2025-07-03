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

const LoanDetail = () => {
  const { id } = useParams();
  
  // État pour gérer le formulaire de paiement
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    reference: '',
    notes: ''
  });

  // Données simulées du prêt
  const loanDetails = {
    id: id || "PRT001234567",
    clientName: "Marie Adjovi",
    clientPhone: "+229 97 45 67 89",
    clientEmail: "marie.adjovi@email.com",
    sfd: "SFD Porto-Novo",
    amount: 500000,
    purpose: "Développement activité commerciale",
    status: "Actif",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    monthlyPayment: 45000,
    remainingAmount: 300000,
    paidAmount: 200000,
    interestRate: 8.5,
    duration: 12,
    agent: "Agent Koffi Mensah"
  };

  // Échéancier de remboursement
  const paymentSchedule = [
    {
      installmentNumber: 1,
      dueDate: "2024-02-15",
      principal: 38298,
      interest: 6702,
      totalAmount: 45000,
      status: "Payé",
      paidDate: "2024-02-14"
    },
    {
      installmentNumber: 2,
      dueDate: "2024-03-15",
      principal: 38565,
      interest: 6435,
      totalAmount: 45000,
      status: "Payé",
      paidDate: "2024-03-15"
    },
    {
      installmentNumber: 3,
      dueDate: "2024-04-15",
      principal: 38836,
      interest: 6164,
      totalAmount: 45000,
      status: "Payé",
      paidDate: "2024-04-12"
    },
    {
      installmentNumber: 4,
      dueDate: "2024-05-15",
      principal: 39110,
      interest: 5890,
      totalAmount: 45000,
      status: "Payé",
      paidDate: "2024-05-15"
    },
    {
      installmentNumber: 5,
      dueDate: "2024-06-15",
      principal: 39388,
      interest: 5612,
      totalAmount: 45000,
      status: "Payé",
      paidDate: "2024-06-13"
    },
    {
      installmentNumber: 6,
      dueDate: "2025-06-15",
      principal: 39669,
      interest: 5331,
      totalAmount: 45000,
      status: "En cours",
      paidDate: null
    },
    {
      installmentNumber: 7,
      dueDate: "2025-07-15",
      principal: 39954,
      interest: 5046,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    },
    {
      installmentNumber: 8,
      dueDate: "2025-08-15",
      principal: 40243,
      interest: 4757,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    },
    {
      installmentNumber: 9,
      dueDate: "2025-09-15",
      principal: 40536,
      interest: 4464,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    },
    {
      installmentNumber: 10,
      dueDate: "2025-10-15",
      principal: 40833,
      interest: 4167,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    },
    {
      installmentNumber: 11,
      dueDate: "2025-11-15",
      principal: 41134,
      interest: 3866,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    },
    {
      installmentNumber: 12,
      dueDate: "2025-12-15",
      principal: 41440,
      interest: 3560,
      totalAmount: 45000,
      status: "À venir",
      paidDate: null
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Payé":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case "En cours":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case "À venir":
        return <Badge className="bg-gray-100 text-gray-800">À venir</Badge>;
      case "En retard":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Payé":
        return <CheckCircle className="text-green-600" size={16} />;
      case "En cours":
        return <Clock className="text-yellow-600" size={16} />;
      case "En retard":
        return <AlertTriangle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const handlePayInstallment = (installment) => {
    const installmentData = paymentSchedule.find(p => p.installmentNumber === installment);
    setSelectedInstallment(installmentData);
    setPaymentForm({
      amount: installmentData.totalAmount.toString(),
      paymentMethod: '',
      reference: '',
      notes: ''
    });
    setIsPaymentFormOpen(true);
  };

  const handleFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!paymentForm.amount || !paymentForm.paymentMethod) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Simulation du traitement du paiement
    toast.success(`Paiement de ${formatCurrency(parseFloat(paymentForm.amount))} enregistré avec succès pour l'échéance ${selectedInstallment.installmentNumber}`);
    
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
            <p className="text-gray-600">Prêt N° {loanDetails.id}</p>
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
                <span className="font-semibold">{formatCurrency(loanDetails.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reste à payer :</span>
                <span className="font-semibold text-orange-600">{formatCurrency(loanDetails.remainingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant payé :</span>
                <span className="font-semibold text-green-600">{formatCurrency(loanDetails.paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'intérêt :</span>
                <span className="font-semibold">{loanDetails.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée :</span>
                <span className="font-semibold">{loanDetails.duration} mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Objet :</span>
                <span className="font-semibold">{loanDetails.purpose}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progression du remboursement</span>
                <span className="text-sm font-medium">
                  {Math.round((loanDetails.paidAmount / loanDetails.amount) * 100)}%
                </span>
              </div>
              <Progress value={(loanDetails.paidAmount / loanDetails.amount) * 100} className="h-3" />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Building size={24} />
              Informations SFD & Client
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">SFD :</span>
                <span className="font-semibold">{loanDetails.sfd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agent :</span>
                <span className="font-semibold">{loanDetails.agent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <User size={16} />
                  Client :
                </span>
                <span className="font-semibold">{loanDetails.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Phone size={16} />
                  Téléphone :
                </span>
                <span className="font-semibold">{loanDetails.clientPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Mail size={16} />
                  Email :
                </span>
                <span className="font-semibold">{loanDetails.clientEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de début :</span>
                <span className="font-semibold">
                  {new Date(loanDetails.startDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de fin :</span>
                <span className="font-semibold">
                  {new Date(loanDetails.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Échéancier de remboursement */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <Calendar size={24} />
              Échéancier de Remboursement
            </h2>
            <span className="text-sm text-gray-600">
              Mensualité : {formatCurrency(loanDetails.monthlyPayment)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">N°</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Intérêts</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentSchedule.map((payment) => (
                  <TableRow key={payment.installmentNumber}>
                    <TableCell className="text-center font-medium">
                      {payment.installmentNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payment.principal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payment.interest)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.paidDate ? (
                        <span className="text-green-600 text-sm">
                          {new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {payment.status === "En cours" && (
                        <Button
                          size="sm"
                          onClick={() => handlePayInstallment(payment.installmentNumber)}
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
                Paiement de l'échéance {selectedInstallment?.installmentNumber}
              </DialogTitle>
              <DialogDescription>
                Échéance du {selectedInstallment && new Date(selectedInstallment.dueDate).toLocaleDateString('fr-FR')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Montant à payer *</Label>
                  <Input
                    id="amount"
                    type="number"
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
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intérêts :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.interest)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total :</span>
                    <span>{selectedInstallment && formatCurrency(selectedInstallment.totalAmount)}</span>
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