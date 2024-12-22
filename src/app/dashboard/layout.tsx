import { FC, PropsWithChildren } from 'react';
import { AppSidebar } from '../../components/app-sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';
import Header from '../../components/header';

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
