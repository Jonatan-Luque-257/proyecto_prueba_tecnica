'use client';
import React from 'react';
import { JSX } from 'react/jsx-runtime';

interface Tab {
  id: string;
  label: string;
  content: () => JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  setTextoBuscar: (texto: string) => void;
}

export default function Tabs({ tabs, activeTab, setActiveTab, setTextoBuscar }: TabsProps) {
  return (
    <div className="flex min-h-screen">

      {/* ASIDE */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-gray-800 text-white flex flex-col overflow-y-auto shadow-lg z-20">
        <ul className="tabs flex-1 p-4 space-y-2">
          {tabs.map((tab, index) => (
            <li key={tab.id}>
              <button
                onClick={() => {
                  setActiveTab(index);
                  setTextoBuscar('');
                }}
                className={`block w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${activeTab === index ? 'bg-indigo-600' : 'hover:bg-gray-700 bg-gray-700/60'
                  }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col flex-1 ml-56">
        <main className="flex-1 flex justify-center items-center p-8 overflow-y-auto">
          <div className="w-full max-w-4xl shadow-md rounded-lg p-6">
            {tabs.map((tab, index) => (
              <article
                key={tab.id}
                className={`transition-opacity duration-500 ${activeTab === index ? 'opacity-100' : 'hidden opacity-0'
                  }`}
              >
                {activeTab === index && tab.content()}
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}