import Layout from 'src/Layout.tsx';
import { lazy } from 'react';

const App = lazy(()=>import( "src/App" ));
const Demos = lazy(()=>import( "src/Demos" ));
const ImageCropDemo = lazy(()=>import( 'demos/usedrag/components/ImageCropDemo' ) );
const ResizeDemo = lazy(()=>import( 'demos/usedrag/components/ResizeDemo' ));
const NormalElementBounds = lazy(()=>import( 'demos/usedrag/components/NormalElementBounds' ));
const ImageElementBounds = lazy(()=>import( 'demos/usedrag/components/ImageElementBounds' ));
const ImageObjectPosition = lazy(()=>import( 'demos/usedrag/components/ImageObjectPosition' ));
const DemosIndex = lazy(()=>import( './components/demos' ));
const CssEasing = lazy(()=>import( './components/demos/usedrag/components/CssEasing' ));
const UseDragIndex = lazy(()=>import( './components/demos/usedrag/UseDragIndex' ));
const Page404 = lazy(()=>import( 'src/404' ));

export interface RouteConfig {
  path?: string;
  index?: boolean;
  element?: React.ReactElement;
  title?: string;
  handle?: { title?: string };
  children?: RouteConfig[];
  showInMenu?: boolean;
}

const routeConfig: RouteConfig[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
        title: "Home"
      },
      {
        path: "demos",
        element: <Demos />,
        title: "Demos",
        children: [
          {
            index: true,
            element: <DemosIndex />,
            handle: { title: "These are all my Demos" }
          },
          {
            path: "usedrag",
            title: "Use Drag",
            handle: { title: "Use Drag" },
            children: [
              {
                index: true,
                // element: <Navigate to="imagecrop" replace/>
                element: <UseDragIndex/>,
                handle: { title: "Use Drag" },
              },
              {
                path: "csseasing",
                element: <CssEasing />,
                title: "CSS Easing",
                handle: { title: "CSS Easing" }
              },
              {
                path: "imagecrop",
                element: <ImageCropDemo />,
                title: "Image Crop",
                handle: { title: "Image Crop" }
              },
              {
                path: "resize",
                element: <ResizeDemo />,
                title: "Resize",
                handle: { title: "Resize" }
              },
              {
                path: "dragwithbounds",
                element: <NormalElementBounds />,
                title: "Drag with Bounds",
                handle: { title: "Drag with Bounds" }
              },
              {
                path: "dragimagewithbounds",
                element: <ImageElementBounds />,
                title: "Drag Image with Bounds",
                handle: { title: "Drag Image with Bounds" }
              },
              {
                path: "dragimagewithobjectposition",
                element: <ImageObjectPosition />,
                title: "Drag Image with Object Position",
                handle: { title: "Drag Image with Object Position" }
              }
            ]
          },
          {
            path: "404",
            title: "404",
            handle: { title: "404" },
            element: <Page404 />
          }
        ]
      },
      {
        path: "*",
        element: <Page404 />,
        title: "404",
        showInMenu: false,
      }
    ]
  }
];
export default routeConfig;