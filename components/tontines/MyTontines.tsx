import { GlassButton } from '@/components/GlassButton'
import { GlassCard } from '@/components/GlassCard'
import Link from 'next/link'
import { Building, Calendar, Eye, Plus, Users } from 'lucide-react'
import React from 'react'
import { mockTontines } from '@/data/mockData'

const MyTontines = () => {
    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    Mes Tontines
                </h2>
                <Link href="/tontines">
                    <GlassButton size="sm" className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2" size={16} />
                        Rejoindre
                    </GlassButton>
                </Link>
            </div>

            <div className="grid gap-4">
                {mockTontines.map((tontine) => (
                    <div key={tontine.id} className="bg-gradient-to-r from-white to-emerald-50 rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{tontine.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Building className="mr-1" size={14} />
                                        {tontine.sfd}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-1" size={14} />
                                        Carnet #3
                                    </div>
                                </div>
                            </div>
                            <Link href={`/dashboards/dashboard-client/my-tontines/${tontine.id}`}>
                                <GlassButton variant="outline" size="sm">
                                    <Eye className="mr-1" size={14} />
                                    Détails
                                </GlassButton>
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Solde actuel</p>
                                <p className="font-bold text-emerald-600">{tontine.balance.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">FCFA</p>
                            </div>
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Mise journalière</p>
                                <p className="font-bold text-blue-600">1,500</p>
                                <p className="text-xs text-gray-500">FCFA</p>
                            </div>
                            <div className="text-center p-3 bg-white/60 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Prochaine cotisation</p>
                                <p className="font-bold text-orange-600">Aujourd'hui</p>
                                <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyTontines