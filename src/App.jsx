import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [selected, setSelected] = useState("1, 2");
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const newPixels = [];

    for (let y = 1; y < 2501; y++) {
      let val = Math.floor(Math.random() * (4 - 1 + 1) + 1);
      let color;
      if (val === 1) {
        color = "red";
      } else if (val === 2) {
        color = "green";
      } else if (val === 3) {
        color = "white";
      } else {
        color = "blue";
      }

      newPixels.push({ coords: (`${Math.ceil(y / 50)}, ${y - ((Math.ceil(y / 50) - 1) * 50)}`), color: color });
    }

    setPixels(newPixels);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <div>
        <div className="basic-grid">
          {pixels.map((meow) => (
            <div
              className={`card + ${meow.color}`}
              key={meow.coords}
              onMouseOver={() => {
                setSelected(meow.coords + ' ' + meow.color);
              }}
            ></div>
          ))}
        </div>
      </div>

      <footer>
        <h1>{selected}</h1>
      </footer>
    </>
  )
}

export default App
