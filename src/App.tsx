import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from '@/context/ServiceContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { RestaurantsPage } from '@/pages/RestaurantsPage';
import { RestaurantDetailPage } from '@/pages/RestaurantDetailPage';
import { AddEditRestaurantPage } from '@/pages/AddEditRestaurantPage';
import { AddVisitPage } from '@/pages/AddVisitPage';
import { VisitHistoryPage } from '@/pages/VisitHistoryPage';
import { VisitDetailPage } from '@/pages/VisitDetailPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { FriendsPage } from '@/pages/FriendsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ServiceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/new" element={<AddEditRestaurantPage />} />
            <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="restaurants/:id/edit" element={<AddEditRestaurantPage />} />
            <Route path="visits" element={<VisitHistoryPage />} />
            <Route path="visits/new" element={<AddVisitPage />} />
            <Route path="visits/:id" element={<VisitDetailPage />} />
            <Route path="visits/:id/edit" element={<AddVisitPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServiceProvider>
  );
};

export default App;
