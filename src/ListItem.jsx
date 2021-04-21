import React from "react";
import PropTypes from "prop-types";

export default ListItems = ({
  item,
  index,
  hideSuggestions,
  setText,
  onSelect,
  cursor
}) => (
  <li
    onClick={() => {
      hideSuggestions();
      setText(item.name);
      onSelect(item);
    }}
    className={cursor == index ? "active" : ""}
  >
    {item.name}
  </li>
);

ListItems.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  hideSuggestions: PropTypes.func,
  setText: PropTypes.func,
  onSelect: PropTypes.func,
  cursor: PropTypes.number
};
