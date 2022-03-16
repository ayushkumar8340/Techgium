import React, { Component, useEffect, useState } from "react";
import navicon from '../images/bx_bxs-navigation.png';
import crane from '../images/crane.png';
import collision_warning from "../images/hexagon-xmark-solid.svg";
import jerk_warning from "../images/jerk-detect.svg";
import parse from 'html-react-parser'
// import navigation as img from ../

function Initializer({ socket, createNewSocket, deleteSocket }) {
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [frame, setFrame] = useState({});
  const [gstyle, setGstyle] = useState({});
  const [lgstyle, setLGstyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});

  const messageListener = (message) => {
    const key_val = JSON.parse(message);
    setFrame(key_val["data"]);
  };

  useEffect(() => {
    if (socket != null) {
      socket.on("data", messageListener);
    }
  }, [socket])

  useEffect(() => {
    setGstyle({
      height: `${(frame.building_height / 6) * 480}px`,
    });
    setLGstyle({
      height: `${(frame.active_height / 6) * 480}px`,
    });
    setArrowStyle({
      transform: `rotate(${frame.quad*45-45}deg)`
    })
  }, [frame]);

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewSocket(Number(length), Number(breadth));
  };

  const stop = (event) => {
    event.preventDefault();
    socket.emit("stop", "stopping");
    socket.close();
    deleteSocket();
  };

  const quadGen = () => {
    let ret = '';
    for(let i = 0;i<8;i++) {
      let cls = '';
      console.log(frame[`${String.fromCharCode(97 + i)}1`]);
      if (frame[`${String.fromCharCode(97 + i)}1`] === 2) {
        cls = "sector-red";
      } else if (frame[`${String.fromCharCode(97 + i)}1`] === 1) {
        cls = "sector-yellow";
      }
      ret += 
      `<li ${cls === '' ? '' : `className="${cls}"`}>
        <div></div>
      </li>`;
    }
    return ret;
  }

  const ArrowGen = () => {
    let ret = ``;
    console.log(frame.quad);
    for(let i=0;i<8;i++) {
      if (i === (8+frame.quad-1)%8) {
        ret += `<li style="background: #11AF11"><div></div></li>`;
      } else {
        ret += `<li>
        <div></div>
      </li>`;
      }
    }
    console.log(ret);
    return ret;
  }
  const collision = () => {
    let detect = {};
    if(frame.g1 === 2)
    {
      detect = {filter: 'invert(16%) sepia(72%) saturate(6729%) hue-rotate(355deg) brightness(128%) contrast(107%)', transform: 'scale(1.4)', transition: 'all 0.5s ease'}
    }
    return detect;
  }
  const detection = () => {
    let detect = {};
    if (frame.jerk === 1) {
      detect = {
        filter:
          "invert(16%) sepia(72%) saturate(6729%) hue-rotate(355deg) brightness(128%) contrast(107%)",
        transform: "scale(1.4)",
        transition: "all 0.5s ease",
      };
    }
    return detect;
  };

  return (
    <div className="message-list">
      {socket == null ? (
        <form onSubmit={handleSubmit} className="parameters-form">
          <img src={crane} alt="crane" />
          <div>
            <label>Enter Length</label>
            <input
              type="text"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div>
            <label>Enter breadth</label>
            <input
              type="text"
              value={breadth}
              onChange={(e) => setBreadth(e.target.value)}
            />
          </div>
          <input type="submit" />
        </form>
      ) : (
        <div>
          <main>
            <div className="nav-bar">
              <div className="icons">
                <div>
                  <i className="fa-solid fa-bolt-lightning"></i>
                </div>
                <div>
                  <i className="fa-solid fa-grip"></i>
                </div>
                <div>
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div>
                  <i className="fa-solid fa-location-crosshairs"></i>
                </div>
              </div>
              <div className="battery">
                <div>
                  <div className="cap"></div>
                </div>
                <div>
                  <div className="capacity">
                    <div className="full"></div>
                    <div className="percentage"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main">
              <div className="app-main">
                <div className="parameters">
                  <div className="para-name">
                    <div>Speed</div>
                    <div>Distance</div>
                    <div>Iteration</div>
                  </div>
                  <hr />
                  <div className="para-values">
                    <div>
                      <div>{frame.speed && frame.speed.toFixed(2)} </div>
                      <div className="para-unit">cm/s</div>
                    </div>
                    <div>
                      {frame.distance && frame.distance.toFixed(2)}{" "}
                      <div className="para-unit">M</div>
                    </div>
                    <div>
                      {frame.iteration} <div className="para-unit">cycles</div>
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="crane-comp">
                  <div>
                    <ul className="crane-circle">{parse(quadGen())}</ul>
                  </div>
                  <div className="crane-square"></div>
                </div>
                <div className="arrow-circle">
                  <div className="crane-comp crane-direction">
                    <div>
                      <ul className="crane-circle">{parse(ArrowGen())}</ul>
                    </div>
                    <div className="crane-square crane-arrow">
                      <img src={navicon} alt="navicon" style={arrowStyle} />
                    </div>
                  </div>
                  <div className="collision-detect">
                    <img src={collision_warning} alt="jerk" style={collision()}/>
                  </div>
                  <div className="jerk-detect">
                    <img src={jerk_warning} alt="jerk" style={detection()}/>
                  </div>
                  <div className="go-text" onClick={stop}>
                    STOP
                  </div>
                </div>
              </div>

              <div className="app-sidebar">
                <div className="height-loader">
                  <div className="grey-bar"></div>
                  <div className="green-bar" style={gstyle}>
                    <div>
                      {frame.building_height &&
                        frame.building_height.toFixed(2)}
                      m
                    </div>
                  </div>
                  <div className="light-green-bar" style={lgstyle}>
                    <div>
                      {frame.active_height && frame.active_height.toFixed(2)}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <section>
            <div className="side-panel">
              <h1>Log Sheet</h1>
              <ul>
                <li>
                  Longitude: <span className="log-values">23.165</span>
                </li>
                <li>
                  Latitude: <span className="log-values">79.932</span>
                </li>
                <li>
                  Speed
                  <ul>
                    <li>
                      x:{" "}
                      <span className="log-values">
                        {frame.speed_x && frame.speed_x.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      y:{" "}
                      <span className="log-values">
                        {frame.speed_y && frame.speed_y.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      z:{" "}
                      <span className="log-values">
                        {frame.speed_z && frame.speed_z.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  Acceleration
                  <ul>
                    <li>
                      x:{" "}
                      <span className="log-values">
                        {frame.acceleration_x &&
                          frame.acceleration_x.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      y:{" "}
                      <span className="log-values">
                        {frame.acceleration_y &&
                          frame.acceleration_y.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      z:{" "}
                      <span className="log-values">
                        {frame.acceleration_z &&
                          frame.acceleration_z.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  Jerk
                  <ul>
                    <li>
                      x:{" "}
                      <span className="log-values">
                        {frame.jerk_x && frame.jerk_x.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      y:{" "}
                      <span className="log-values">
                        {frame.jerk_y && frame.jerk_y.toFixed(2)}
                      </span>
                    </li>
                    <li>
                      z:{" "}
                      <span className="log-values">
                        {frame.jerk_z && frame.jerk_z.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  Iterations:{" "}
                  <span className="log-values">{frame.iteration}</span>
                </li>
                <li>
                  N(Jerk warnings):{" "}
                  <span className="log-values">{frame.jerk_warning}</span>
                </li>
                <li>
                  N(Collision warnings):
                  <span className="log-values">{frame.collision_warning}</span>
                </li>
                <li>
                  Nodes Active:
                  <span className="log-values">{frame.nodes}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Initializer;
