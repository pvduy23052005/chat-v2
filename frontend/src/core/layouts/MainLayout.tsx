import Header from "@core/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
