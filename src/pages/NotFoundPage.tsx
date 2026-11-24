import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xs">
        <Utensils className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold font-serif text-foreground">Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The dining record or page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')} className="font-semibold shadow-sm">
        <Home className="h-4 w-4 mr-2" />
        Return to Dashboard
      </Button>
    </div>
  );
};
