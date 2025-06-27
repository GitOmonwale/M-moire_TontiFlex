'use client'
import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockTransactionHistory } from '@/data/mockData';

const OperationHistory = () => {
  const [filterType, setFilterType] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");

  const filteredTransactions = mockTransactionHistory.filter(transaction => {
    const typeMatch = filterType === "tous" || transaction.type.toLowerCase().includes(filterType.toLowerCase());
    const statusMatch = filterStatus === "tous" || transaction.statut.toLowerCase() === filterStatus.toLowerCase();
    return typeMatch && statusMatch;
  });

  return (
    <div className="p-6">
      <GlassCard className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-primary flex items-center">
            <FileText className="mr-2" size={24} />
            Historique des Opérations
          </h2>
          <div className="flex gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="contribution">Contribution</SelectItem>
                <SelectItem value="retrait">Retrait</SelectItem>
                <SelectItem value="dépôt">Dépôt Épargne</SelectItem>
                <SelectItem value="paiement">Paiement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="confirmé">Confirmé</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white/30 rounded-lg overflow-hidden">
          {/* Header de tableau customisé */}
          <div className="bg-primary/10 px-4 py-3 grid grid-cols-6 gap-4 font-semibold text-primary border-b border-primary/20">
            <div>Date</div>
            <div>Type</div>
            <div>Montant</div>
            <div>Tontine/Service</div>
            <div>Statut</div>
            <div>Référence</div>
          </div>
          
          {/* Corps du tableau */}
          <div className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="px-4 py-3 grid grid-cols-6 gap-4 hover:bg-white/20 transition-colors">
                  <div className="text-sm text-gray-700">
                    {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                  <div className="text-sm font-medium">
                    {transaction.type}
                  </div>
                  <div className={`text-sm font-medium ${
                    transaction.montant > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.montant > 0 ? '+' : ''}{transaction.montant.toLocaleString()} FCFA
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.tontine}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.statut === 'Confirmé'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.statut}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {transaction.reference}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <FileText className="mx-auto mb-2 text-gray-400" size={48} />
                <p>Aucune transaction trouvée</p>
                <p className="text-sm">Essayez de modifier les filtres</p>
              </div>
            )}
          </div>
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            {filteredTransactions.length} transaction(s) trouvée(s)
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default OperationHistory;