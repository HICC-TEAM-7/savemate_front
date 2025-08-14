import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "MAIN", path: "/" },
    { name: "MISSION", path: "/mission" },
    { name: "FRIEND", path: "/friend" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside
      className="
        w-48 h-screen fixed top-0 left-0 
        flex flex-col items-center
        border border-white/20 
        bg-white/20 
        backdrop-blur-sm 
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        text-white
        font-pretendard
        py-[40px]
      "
    >
      {/* 상단 - 로고 */}
      <div className="flex justify-center items-center">
        <img
          src="/assets/logo/logo.png"
          alt="Save Mate Logo"
          className="w-[130px] h-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* 중단 - 메뉴 */}
      <div className="flex-1 flex flex-col justify-center">
        <ul className="flex flex-col items-center gap-[36px]">
          {menu.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  [
                    "w-[67px] h-[36px] flex flex-col justify-end items-center",
                    "text-base font-bold leading-[24px] tracking-[-0.32px] text-center",
                    "relative",
                    "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]",
                    "after:w-[30px] after:h-0 after:bg-white after:transition-all after:duration-200 after:ease-out",
                    "hover:after:h-[3px]",
                    isActive
                      ? "text-gray-200 hover:text-gray-200 after:h-[3px]"
                      : "text-white hover:text-white",
                  ].join(" ")
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* 하단 - LOGOUT 버튼 */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="
            w-[67px] h-[36px] flex flex-col justify-end items-center 
            text-base font-bold leading-[24px] tracking-[-0.32px] text-center
            relative cursor-pointer bg-transparent border-none
            after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]
            after:w-[30px] after:h-0 after:bg-white after:transition-all after:duration-200 after:ease-out
            hover:after:h-[3px]
            text-white hover:text-white
          "
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
