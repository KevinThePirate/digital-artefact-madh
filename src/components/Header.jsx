import React from "react";

export default function Header() {
  return (
    <nav>
      {window.innerWidth > 450 && <h1> Kevin Smith Dissertation Study</h1>}
      <ul>
        <li>
          <a href="#">Tutorial</a>
        </li>
        <li>
          <a href="#">Contact Us</a>
        </li>
      </ul>
    </nav>
  );
}
