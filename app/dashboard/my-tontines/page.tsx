import { GlassButton } from '@/components/GlassButton'
import { GlassCard } from '@/components/GlassCard'
import Link from 'next/link'
import { Eye, Plus, Users } from 'lucide-react'
import React from 'react'
import { mockTontines } from '@/data/mockData'

const MyTontines = () => {
    return (
        <section>
                    <div className="bento-grid p-6">
                        {/* Tontines Section */}
                        <GlassCard className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-primary flex items-center">
                                    <Users className="mr-2" size={24} />
                                    Mes Tontines
                                </h2>
                                <Link href={"/tontines"}>
                                    <GlassButton
                                        size="sm"
                                    >
                                        <Plus className="mr-1" size={16} />
                                        Rejoindre
                                    </GlassButton>
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {mockTontines.map((tontine) => (
                                    <div key={tontine.id} className="bg-white/30 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-primary">{tontine.name}</h3>
                                                <p className="text-sm text-gray-600">{tontine.sfd}</p>
                                            </div>
                                            <Link href={`/tontines/tontine-details${tontine.id}`}>
                                                <GlassButton
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="mr-1" size={14} />
                                                    Voir
                                                </GlassButton>
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Solde actuel</p>
                                                <p className="font-semibold">{tontine.balance.toLocaleString()} FCFA</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
        </section>
    )
}

export default MyTontines