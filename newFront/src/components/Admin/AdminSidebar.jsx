import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <aside className="w-64 min-h-screen bg-gray-50 border-r p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded transition-colors ${isActive ? "bg-recipe-primary text-white" : "hover:bg-gray-200"}`
                    }
                    end
                >
                    Dashboard
                </NavLink>
                {/* Future admin links can go here */}
            </nav>
        </aside>
    );
};

export default AdminSidebar; 