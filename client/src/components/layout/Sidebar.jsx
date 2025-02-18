import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-full border-r">
      <nav className="p-4 space-y-2">
        <Link
          to="/search"
          className="block px-4 py-2 text-gray-700 hover:bg-primary-DEFAULT hover:text-white rounded-md"
        >
          Artist Search
        </Link>
        <Link
          to="/talent-board"
          className="block px-4 py-2 text-gray-700 hover:bg-primary-DEFAULT hover:text-white rounded-md"
        >
          Talent Board
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
