"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const links = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Landing Page", url: "/" },
  ];

  const pathname = usePathname();

  return (
    <div className="navbar fixed top-0 z-50 w-full items-center border-b border-b-base-300 bg-white">
      <div className="navbar-start">
        <SignedIn>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 stroke-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              {links.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.url}
                    className={`${pathname === link.url ? "text-primary" : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SignedIn>
      </div>
      <div className="navbar-center">
        <h1 className="text-xl font-bold">Pennybits</h1>
      </div>
      <div className="navbar-end flex items-center gap-2">
        <SignedIn>
          <UserButton
            userProfileMode={"navigation"}
            userProfileUrl={"/user-profile"}
          />
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
