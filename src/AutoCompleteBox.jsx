import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";

const AutoCompleteBox = ({ items = [], onSelect }) => {
  const [isVisible, setVisibility] = useState(false);
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(-1);

  const showSuggestions = () => setVisibility(true);
  const hideSuggestions = () => setVisibility(false);

  const containerRef = useRef(null);
  const searchListRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      hideSuggestions();
    }
  };

  // scrolling to given position on up arrow and down arrow
  const scrollToItem = (position) => {
    searchListRef.current.scrollTo({
      top: position - 180,
      behavior: "smooth"
    });
  };

  // generating list array for suggestion box
  const searchList = useMemo(() => {
    if (!text) return items;

    setCursor(-1);
    scrollToItem(0);

    return (
      items &&
      items.filter((item) => {
        return item.name.toLowerCase().includes(text.toLowerCase());
      })
    );
  }, [items, text]);

  useEffect(() => {
    if (cursor < 0 || cursor > searchList.length || !searchListRef) {
      return () => {};
    }

    let listItems = Array.from(searchListRef.current.children);

    listItems[cursor] && scrollToItem(listItems[cursor].offsetTop);
  }, [cursor, searchList]);

  // Handling keyboard navigations
  const handleKeyboard = (e) => {
    switch (e.key) {
      case "ArrowDown":
        isVisible
          ? setCursor((c) => (c < searchList.length - 1 ? c + 1 : c))
          : showSuggestions();
        break;
      case "ArrowUp":
        setCursor((c) => (c > 0 ? c - 1 : 0));
        break;
      case "Escape":
        hideSuggestions();
        break;
      case "Enter":
      case cursor > 0:
        setText(searchList[cursor].name);
        hideSuggestions();
        onSelect(searchList[cursor]);
        break;
      case "Backspace":
        showSuggestions();
        break;
      default:
        showSuggestions();
    }
  };

  return (
    <div className="auto-complete-wrapper" ref={containerRef}>
      <input
        type="text"
        name="search"
        placeholder="Search"
        autoComplete="off"
        className="search-bar"
        onClick={() => showSuggestions()}
        onChange={(e) => (items.length ? setText(e.target.value) : "")}
        onKeyDown={(e) => handleKeyboard(e)}
        value={text}
      />
      <ul ref={searchListRef} className={`${isVisible ? "show" : "hide"}`}>
        {searchList.length ? (
          searchList.map((item, i) => (
            <ListItem
              key={i}
              index={i}
              item={item}
              hideSuggestions={hideSuggestions}
              setText={setText}
              onSelect={onSelect}
              cursor={cursor}
            />
          ))
        ) : (
          <li>No Result Found</li>
        )}
      </ul>
    </div>
  );
};

AutoCompleteBox.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func
};

export default AutoCompleteBox;
