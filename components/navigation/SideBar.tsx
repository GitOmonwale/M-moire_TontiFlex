import React from 'react';
import { sidebarItem } from '@/constants';

const SideBar = () => {
  return (
    <div className="w-64 h-screen  bg-primary text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItem.map((item, index) => (
            <li key={index}>
              <a href={item.link} className="flex items-center p-2 rounded hover:bg-primary/10">
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
