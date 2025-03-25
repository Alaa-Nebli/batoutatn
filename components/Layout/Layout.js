// components/Layout/_layout.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { useState } from 'react';
import { Header } from "components//Header";
import { Footer } from "components//Footer";

const adminNavigation = [
    { name: "Se connecter", href: '/admin/', icon: 'material-symbols:login' },
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'material-symbols:dashboard' },
    { name: 'Voyages a l\'étranger', href: '/admin/trip', icon: 'material-symbols:view-list' },
    { name: 'Programmes en tunisie', href: '/admin/programs', icon: 'material-symbols:featured-play-list' },
    { name: 'A la une', href: '/admin/offers', icon: 'material-symbols:percent' },
];

export const Layout = ({ children, className = "" }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isAdminRoute = router.pathname.startsWith('/admin');

    // Regular user layout
    if (!isAdminRoute) {
        return (
            <main className={`main relative overflow-hidden ${className}`}>
                <Header />
                {children}
                <Footer />
            </main>
        );
    }

    // Admin layout
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <aside 
                className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <Icon icon="material-symbols:close" className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-6 px-4">
                    <ul className="space-y-2">
                        {adminNavigation.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href}>
                                    <div
                                        className={`flex items-center rounded-lg p-2 text-base font-normal transition duration-300 ease-in-out hover:bg-gray-100 ${
                                            router.pathname === item.href
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'text-gray-900'
                                        }`}
                                    >
                                        <Icon icon={item.icon} className="h-6 w-6 mr-3" />
                                        {item.name}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Admin Main Content */}
            <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : '0'}`}>
                {/* Admin Header */}
                <header className="bg-white shadow">
                    <div className="flex h-16 items-center justify-between px-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 focus:outline-none lg:hidden"
                        >
                            <Icon 
                                icon="material-symbols:menu" 
                                className="h-6 w-6"
                            />
                        </button>

                        <div className="flex items-center">
                            <span className="text-sm text-gray-700">
                                {session?.user?.email}
                            </span>
                            <button
                                onClick={() => router.push('/api/auth/signout')}
                                className="ml-4 text-sm text-gray-700 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Admin Page Content */}
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;