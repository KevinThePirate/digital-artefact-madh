import React from "react";

export default function Header() {
  return (
    <nav>
      {window.innerWidth > 450 && <h1> Kevin Smith Dissertation Study</h1>}
      <ul>
        <li>
          <a href="https://youtu.be/qZrA7FmiVis">Tutorial</a>
        </li>
        <li>
          <a href="mailto:smithkevin1100@gmail.com">Contact Us</a>
        </li>
      </ul>
    </nav>
  );
}
