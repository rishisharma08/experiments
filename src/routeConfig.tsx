import App from 'src/App.tsx'
import Demos from 'src/Demos.tsx';
import ImageCropDemo from 'demos/usedrag/components/ImageCropDemo';
import ResizeDemo from 'demos/usedrag/components/ResizeDemo';
import NormalElementBounds from 'demos/usedrag/components/NormalElementBounds';
import ImageElementBounds from 'demos/usedrag/components/ImageElementBounds';
import ImageObjectPosition from 'demos/usedrag/components/ImageObjectPosition';
import Layout from 'src/Layout.tsx';

export interface RouteConfig {
  path?: string;
  element?: React.ReactElement;
  title?: string;
  handle?: { title?: string };
  children?: RouteConfig[];
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
      }
    ]
  }
];
export default routeConfig;