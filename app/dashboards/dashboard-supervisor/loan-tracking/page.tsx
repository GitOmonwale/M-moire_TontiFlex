'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Filter, 
  Search, 
  Eye, 
  Phone, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  DollarSign,
  Calendar,
  Target,
  Send,
  Download,
  RefreshCw,
  CreditCard,
  Percent,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockActiveLoans, type ActiveLoan } from '@/data/supervisorMockData';

const LoanTrackingPage = () => {
  const [filterStatus, setFilterStatus] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Calculs des statistiques
  const totalLoans = mockActiveLoans.length;
  const currentLoans = mockActiveLoans.filter(loan => loan.status === 'current').length;
  const lateLoans = mockActiveLoans.filter(loan => loan.status === 'late').length;
  const defaultedLoans = mockActiveLoans.filter(loan => loan.status === 'defaulted').length;
  const totalOutstanding = mockActiveLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalOriginal = mockActiveLoans.reduce((sum, loan) => sum + loan.approvedAmount, 0);
  const portfolioPerformance = ((totalOriginal - totalOutstanding) / totalOriginal) * 100;

  // Filtrage et tri des prêts
  const filteredLoans = mockActiveLoans
    .filter(loan => {
      const statusMatch = filterStatus === "tous" || loan.status === filterStatus;
      const searchMatch = searchTerm === "" || 
        loan.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "dueDate":
          comparison = new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime();
          break;
        case "amount":
          comparison = a.remainingAmount - b.remainingAmount;
          break;
        case "lateDays":
          comparison = (a.daysLate || 0) - (b.daysLate || 0);
          break;
        case "name":
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'late':
        return <AlertTriangle className="text-red-600" size={16} />;
      case 'defaulted':
        return <AlertTriangle className="text-red-800" size={16} />;
      case 'completed':
        return <CheckCircle className="text-blue-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current':
        return 'À jour';
      case 'late':
        return 'En retard';
      case 'defaulted':
        return 'Défaillant';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'late':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'defaulted':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculateProgress = (loan: ActiveLoan) => {
    const paidPayments = loan.paymentsTotal - loan.paymentsDue;
    return (paidPayments / loan.paymentsTotal) * 100;
  };

  const isPaymentDueSoon = (nextPaymentDate: string) => {
    const dueDate = new Date(nextPaymentDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi des Remboursements</h1>
            <p className="text-gray-600">Surveillez les prêts actifs et les échéances</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Rapport Excel
            </GlassButton>
            <GlassButton variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Actualiser
            </GlassButton>
          </div>
        </div>

        {/* Statistiques du portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total prêts</p>
                <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
              </div>
              <CreditCard className="text-emerald-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">À jour</p>
                <p className="text-2xl font-bold text-green-600">{currentLoans}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">{lateLoans}</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Encours total</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {(totalOutstanding / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </GlassCard>
        </div>

        {/* Alertes et notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Prêts en retard */}
          {lateLoans > 0 && (
            <GlassCard className="p-6 border-l-4 border-l-red-500" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-700 flex items-center">
                  <AlertTriangle className="mr-2" size={20} />
                  Prêts en Retard ({lateLoans})
                </h3>
                <GlassButton size="sm" variant="outline">
                  <MessageSquare className="mr-1" size={14} />
                  Relancer tous
                </GlassButton>
              </div>
              <div className="space-y-2">
                {mockActiveLoans.filter(loan => loan.status === 'late').map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{loan.clientName}</p>
                      <p className="text-sm text-red-600">{loan.daysLate} jours de retard</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600">
                        {loan.monthlyPayment.toLocaleString()} FCFA
                      </span>
                      <GlassButton size="sm" variant="outline">
                        <Phone size={12} />
                      </GlassButton>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Échéances prochaines */}
          <GlassCard className="p-6 border-l-4 border-l-yellow-500" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-700 flex items-center">
                <Clock className="mr-2" size={20} />
                Échéances Prochaines
              </h3>
              <GlassButton size="sm" variant="outline">
                <Send className="mr-1" size={14} />
                Rappels SMS
              </GlassButton>
            </div>
            <div className="space-y-2">
              {mockActiveLoans
                .filter(loan => isPaymentDueSoon(loan.nextPaymentDate))
                .map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{loan.clientName}</p>
                      <p className="text-sm text-yellow-600">
                        Échéance: {format(new Date(loan.nextPaymentDate), 'dd MMM', { locale: fr })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-yellow-600">
                        {loan.monthlyPayment.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </GlassCard>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="text-emerald-600" size={20} />
              <span className="text-emerald-600 font-medium">Filtres :</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Rechercher par nom ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60"
                />
              </div>

              {/* Filtre par statut */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white/60">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous statuts</SelectItem>
                  <SelectItem value="current">À jour</SelectItem>
                  <SelectItem value="late">En retard</SelectItem>
                  <SelectItem value="defaulted">Défaillant</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/60">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Prochaine échéance</SelectItem>
                  <SelectItem value="amount">Montant restant</SelectItem>
                  <SelectItem value="lateDays">Jours de retard</SelectItem>
                  <SelectItem value="name">Nom client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Liste des prêts */}
        <GlassCard className="p-6" hover={false}>
          <div className="space-y-4">
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <div key={loan.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Informations client */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{loan.clientName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CreditCard className="mr-1" size={14} />
                              ID: {loan.id}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1" size={14} />
                              Début: {format(new Date(loan.startDate), 'dd MMM yyyy', { locale: fr })}
                            </div>
                            <div className="flex items-center">
                              <Percent className="mr-1" size={14} />
                              Taux: {loan.interestRate}%
                            </div>
                          </div>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-nowrap border ${getStatusColor(loan.status)}`}>
                            {getStatusIcon(loan.status)}
                            <span className="ml-1">{getStatusLabel(loan.status)}</span>
                          </span>
                          {loan.daysLate && loan.daysLate > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              +{loan.daysLate}j
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Détails financiers */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Montant initial</p>
                          <p className="font-bold text-emerald-600">{loan.approvedAmount.toLocaleString()} FCFA</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Reste à rembourser</p>
                          <p className="font-bold text-blue-600">{loan.remainingAmount.toLocaleString()} FCFA</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Mensualité</p>
                          <p className="font-bold text-purple-600">{loan.monthlyPayment.toLocaleString()} FCFA</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Prochaine échéance</p>
                          <p className="font-bold text-gray-600">
                            {format(new Date(loan.nextPaymentDate), 'dd MMM', { locale: fr })}
                          </p>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression du remboursement</span>
                          <span>{loan.paymentsTotal - loan.paymentsDue}/{loan.paymentsTotal} paiements</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              loan.status === 'late' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${calculateProgress(loan)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Informations sur les paiements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Dernier paiement:</p>
                          <p className="text-sm text-gray-900">
                            {loan.lastPaymentDate ? 
                              format(new Date(loan.lastPaymentDate), 'dd MMM yyyy', { locale: fr }) :
                              'Aucun paiement'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Échéances restantes:</p>
                          <p className="text-sm text-gray-900">{loan.paymentsDue} paiements</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-32 lg:text-right">
                      <div className="flex lg:flex-col items-center lg:items-end gap-2">
                        <GlassButton 
                          size="sm" 
                          className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Eye className="mr-1" size={14} />
                          Détails
                        </GlassButton>
                        
                        {loan.status === 'late' && (
                          <GlassButton 
                            variant="outline" 
                            size="sm"
                            className="w-full lg:w-auto border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Phone className="mr-1" size={14} />
                            Relancer
                          </GlassButton>
                        )}
                        
                        <GlassButton 
                          variant="outline" 
                          size="sm"
                          className="w-full lg:w-auto"
                        >
                          <Download className="mr-1" size={14} />
                          Échéancier
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-600 text-lg mb-4">Aucun prêt trouvé</p>
                <p className="text-gray-500">Essayez de modifier les filtres de recherche</p>
              </div>
            )}
          </div>
          
          {filteredLoans.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              {filteredLoans.length} prêt(s) trouvé(s) sur {mockActiveLoans.length} au total
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default LoanTrackingPage;