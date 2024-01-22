import { useState } from "react";
import { useEffect } from "react";

// importing css
import "./App.css";
import "./Game.css";

// importing data
import { Wavedata } from "./data/Wavedata";

function App() {
  let [missfire, setMissfire] = useState(0);
  let [emenyArray, setEmenyArray] = useState([]);

  let [currentWave, setCurrentWave] = useState(0);
  let [emenyDetailedArray, setEmenyDetailedArray] = useState([]);
  // let [remainingEnemy, setRemainingEnemy] = useState(0);

  let lockedEnemyIndex = -1;
  let remainingEnemy = 0;

  function handleWaves() {
    let count = 0;
    let randomWords = [];

    if (currentWave == 0) count = 3;
    if (currentWave == 1) count = 3;
    if (currentWave == 2) count = 3;
    if (currentWave == 3) count = 2;
    if (currentWave == 4) count = 2;
    if (currentWave == 5) return console.log("Game Completed");

    let counter = count;
    while (counter > 0) {
      let random = Math.floor(Math.random() * Wavedata.length) + 0;
      let randomWord = Wavedata[random];
      if (!randomWords.includes(randomWord)) {
        randomWords.push(randomWord);
      }
      counter--;
    }

    let newWave = currentWave + 1;
    remainingEnemy = randomWords.length;
    // console.log(randomWords);
    // setRemainingEnemy(randomWords.length);
    setCurrentWave(newWave);
    handleDisplayEnemy(randomWords);
    console.log(
      "🧨 HANDLE WAVE IS CALLED",
      "newWave",
      newWave,
      "currentWave",
      currentWave
    );
  }

  function handleDisplayEnemy(randomWords) {
    let words = randomWords;
    let remEnemy = randomWords.length;
    let tempArray = [];
    // console.log("❌",emenyArray)

    for (let i = 0; i < remEnemy; i++) {
      let helperY = 0;
      let random_x = Math.floor(Math.random() * 400);
      let random_y = Math.floor(Math.random() * -80) + helperY;
      let obj = { x: random_x, y: random_y, text: words[i] };
      tempArray.push(obj);
    }

    setEmenyDetailedArray(tempArray);
    console.log("🎃 Genrated waves", tempArray, remainingEnemy);
  }

  const handleFire = (event) => {
    // check waves
    let keyPressed = event.key;
    let currentlyRemainingEnemy = 0;
    for (let i = 0; i < emenyDetailedArray.length; i++) {
      if (emenyDetailedArray[i].text.length > 0) currentlyRemainingEnemy++;
    }
    if (currentlyRemainingEnemy === 0) {
      if (currentWave == 5) {
        alert(`You have completed game with misfiewcount as ${missfire}`);
        window.location.reload();
      }
      handleWaves();
      return;
    }
    console.log(
      "🎹 Keyboard Interupt",
      currentlyRemainingEnemy,
      currentWave,
      remainingEnemy,
      emenyDetailedArray
    );

    // lock mechanism
    let isFound = false;
    if (lockedEnemyIndex == -1) {
      console.log(emenyDetailedArray);
      for (let i = 0; i < emenyDetailedArray.length; i++) {
        let enemyObj = emenyDetailedArray[i];
        let enemyWord = enemyObj.text;
        let enemyLetter = enemyWord[0];

        if (
          enemyLetter &&
          enemyLetter.toLowerCase() == keyPressed.toLowerCase()
        ) {
          isFound = true;
          lockedEnemyIndex = i;
          console.log("🔥 We can Fire", i, emenyDetailedArray[i].text);
        }
      }
    } else {
      isFound = true;
      console.log(
        "🔥 enemy index",
        lockedEnemyIndex,
        emenyDetailedArray[lockedEnemyIndex].text
      );
    }

    // shoot mechanism
    if (!isFound) {
      console.log("missfire ----", missfire);
      let tempMisFire = missfire + 1;
      setMissfire(tempMisFire);
      return;
    }
    let existingState = [...emenyDetailedArray];
    let text = emenyDetailedArray[lockedEnemyIndex].text;
    let newText = text.substring(1);
    existingState[lockedEnemyIndex].text = newText;
    setEmenyDetailedArray(existingState);
    if (newText.length == 0) lockedEnemyIndex = -1;
    console.log("newText", newText);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleFire);
    return (e) => document.removeEventListener("keydown", handleFire);
  }, [emenyDetailedArray, missfire]);

  useEffect(() => {
    const updatePosition = setInterval(() => {
      let existingState = [...emenyDetailedArray];
      console.log(existingState,emenyDetailedArray)
      for(let i=0;i<emenyDetailedArray.length;i++){
        let enemy = emenyDetailedArray[i]
        let new_y = enemy.y
        if(new_y>650) {
          alert("GameOver") 
          window.location.reload();
          // return;
        }
        existingState[i].y = new_y + 10
      }
      setEmenyDetailedArray(existingState); 
      // setCounter(prevCounter => prevCounter + 1);
    }, 200 * 1);
    return () => clearInterval(updatePosition);
  }, [emenyDetailedArray]);

  // calling only one time 
  useEffect(()=>{
    handleWaves();
  },[])
  return (
    <div className="game-bg">
      <div className="game">
        <div className="game-container">
          <div className="game-transparent"></div>
            <div className="data-container">
              <p>Press any Key to Start Game and space to go to next level</p>
              {/* <p>{"REMAINING ENEMY : " + remainingEnemy}</p> */}
              <p>{"CURRENT WAVE : " + currentWave}</p>
              <p>{"MISSFIRE : " + missfire}</p>
            </div>
            <div className="red-lane"></div>
            <div className="enemy-container">
              {emenyDetailedArray.map((e, i) => {
                let show = false;
                {
                  if (e.text.length > 0) show = true;
                }
                return (
                  show && (
                    <span
                      className="enemy-mine"
                      key={i}
                      style={{ top: `${e.y}px`, left: `${e.x}px` }}
                    >
                      <p>{e.text}</p>
                      <div className="rotate mine-img"></div>
                    </span>
                  )
                );
              })}
              {/* <div className="enemy-mine" style={{top:"100px",left:"400px"}}></div> */}
              {/* <div className="enemy-mine"></div>
              <div className="enemy-mine"></div>
              <div className="enemy-mine"></div> */}
            </div>
            <div className="player"></div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
