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
        <div className="app-bg text-foreground h-screen w-full flex flex-col">
            <div className="container mx-auto h-full max-w-2xl px-4 flex flex-col flex-1 overflow-hidden z-10">
                <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                </main>
                <Navbar currentPage={getCurrentPage()} />
            </div>
        </div>
    );
}
