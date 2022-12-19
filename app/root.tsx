import {
  LiveReload,
  Outlet,
  Links,
  Scripts,
  ScrollRestoration,
  Meta,
} from "@remix-run/react";
import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Self Driving Car</title>
        <Meta />
        <Links />
      </head>
      <body className="m-0 overflow-hidden bg-slate-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
