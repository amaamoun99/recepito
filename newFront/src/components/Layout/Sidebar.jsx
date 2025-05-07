
import { Link } from  "react-router-dom";
import { Button } from  "@/components/ui/button";
import { 
  Home,
  Search,
  User,
  Bookmark,
  Settings,
  Users
} from "lucide-react";


const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="space-y-2 flex-1">
        <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:shadow-lg hover:shadow-recipe-primary/30 transition-all duration-200" asChild>
          <Link to="/">
            <Home className="mr-3 h-5 w-5" />
            Home Feed
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:shadow-lg hover:shadow-recipe-primary/30 transition-all duration-200" asChild>
          <Link to="/explore">
            <Users className="mr-3 h-5 w-5" />
            Explore Users
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:shadow-lg hover:shadow-recipe-primary/30 transition-all duration-200" asChild>
          <Link to="/profile">
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
        </Button>
        {/* <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:shadow-lg hover:shadow-recipe-primary/30 transition-all duration-200" asChild>
          <Link to="/saved">
            <Bookmark className="mr-3 h-5 w-5" />
            Saved Recipes
          </Link>
        </Button> */}
       
      </nav>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:shadow-lg hover:shadow-recipe-primary/30 transition-all duration-200" asChild>
          <Link to="/settings">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
