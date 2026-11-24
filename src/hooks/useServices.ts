import { useContext } from 'react';
import { ServiceContext } from '@/context/ServiceContext';
import type { IServices } from '@/services';

export function useServices(): IServices {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
