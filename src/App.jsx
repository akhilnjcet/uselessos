import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { BootScreen } from './components/BootScreen';
import { Desktop } from './components/Desktop';

const OSContent = () => {
  const { isBooted } = useOS();
  return isBooted ? <Desktop /> : <BootScreen />;
};

export default function App() {
  return (
    <OSProvider>
      <OSContent />
    </OSProvider>
  );
}
