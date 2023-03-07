"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/assets/logo.png";
import { usePathname } from "next/navigation";

const navClassNames = {
  selected:
    "block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white group transition duration-300",
  unselected:
    "block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent group transition duration-300",
};

const navItems = [
  { label: "Play Against AI", path: "/play-against-ai" },
  { label: "Playground", path: "/playground" },
];

export default function Navbar() {
  const route = usePathname();
  return (
    <nav className="bg-gray-900 px-2 sm:px-4 py-2.5 rounded shadow-2xl">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link href="/play-against-ai" className="flex items-center my-0">
          <Image
            src={logo}
            alt={"Autonav AI Logo"}
            width={40}
            height={40}
            className="m-3 ml-0"
          ></Image>
          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            Autonav AI
          </span>
        </Link>
        <div className="w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
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
