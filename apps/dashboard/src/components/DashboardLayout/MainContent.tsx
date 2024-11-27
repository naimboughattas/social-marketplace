import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  isSidebarCollapsed: boolean;
}

export default function MainContent({ children, isSidebarCollapsed }: MainContentProps) {
  return (
    <div className={`transition-all duration-200 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}