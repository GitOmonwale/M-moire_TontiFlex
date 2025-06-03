'use client';
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, Coins, Filter } from "lucide-react";

const AvailableTontines = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAmount, setSelectedAmount] = useState<string>("all");

  const mockTontines = [
    {
      id: 1,
      name: "Tontine des Femmes Entrepreneures",
      type: "épargne",
      minAmount: 500,
      maxAmount: 5000,
      frequency: "quotidien",
      members: 25,
      sfd: "SFD Porto-Novo"
    },
    {
      id: 2,
      name: "Groupe Solidaire Parakou",
      type: "crédit",
      minAmount: 1000,
      maxAmount: 10000,
      frequency: "hebdomadaire",
      members: 15,
      sfd: "SFD Parakou"
    },
    {
      id: 3,
      name: "Tontine Agricole Cotonou",
      type: "épargne",
      minAmount: 2000,
      maxAmount: 15000,
      frequency: "mensuel",
      members: 30,
      sfd: "SFD Cotonou"
    },
    {
      id: 4,
      name: "Cercle des Commerçantes",
      type: "mixte",
      minAmount: 1500,
      maxAmount: 8000,
      frequency: "hebdomadaire",
      members: 20,
      sfd: "SFD Bohicon"
    }
  ];

  const filteredTontines = mockTontines.filter(tontine => {
    const typeMatch = selectedType === "all" || tontine.type === selectedType;
    const amountMatch = selectedAmount === "all" || 
      (selectedAmount === "500-1000" && tontine.minAmount >= 500 && tontine.maxAmount <= 1000) ||
      (selectedAmount === "1000-5000" && tontine.minAmount >= 1000 && tontine.maxAmount <= 5000) ||
      (selectedAmount === "5000+" && tontine.maxAmount > 5000);
    
    return typeMatch && amountMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent">  
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Tontines Disponibles</h1>
          <p className="text-xl text-gray-700">Choisissez la tontine qui correspond à vos besoins</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <GlassCard>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="text-primary" size={20} />
                <span className="text-primary font-medium">Filtres :</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Type de tontine</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48 bg-white/50">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="épargne">Épargne</SelectItem>
                      <SelectItem value="crédit">Crédit</SelectItem>
                      <SelectItem value="mixte">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Montant (FCFA)</label>
                  <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                    <SelectTrigger className="w-48 bg-white/50">
                      <SelectValue placeholder="Tous les montants" />
                    </SelectTrigger>
                    <SelectContent>
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

        {/* Tontines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTontines.map((tontine) => (
            <GlassCard key={tontine.id} className="hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{tontine.name}</h3>
                  <p className="text-sm text-gray-600">{tontine.sfd}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize font-medium text-primary">{tontine.type}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Contribution:</span>
                    <span className="font-medium">{tontine.minAmount.toLocaleString()} - {tontine.maxAmount.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="mr-1" size={16} />
                      Fréquence:
                    </span>
                    <span className="capitalize font-medium">{tontine.frequency}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Users className="mr-1" size={16} />
                      Membres:
                    </span>
                    <span className="font-medium">{tontine.members}</span>
                  </div>
                </div>

                <div className="pt-4">
                <Link href={`/tontines/${tontine.id}`}>
                  <GlassButton
                    className="w-full"
                  >
                    <Coins className="mr-2" size={16} />
                    Rejoindre cette tontine
                  </GlassButton>
                </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredTontines.length === 0 && (
          <div className="text-center py-12">
            <GlassCard>
              <p className="text-gray-600 text-lg">Aucune tontine ne correspond à vos critères de recherche.</p>
              <GlassButton
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedType("all");
                  setSelectedAmount("all");
                }}
              >
                Réinitialiser les filtres
              </GlassButton>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableTontines;