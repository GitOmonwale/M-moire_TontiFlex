'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  PiggyBank, 
  FileText, 
  User, 
  Bell, 
  Menu, 
  X,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';

// Données de sidebar améliorées
const sidebarItems = [
  {
    id: 1,
    label: 'Tableau de bord',
    icon: Home,
    link: '/dashboard',
    description: 'Vue d\'ensemble'
  },
  {
    id: 2,
    label: 'Mes Tontines',
    icon: Users,
    link: '/dashboard/my-tontines',
    description: 'Gérer vos tontines'
  },
  {
    id: 3,
    label: 'Comptes Épargne',
    icon: PiggyBank,
    link: '/dashboard/savings',
    description: 'Vos épargnes'
  },
   {
    id: 3,
    label: 'Prêts',
    icon: PiggyBank,
    link: '/dashboard/loans',
    description: 'Vos prêts'
  },
  {
    id: 5,
    label: 'Notifications',
    icon: Bell,
    link: '/dashboard/client-notifications',
    description: 'Messages et alertes',
    badge: 3 // Nombre de notifications non lues
  },
  {
    id: 6,
    label: 'Mon Profil',
    icon: User,
    link: '/dashboard/profile',
    description: 'Paramètres du compte'
  }
];

interface SideBarProps {
  isOpen?: boolean;
  onToggle?: () => void;
 onCollapseChange?: (collapsed: boolean) => void; 
}


export const SideBar = ({ isOpen = true, onToggle, onCollapseChange }: SideBarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

const toggleCollapse = () => {
  if (!isMobile) {
    const next = !isCollapsed;
    setIsCollapsed(next);
    if (onCollapseChange) onCollapseChange(next); // <- on informe le parent
  }
};


  return (
    <>
      {/* Overlay pour mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-primary text-white transition-all duration-300 z-50",
        isMobile ? (
          isOpen ? "w-64" : "-translate-x-full"
        ) : (
          isCollapsed ? "w-16" : "w-64"
        )
      )}>
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobile) && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  TontiFlex
                </h1>
                <p className="text-xs text-emerald-200 mt-1">Plateforme digitale</p>
              </div>
            )}
            
            {/* Bouton collapse pour desktop */}
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <ChevronRight 
                  size={16} 
                  className={cn(
                    "transition-transform duration-300",
                    isCollapsed ? "rotate-0" : "rotate-180"
                  )}
                />
              </button>
            )}

            {/* Bouton close pour mobile */}
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors lg:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.link;
            const IconComponent = item.icon;
            
            return (
              <Link key={item.id} href={item.link}>
                <div className={cn(
                  "group relative flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-white/20 shadow-lg backdrop-blur-sm" 
                    : "hover:bg-white/10"
                )}>
                  
                  {/* Icône */}
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "text-emerald-100 group-hover:text-white group-hover:bg-white/10"
                  )}>
                    <IconComponent size={20} />
                  </div>

                  {/* Label et description */}
                  {(!isCollapsed || isMobile) && (
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "font-medium transition-colors",
                          isActive ? "text-white" : "text-emerald-100 group-hover:text-white"
                        )}>
                          {item.label}
                        </span>
                        
                        {/* Badge pour notifications */}
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-xs mt-0.5 transition-colors",
                        isActive ? "text-emerald-100" : "text-emerald-300"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  {/* Tooltip pour mode collapsed */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer de la sidebar */}
        <div className="p-4 border-t border-emerald-500/30 mb-6">
          <div className="space-y-2">
     
            <button className="w-full flex items-center p-2 hover:bg-red-500/20 rounded-lg transition-colors group">
              <LogOut size={18} className="text-emerald-200 group-hover:text-red-300" />
              {(!isCollapsed || isMobile) && (
                <span className="ml-3 text-sm text-emerald-200 group-hover:text-red-300">
                  Déconnexion
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SideBar;