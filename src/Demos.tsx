import { Outlet, useMatches } from 'react-router';


function Demos() {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const title = (currentRoute?.handle as { title?: string })?.title;

  return (
    <div id="app">
      <div className="group">
        {title && <h2>{title}</h2>}
      </div>
      <Outlet/>
    </div>
  )
}

export default Demos
