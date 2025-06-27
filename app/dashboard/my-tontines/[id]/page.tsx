'use client'
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { mockTontines, mockTransactionHistory } from "@/data/mockData";
import {
  ArrowLeft, Calendar, Building, TrendingUp, CreditCard, FileText, AlertCircle, CheckCircle, Plus, Minus, Target, Wallet, Activity,
} from "lucide-react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Tontine } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import ContributionForm from "@/components/dashboard/ContributionForm";
import WithdrawalForm from "@/components/forms/WithdrawalForm";


const TontineDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const tontineId = params.id as string;
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false); 
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false); 
  const [tontine, setTontine] = useState<Tontine | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Données statiques pour le calendrier de contributions
  const contributionCalendar = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthName = new Date(2025, monthIndex, 1).toLocaleDateString('fr-FR', { month: 'long' });
    const days = Array.from({ length: 31 }, (_, dayIndex) => {
      const dayNumber = dayIndex + 1;
      let isPaid = false;
      let isSfdBenefit = false;

      if (dayNumber === 1) {
        isSfdBenefit = true;
        isPaid = true;
      } else if (monthIndex < 6 && [5, 10, 15, 20, 25].includes(dayNumber)) {
        isPaid = true;
      }

      return { day: dayNumber, isPaid, isSfdBenefit };
    });

    return { month: monthName, monthIndex, days };
  });

  useEffect(() => {
    const fetchTontineDetails = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundTontine = mockTontines.find(t => t.id === tontineId);
      if (foundTontine) {
        const detailedTontine: TontineDetails = {
          ...foundTontine,
          status: 'active',
          dateAdhesion: '2024-10-15',
          miseJournaliere: 1500,
          soldeActuel: 45000,
          totalCotise: 67500,
          prochaineCycle: '2025-01-15',
          numeroCarnet: 3
        };
        setTontine(detailedTontine);

        const tontineTransactions = mockTransactionHistory.filter(
          t => t.tontine === foundTontine.name
        );
        setTransactions(tontineTransactions);
      }

      setIsLoading(false);
    };

    if (tontineId) {
      fetchTontineDetails();
    }
  }, [tontineId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!tontine) {
    return (
      <div className="flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Tontine introuvable</h2>
            <p className="text-gray-600 mb-6">La tontine demandée n'existe pas ou n'est plus accessible.</p>
            <GlassButton onClick={() => router.push('/dashboard')} size="lg">
              Retour au tableau de bord
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const progressPercentage = (tontine.totalCotise / (tontine.miseJournaliere * 365)) * 100;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header moderne */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <GlassButton
              variant="outline"
              onClick={() => router.back()}
              className="mr-4 h-10 w-10 p-0 rounded-full"
            >
              <ArrowLeft size={18} />
            </GlassButton>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{tontine.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="mr-2" size={16} />
                  {tontine.sfd}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Adhéré le {format(new Date(tontine.dateAdhesion), 'dd MMM yyyy', { locale: fr })}
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${tontine.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${tontine.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  {tontine.status === 'active' ? 'Active' : 'En cours'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <GlassButton className="w-full h-12 text-left justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer"
                onClick={() => setIsContributionModalOpen(true)}
              >
                <Plus className="mr-3" size={20} />
                <div>
                  <div className="font-medium">Cotiser</div>
                </div>
              </GlassButton>

              <GlassButton variant="outline" className="w-full h-12 text-left justify-start border-2 cursor-pointer"
              onClick={() => setIsWithdrawalModalOpen(true)}
              >
                <CreditCard className="mr-3" size={20} />
                <div>
                  <div className="font-medium">Retirer</div>
                </div>
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Stats cards modernes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Solde disponible</p>
                <p className="text-2xl font-bold text-blue-600">{tontine.soldeActuel.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wallet className="text-blue-600" size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total cotisé</p>
                <p className="text-2xl font-bold text-green-600">{tontine.totalCotise.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mise journalière</p>
                <p className="text-2xl font-bold text-purple-600">{tontine.miseJournaliere.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA/jour</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Carnet actuel</p>
                <p className="text-2xl font-bold text-orange-600">#{tontine.numeroCarnet}</p>
                <p className="text-xs text-gray-500">Cycle 31 jours</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="text-orange-600" size={24} />
              </div>
            </div>
          </GlassCard>
        </div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Calendrier" title="Calendrier">
              <Card>
                <CardBody>
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Calendrier des contributions 2025</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {contributionCalendar.map((month) => (
                        <div key={month.monthIndex} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <h4 className="text-base font-semibold text-gray-800 mb-3 capitalize text-center">
                            {month.month}
                          </h4>
                          <div className="grid grid-cols-7 gap-1">
                            {month.days.map((day) => (
                              <div
                                key={day.day}
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105",
                                  day.isSfdBenefit
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm"
                                    : day.isPaid
                                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                              >
                                {day.isPaid ? (
                                  <CheckCircle size={12} />
                                ) : (
                                  day.day
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-6 justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Contribution payée</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Commission SFD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 rounded-lg"></div>
                        <span className="text-sm text-gray-700 font-medium">Non payé</span>
                      </div>
                    </div>
                  </GlassCard>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="History" title="Historique des opérations">
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <GlassCard className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Historique des transactions</h3>
                      <div className="space-y-3">
                        {transactions.slice(0, 10).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.montant > 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {transaction.montant > 0 ? (
                                  <Plus className={`${transaction.montant > 0 ? 'text-green-600' : 'text-red-600'}`} size={20} />
                                ) : (
                                  <Minus className={`${transaction.montant > 0 ? 'text-green-600' : 'text-red-600'}`} size={20} />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{transaction.type}</p>
                                <p className="text-sm text-gray-500">{format(new Date(transaction.date), 'dd MMM yyyy', { locale: fr })}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${transaction.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.montant > 0 ? '+' : ''}{transaction.montant.toLocaleString()} FCFA
                              </p>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${transaction.statut === 'Confirmé'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {transaction.statut}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
      {isContributionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl">
            <button
              onClick={() => setIsContributionModalOpen(false)}
              className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>
            <ContributionForm />
          </div>
        </div>
      )}
          {isWithdrawalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full relative max-w-xl">
            <button
              onClick={() => setIsWithdrawalModalOpen(false)}
              className="absolute top-5 right-5 text-black hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>
            <WithdrawalForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default TontineDetailsPage;