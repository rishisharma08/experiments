import { Outlet, NavLink } from "react-router";
import routes from './routeConfig';
import type { RouteConfig } from './routeConfig';
import './App.css';
import Bg from "./components/general/Bg";
import MenuHamburgerButton from "./components/general/MenuHamburgerButton";
import { useState, Suspense } from "react";

interface SidebarLinksProps {
  routes: RouteConfig[],
  parentPath?: string,
  onLinkClick?: () => void,
}

function SidebarLinks({ routes, parentPath = '', onLinkClick }: SidebarLinksProps ) {
  return (
    <ul
      className={`list-none p-0 whitespace-nowrap ${parentPath ? "pl-2" : ""}`}
    >
      {routes.filter(route => route.title).map((route) => {
        const fullPath = route.path === '/' ? '/' : parentPath + '/' + route.path;
        if( "showInMenu" in route && !route.showInMenu ){
          return null;
        }
        return (
          <li key={fullPath}>
            <NavLink
              to={fullPath}
              className={({ isActive }) =>
                "block " + ( isActive ? "is-active accent-color " : "" )
              }
              onClick={onLinkClick}
            >
              {route.title}
            </NavLink>
            {route.children && (
              <SidebarLinks routes={route.children} parentPath={fullPath} onLinkClick={onLinkClick} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Layout(){
  const navRoutes = routes[0]?.children || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return(
    <div
      className="dark:text-gray-300 flex gap-4"
    >
      <Bg
        className="pointer-events-none absolute z-0 left-0 top-0 w-1/2 sm:w-125"
        style={{
          height: "auto",
          aspectRatio: `10/7`,
          opacity: 0.02,
        }}
      />
      <aside
        className={`flex-none p-0 basis-0 overflow-hidden absolute right-0 h-full bg-white dark:bg-gray-900 transition-all duration-300 sm:basis-75 sm:p-2 sm:relative sm:w-auto sm:bg-transparent z-10 ${isMenuOpen ? 'w-full p-2' : 'w-0'}`}
      >
        <nav>
          <SidebarLinks routes={navRoutes} onLinkClick={() => setIsMenuOpen(false)} />
        </nav>
      </aside>
      <main className="flex-1 p-2 overflow-scroll max-w-full sm:overflow-hidden">
        <MenuHamburgerButton
          className="absolute top-0 right-0 overflow-x-auto sm:hidden z-20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Outlet/>
        </Suspense>
      </main>
    </div>
  )
};

export default Layout;