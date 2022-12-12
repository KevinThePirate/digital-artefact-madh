import React from "react";

export default function StandardHabitListItem(props) {
  const item = props.item;
  return (
    <div>
      <input
        type="checkbox"
        name={item}
        onChange={props.checkboxTogglerValue}
      />
      <label htmlFor={item} className="checkbox-label">
        {item}
      </label>
    </div>
  );
}
