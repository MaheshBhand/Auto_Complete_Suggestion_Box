import React, { useState, useEffect } from "react";
import axios from "axios";
import AutoCompleteBox from "./AutoCompleteBox";
import "./styles.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  // API Call
  const getResponse = async () => {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/character/?name=rick"
    );

    let result = response.data.results;
    setItems(result);
  };

  useEffect(() => {
    !items.length && getResponse();
  });

  return (
    <div className="App">
      <h1>Auto Complete Suggestion Box</h1>
      <p>{JSON.stringify(selectedItem)}</p>
      <br />
      <AutoCompleteBox items={items} onSelect={setSelectedItem} />
    </div>
  );
}
