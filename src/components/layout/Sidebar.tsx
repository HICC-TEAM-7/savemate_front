import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "MAIN", path: "/" },
    { name: "MISSION", path: "/mission" },
    { name: "FRIEND", path: "/friend" },
  ];

  // 로그아웃 클릭 핸들러
  const handleLogout = () => {
    // 여기에 로그아웃 처리 로직 추가 가능 (토큰 삭제 등)
    // localStorage.removeItem("token");

    // 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <aside className="
        w-48 h-screen fixed top-0 left-0 
        inline-flex flex-col items-center 
        pt-[66px] pr-[11px] pb-[663px] pl-[11px] 
        gap-[238px]
        border border-white/20 
        bg-white/20 
        backdrop-blur-sm 
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        text-white
        font-pretendard
      "
    >
      <div className="flex justify-center items-center">
        <img src="/assets/logo/logo.png"
        alt="Save Mate Logo"
        className="w-[130px] h-auto"
        />
      </div>

      <div className="flex flex-col items-center gap-[297px]">
        {/* 상단 메뉴 */}
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
                    "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]", // 밑줄 간격 조정
                    "after:w-[30px] after:h-0 after:bg-white after:transition-all after:duration-200 after:ease-out",
                    "hover:after:h-[3px]",
                    isActive
                      ? [
                          "text-gray-200",
                          "hover:text-gray-200",
                          "after:h-[3px]",
                        ].join(" ")
                      : [
                          "text-white",
                          "hover:text-white",
                        ].join(" "),
                  ].join(" ")
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 하단 LOGOUT 버튼 */}
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
