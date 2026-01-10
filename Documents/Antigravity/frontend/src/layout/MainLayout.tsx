import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function MainLayout() {
    const location = useLocation();

    // Extract current page from path for Navbar highlighting
    const getCurrentPage = () => {
        const path = location.pathname.substring(1); // remove leading slash
        if (path === "") return "dashboard";
        return path;
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 h-screen w-full flex flex-col">
            <div className="container mx-auto h-full max-w-2xl flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-hidden relative">
                    <Outlet />
                </div>
                <Navbar currentPage={getCurrentPage()} />
            </div>
        </div>
    );
}
