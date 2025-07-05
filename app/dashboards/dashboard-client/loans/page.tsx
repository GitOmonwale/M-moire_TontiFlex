'use client'
import { JSX, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Eye,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Building,
  TrendingUp,
  DollarSign,
  Target,
  Download,
  RefreshCw,
  ArrowRight,
  Percent,
  Timer,
  FileText,
  Users,
  BadgeCheck,
  Flag,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import router from "next/router";
import Link from "next/link";

// Types et interfaces
type LoanStatus = 'Actif' | 'En cours' | 'En attente' | 'Remboursé' | 'Suspendu';

interface Loan {
  id: string;
  sfd: string;
  amount: number;
  purpose: string;
  status: LoanStatus;
  startDate: string | null;
  endDate: string | null;
  monthlyPayment: number;
  remainingAmount: number;
  paidAmount: number;
  interestRate: number;
  nextPaymentDate: string | null;
}


const MyLoans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSfd, setSelectedSfd] = useState<string>("all");

  // Données statiques des prêts
  const allLoans: Loan[] = [
    {
      id: "PRT001234567",
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
      nextPaymentDate: "2025-06-15"
    },
    {
      id: "PRT001234570",
      sfd: "SFD Cotonou",
      amount: 300000,
      purpose: "Extension local commercial",
      status: "Remboursé",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      monthlyPayment: 0,
      remainingAmount: 0,
      paidAmount: 300000,
      interestRate: 9.0,
      nextPaymentDate: null
    },
    {
      id: "PRT001234568",
      sfd: "SFD Abomey",
      amount: 200000,
      purpose: "Achat équipement agricole",
      status: "En attente",
      startDate: null,
      endDate: null,
      monthlyPayment: 0,
      remainingAmount: 200000,
      paidAmount: 0,
      interestRate: 7.5,
      nextPaymentDate: null
    },
    {
      id: "PRT001234571",
      sfd: "SFD Cotonou",
      amount: 150000,
      purpose: "Fonds de roulement",
      status: "Remboursé",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      monthlyPayment: 0,
      remainingAmount: 0,
      paidAmount: 150000,
      interestRate: 8.0,
      nextPaymentDate: null
    }
  ];

  // // Statistiques globales
  // const loanStats: LoanStats = {
  //   totalLoaned: allLoans.reduce((sum, loan) => sum + loan.amount, 0),
  //   totalRemaining: allLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0),
  //   totalPaid: allLoans.reduce((sum, loan) => sum + loan.paidAmount, 0),
  //   activeLoans: allLoans.filter(loan => loan.status === "Actif" || loan.status === "En cours").length,
  //   completedLoans: allLoans.filter(loan => loan.status === "Remboursé").length,
  //   averageRate: allLoans.length > 0 ? allLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / allLoans.length : 0
  // };

  // Liste unique des SFD
  const sfdList: string[] = Array.from(new Set(allLoans.map(loan => loan.sfd)));

  // Filtrage des prêts
  const getFilteredLoans = (): Loan[] => {
    return allLoans.filter(loan => {
      const matchesSearch = loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.sfd.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "all" || 
        loan.status.toLowerCase() === filterStatus.toLowerCase();
      
      const matchesSfd = selectedSfd === "all" || loan.sfd === selectedSfd;
      
      return matchesSearch && matchesFilter && matchesSfd;
    });
  };

  const filteredLoans: Loan[] = getFilteredLoans();

  const handleNewLoan = (): void => {
    router.push('/dashboards/dashboard-client/loans/new');
  };

  const handleViewLoan = (loanId: string): void => {
    router.push(`/dashboards/dashboard-client/loans/${loanId}`);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const getStatusIcon = (status: LoanStatus): JSX.Element => {
    switch (status) {
      case "Actif":
      case "En cours":
        return <CheckCircle className="text-green-600" size={16} />;
      case "En attente":
        return <Clock className="text-yellow-600" size={16} />;
      case "Remboursé":
        return <BadgeCheck className="text-blue-600" size={16} />;
      case "Suspendu":
        return <AlertCircle className="text-red-600" size={16} />;
      default:
        return <XCircle className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: LoanStatus): string => {
    switch (status) {
      case "Actif":
      case "En cours":
        return "bg-green-100 text-green-800 border-green-200";
      case "En attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Remboursé":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Suspendu":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Fonction pour vérifier si une SFD peut accorder un nouveau prêt
  const canRequestNewLoan = (sfdName: string): boolean => {
    const sfdLoans = allLoans.filter(loan => loan.sfd === sfdName);
    return !sfdLoans.some(loan => loan.status === "Actif" || loan.status === "En cours");
  };

  // Obtenir les SFD avec prêts actifs
  const getActiveLoanSfds = (): string[] => {
    return allLoans
      .filter(loan => loan.status === "Actif" || loan.status === "En cours")
      .map(loan => loan.sfd);
  };

  const activeLoanSfds = getActiveLoanSfds();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilterStatus(e.target.value);
  };

  const handleSfdChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedSfd(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Prêts</h1>
              <p className="text-gray-600">Gérez et consultez vos demandes de crédit</p>
            </div>

            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Link href="/dashboards/dashboard-client/saving-accounts">
                <GlassButton
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  Nouvelle demande
                </GlassButton>
              </Link>
            </div>
          </div>
          {/* Avertissement discret */}
          <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-medium text-orange-800 mb-1 flex items-center gap-2">
                  <Flag size={16} />
                  <span>Règle importante</span>
                </p>
                <p className="text-sm text-orange-700">
                  Une SFD n'accorde qu'un seul prêt actif à la fois. Vous devez rembourser intégralement votre prêt en cours avant d'en demander un nouveau.
                </p>
                {activeLoanSfds.length > 0 && (
                  <p className="text-sm text-orange-700 mt-2">
                    <strong>SFD avec prêts actifs :</strong> {activeLoanSfds.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-gray-700 font-medium mb-2 block">
                  <Search className="inline mr-2" size={16} />
                  Rechercher un prêt
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="search"
                    type="text"
                    placeholder="Objet du prêt, numéro ou SFD..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sfd-filter" className="text-gray-700 font-medium mb-2 block">
                  <Building className="inline mr-2" size={16} />
                  Filtrer par SFD
                </Label>
                <select
                  id="sfd-filter"
                  value={selectedSfd}
                  onChange={handleSfdChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les SFD</option>
                  {sfdList.map(sfd => (
                    <option key={sfd} value={sfd}>{sfd}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status-filter" className="text-gray-700 font-medium mb-2 block">
                  <Filter className="inline mr-2" size={16} />
                  Filtrer par statut
                </Label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les prêts</option>
                  <option value="actif">Actifs</option>
                  <option value="en cours">En cours</option>
                  <option value="en attente">En attente</option>
                  <option value="remboursé">Remboursés</option>
                  <option value="suspendu">Suspendus</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des prêts */}
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <GlassCard key={loan.id} className="p-6" hover={false}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Building className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{loan.purpose}</h3>
                      <p className="text-sm text-gray-600">{loan.sfd}</p>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(loan.status)
                    )}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-mono mb-3">{loan.id}</p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Montant:</span>
                      <p className="font-semibold text-blue-600">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Taux d'intérêt:</span>
                      <p className="font-semibold text-purple-600">{loan.interestRate}% /an</p>
                    </div>
                    {loan.monthlyPayment > 0 && (
                      <div>
                        <span className="text-gray-600">Mensualité:</span>
                        <p className="font-semibold text-orange-600">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                    )}
                    {loan.nextPaymentDate && (
                      <div>
                        <span className="text-gray-600">Prochain paiement:</span>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(loan.nextPaymentDate), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {loan.status !== "En attente" && loan.amount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progression du remboursement</span>
                    <span className="font-medium">{((loan.paidAmount / loan.amount) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(loan.paidAmount / loan.amount) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Payé: {formatCurrency(loan.paidAmount)}</span>
                    <span>Reste: {formatCurrency(loan.remainingAmount)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {loan.startDate && loan.endDate ? (
                    <>Période: {format(new Date(loan.startDate), 'MMM yyyy', { locale: fr })} - {format(new Date(loan.endDate), 'MMM yyyy', { locale: fr })}</>
                  ) : (
                    <>En attente d'approbation</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!canRequestNewLoan(loan.sfd) && (loan.status === "Actif" || loan.status === "En cours") && (
                    <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full border border-orange-200">
                      Prêt actif - {loan.sfd}
                    </span>
                  )}
                  <Link href={`/dashboards/dashboard-client/loans/${loan.id}`}>
                    <GlassButton
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Voir détails
                      <ArrowRight size={14} />
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredLoans.length === 0 && (
          <GlassCard className="p-12 text-center">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun prêt trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all" || selectedSfd !== "all"
                ? "Aucun prêt ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de prêt."
              }
            </p>
            <GlassButton onClick={handleNewLoan}>
              <Plus size={16} className="mr-2" />
              Faire une demande de prêt
            </GlassButton>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default MyLoans;