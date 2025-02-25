import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-full border-r">
      <nav className="p-4 space-y-2">
        <Link
          to="/search"
          className="block px-4 py-2 text-gray-700 hover:bg-primary-DEFAULT hover:text-blue-500 rounded-md"
        >
          Artist Search
        </Link>
        <Link
          to="/talent-board"
          className="block px-4 py-2 text-gray-700 hover:bg-primary-DEFAULT hover:text-blue-500 rounded-md"
        >
          Talent Board
        </Link>
        <Link
          to="/calendar"
          className="block px-4 py-2 text-gray-700 hover:bg-primary-DEFAULT hover:text-blue-500 rounded-md"
        >
          Calendar
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
