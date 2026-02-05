import { Outlet, NavLink } from "react-router";
import routes from './routeConfig';
import type { RouteConfig } from './routeConfig';
import './App.css';

function SidebarLinks({ routes, parentPath = '' }: { routes: RouteConfig[], parentPath?: string }) {
  return (
    <ul
      className={`list-none p-0 ${parentPath ? "pl-2" : ""}`}
    >
      {routes.filter(route => route.title).map((route) => {
        const fullPath = route.path === '/' ? '/' : parentPath + '/' + route.path;

        return (
          <li key={fullPath}>
            <NavLink
              to={fullPath}
              className={({ isActive }) =>
                isActive ? "font-bold text-blue-600" : "hover:text-blue-500"
              }
            >
              {route.title}
            </NavLink>
            {route.children && (
              <SidebarLinks routes={route.children} parentPath={fullPath} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Layout(){
  const navRoutes = routes[0]?.children || [];

  return(
    <>
      <aside className="flex-none basis-75 p-2">
        <nav>
          <SidebarLinks routes={navRoutes} />
        </nav>
      </aside>
      <main className="flex-1 p-2">
        <Outlet/>
      </main>
    </>
  )
};

export default Layout;