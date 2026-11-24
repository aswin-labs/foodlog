import React, { createContext, useMemo } from 'react';
import { createServices, type IServices } from '@/services';

export const ServiceContext = createContext<IServices | null>(null);

export interface ServiceProviderProps {
  children: React.ReactNode;
  services?: IServices;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children, services }) => {
  const serviceContainer = useMemo(() => {
    return services || createServices();
  }, [services]);

  return (
    <ServiceContext.Provider value={serviceContainer}>
      {children}
    </ServiceContext.Provider>
  );
};
