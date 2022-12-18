import { LiveReload, Outlet, Links } from "@remix-run/react";
import styles from "./styles/app.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Self Driving Car</title>
        <Links />
      </head>
      <body className="m-0 overflow-hidden bg-slate-800">
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}