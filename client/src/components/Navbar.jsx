const Navbar = () => (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur">
        <h1 className="text-xl font-semibold">
            Premium<span className="text-sky-400">Trips</span>
        </h1>
        <button className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-sm">
            Sign In
        </button>
    </nav>
);

export default Navbar;
