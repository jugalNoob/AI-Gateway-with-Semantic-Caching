
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
    <>
      <nav className="navbar">

        <div className="logo">
          AI Cache
        </div>

        <div className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/Aisearch"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            AI Search
          </NavLink>

          <NavLink
            to="/dash"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

        </div>

      </nav>

      <Outlet />
    </>
  );
}

export default Nav;
