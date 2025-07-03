'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTontines } from "@/hooks/useTontines";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, Coins, Filter, Loader2 } from "lucide-react";
import { Tontine } from "@/types/tontines";

const AvailableTontines = () => {
  const { fetchAvailableTontines, loading, error } = useTontines();
  const [tontines, setTontines] = useState<Tontine[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<string>("all");

  // Chargement initial des tontines disponibles
  useEffect(() => {
    const loadTontines = async () => {
      try {
        const availableTontines = await fetchAvailableTontines();
        setTontines(availableTontines);
        console.log("availableTontines", availableTontines);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };

    loadTontines();
  }, []);

  // Filtrage local basé sur les montants
  const filteredTontines = tontines.filter(tontine => {
    const minAmount = parseFloat(tontine.montantMinMise);
    const maxAmount = parseFloat(tontine.montantMaxMise);
    
    const amountMatch = selectedAmount === "all" || 
      (selectedAmount === "500-1000" && minAmount >= 500 && maxAmount <= 1000) ||
      (selectedAmount === "1000-5000" && minAmount >= 1000 && maxAmount <= 5000) ||
      (selectedAmount === "5000+" && maxAmount > 5000);
    
    return amountMatch;
  });

  const handleReload = async () => {
    try {
      const availableTontines = await fetchAvailableTontines();
      setTontines(availableTontines);
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto md:px-20 sm:px-10 px-5 py-16">
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-red-600 text-lg">Erreur lors du chargement des tontines disponibles</p>
            <GlassButton 
              onClick={handleReload}
              className="mt-4"
            >
              Réessayer
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>   
      <div className="container mx-auto md:px-20 sm:px-10 px-5 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Tontines Disponibles</h1>
          <p className="text-xl text-gray-700">Choisissez la tontine qui correspond à vos besoins</p>
          {tontines.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">{tontines.length} tontines disponibles</p>
          )}
          
          {/* Bouton de rechargement */}
          <div className="mt-4">
            <GlassButton
              variant="outline"
              onClick={handleReload}
              disabled={loading}
              className="text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Actualisation...
                </>
              ) : (
                'Actualiser les tontines'
              )}
            </GlassButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <GlassCard hover={false}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-primary" size={20} />
                <span className="text-primary font-medium">Filtre :</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Montant (FCFA)</label>
                  <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                    <SelectTrigger className="w-48 bg-white/50 z-20">
                      <SelectValue placeholder="Tous les montants" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">Tous les montants</SelectItem>
                      <SelectItem value="500-1000">500 - 1 000</SelectItem>
                      <SelectItem value="1000-5000">1 000 - 5 000</SelectItem>
                      <SelectItem value="5000+">5 000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="ml-2 text-primary">Chargement des tontines...</span>
          </div>
        )}

        {/* Tontines Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTontines.map((tontine) => (
                <GlassCard key={tontine.id} className="hover:shadow-xl transition-all duration-300">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">{tontine.nom}</h3>
                      {tontine.description && (
                        <p className="text-sm text-gray-600">{tontine.description}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <span className={`capitalize font-medium px-2 py-1 rounded text-xs ${
                          tontine.statut === 'active' ? 'bg-green-100 text-green-800' :
                          tontine.statut === 'fermee' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tontine.statut}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Contribution:</span>
                        <span className="font-medium">
                          {parseFloat(tontine.montantMinMise).toLocaleString()} - {parseFloat(tontine.montantMaxMise).toLocaleString()} FCFA
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Coins className="mr-1" size={16} />
                          Frais d'adhésion:
                        </span>
                        <span className="font-medium">{parseFloat(tontine.fraisAdhesion).toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Users className="mr-1" size={16} />
                          Participants:
                        </span>
                        <span className="font-medium">{tontine.participants?.length || 0}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="mr-1" size={16} />
                          Créée le:
                        </span>
                        <span className="font-medium text-sm">
                          {new Date(tontine.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      {tontine.statut === 'active' ? (
                        <Link href={`/dashboards/dashboard-client/my-tontines/${tontine.id}`}>
                          <GlassButton className="w-full">
                            <Coins className="mr-2" size={16} />
                            Rejoindre cette tontine
                          </GlassButton>
                        </Link>
                      ) : (
                        <GlassButton className="w-full" disabled variant="outline">
                          Tontine non disponible
                        </GlassButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Empty State */}
            {filteredTontines.length === 0 && !loading && (
              <div className="text-center py-12">
                <GlassCard>
                  <p className="text-gray-600 text-lg">Aucune tontine ne correspond à vos critères de recherche.</p>
                  <GlassButton
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedAmount("all")}
                  >
                    Réinitialiser les filtres
                  </GlassButton>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AvailableTontines;