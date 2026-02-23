import { Bg404 } from "./components/general/Bg404";

function Page404() {

  return (
    <>
      <Bg404
        style={{
          width: "100dvw",
          height: "100dvh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "#a8d0db",
        }}
      />
    </>
  );
}

export default Page404;