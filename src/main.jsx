import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import App from './App.jsx'
import "./index.css";
import StartRating from "./StartRating";
import App from "./App - v1";

function Test() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <StartRating color="blue" onRating={setRating} />
      <p>The movie is {rating} rating</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    {/* <StartRating
      messages={["Bad", "Good", "Best", "Wonderfull", "Amazing"]}
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>
);
