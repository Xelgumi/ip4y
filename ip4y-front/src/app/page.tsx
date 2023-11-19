'use client';
import { useState } from 'react';
import FormularioUsuario from '../components/form';
import ListaUsuario from '../components/list';

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<'formulario' | 'lista'>('formulario');

  const handleAbaClick = (aba: 'formulario' | 'lista') => {
    setAbaAtiva(aba);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex mb-4">
        <button
          className={`mr-4 p-2 ${abaAtiva === 'formulario' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleAbaClick('formulario')}
        >
          Formulário
        </button>
        <button
          className={`p-2 ${abaAtiva === 'lista' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleAbaClick('lista')}
        >
          Lista
        </button>
      </div>

      {abaAtiva === 'formulario' && (
        <FormularioUsuario
          onInserir={(Usuario): void => {
            throw new Error('Function not implemented.');
          }}
        />
      )}

      {abaAtiva === 'lista' && <ListaUsuario />}
    </main>
  );
}
