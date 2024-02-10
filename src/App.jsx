import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { debounce } from 'lodash-es';

function App() {
  const [selected, setSelected] = useState("1, 2");
  const [pixels, setPixels] = useState([]);
  const [currColor, setCurrColor] = useState('#000000');

  useEffect(() => {
    //connect to socket in "index.html"
    socket.connect()

    //turn on a listener for "test-event"
    socket.on('test-event', (data) => {
      console.log(data)
    })

    const board = async () => {
      try {
        const test1 = await axios.get(`http://localhost:8000/getCanvas`);

        console.log(test1.data);

        const drawnPixels = [];

        for (let n = 1; n < test1.data.length + 1; n++) {
          const coordinate = `${Math.ceil(n / 50)}, ${n - ((Math.ceil(n / 50) - 1) * 50)}`;
          drawnPixels.push({ coords: coordinate, color: test1.data[n], index: n });
        }

        setPixels(drawnPixels);
      } catch (error) {
        console.error("Error fetching canvas data:", error);
      }
    };

    board();


    //on component unmout, turn off the listener for "test-event"
    return () => {
      socket.off('test-event')
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleColorChange = debounce((event) => {
    setCurrColor(event.target.value);
  }, 300); // Adjust the debounce time as needed

  return (
    <>
      <div>
        <div className="basic-grid">
          {pixels.map((meow) => (
            <div
              className={`card + ${meow.color}`}
              key={meow.coords}
              index={meow}
              onMouseOver={() => {
                setSelected(meow.coords + ' ' + meow.color + ' ' + meow.index);
              }}
              onClick={() => {
                socket.emit('test-event', { data: {coords: meow.coords, color: currColor}})
                {console.log(meow.index)}
              }}
            ></div>
          ))}
        </div>
      </div>

      <footer>
        <h1>{selected}</h1>
        {/* button that fires test event */}
        <button onClick={() => {
          socket.emit('test-event', { data: 'hello world' })
        }}>Test Event</button>
        <div>
          <label for="head">Current Color</label>
          <input
            type="color"
            id="head"
            value={currColor}
            onChange={handleColorChange}
          />

        </div>
      </footer>
    </>
  )
}

export default App
