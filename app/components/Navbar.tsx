import { Link, useLocation } from "@remix-run/react";

const navClassNames = {
  selected:
    "block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white group transition duration-300",
  unselected:
    "block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group transition duration-300",
};

const navItems = [
  { label: "Home", path: "/" },
  { label: "Playground", path: "/playground" },
  { label: "Play Against AI", path: "/play-against-ai" },
];

export default function Navbar() {
  const { pathname: route } = useLocation();

  return (
    <nav className="bg-gray-900 px-2 sm:px-4 py-2.5 rounded shadow-2xl">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <img
            src="./assets/Car.png"
            className="h-6 mr-3 sm:h-9"
            alt="AutoNavAI Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            AutoNavAI
          </span>
        </Link>
        <div className="w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={
                    route === item.path
                      ? navClassNames.selected
                      : navClassNames.unselected
                  }
                >
                  {item.label}
                  <span
                    className={
                      "block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 " +
                      (route === item.path ? "bg-blue-700" : "bg-gray-100")
                    }
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
