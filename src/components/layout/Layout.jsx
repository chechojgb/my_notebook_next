// components/layout/Layout.jsx
import HorizontalNavbar from "./navbar";

const Layout = ({ children, showSidebar = true }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <HorizontalNavbar />
            
            <div className="pt-16"> {/* Cambié flex a pt-16 para separar del navbar */}
                <main className="ml-0 w-full transition-all duration-300">
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;