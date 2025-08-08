const Sidebar = () => {
  return (
    <aside className="w-48 fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
      <div className="mt-8 mb-8 text-xl font-bold tracking-wide text-center">save mate</div>

      <ul className="space-y-4">
        <li className="hover:text-yellow-300 cursor-pointer flex justify-center">MAIN</li>
        <li className="hover:text-yellow-300 cursor-pointer flex justify-center">MISSON</li>
        <li className="hover:text-yellow-300 cursor-pointer flex justify-center">FRIEND</li>
      </ul>

      <ul className="pt-2 mb-8">
        <li className="hover:text-yellow-300 cursor-pointer flex justify-center">LOGOUT</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
