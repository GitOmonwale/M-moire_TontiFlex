import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary mb-1">Bienvenue, Fatou !</h1>
          <p className="text-gray-600 text-sm md:text-base">Voici un aperçu de vos finances.</p>
        </div>
        {/* Tu peux rajouter un bouton ou un avatar à droite si besoin */}
      </div>
    </header>
  )
}

export default Header
