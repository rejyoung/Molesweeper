const mediaQuery = window.matchMedia('(min-width: 600px)')
const gameContainer = document.querySelector(".game-container");
const gameBoard = document.querySelector(".gameBoard");
const startDialogue = document.querySelector('#startDialogue');
const playBtn = document.querySelector('#play');
const difSelect = document.querySelector('#difficulty');
const difHead = document.querySelector('#difficulty h2');
const difBtns = document.querySelectorAll('.diff-buttons button');
const easyBtn = document.querySelector('#easy');
const medBtn = document.querySelector("#medium");
const hardBtn = document.querySelector("#hard");
const startBtn = document.querySelector("#start-game");
const againBtn = document.querySelector('#play-again');
const introText = document.querySelector('.intro-text');
const introTextP = document.querySelector("#intro-paragraph");
const okayBtn = document.querySelector('#okay');
const sideBar = document.querySelector('.side-bar-content');
const sideBarContain = document.querySelector('.side-bar')
const introLogo = document.querySelector('#intro-logo');
const infoBtn = document.querySelector('#info-button')
const flagCounter = document.querySelector('#flags-remaining');
const endDialogue = document.querySelector('.end-dialogue-container');
const endgameH1 = document.querySelector('.end-dialogue h1');
const endgameImg = document.querySelector("#end-game-image");
const endgameText = document.querySelector(".end-dialogue p");
const pop = document.querySelector('#pop')
const muteBtn = document.querySelector('#mute-unmute')
const mobileMuteBtn = document.querySelector("#mobile-mute-unmute");
const soundtrack = document.querySelector('#soundtrack')
const mobileLogoBanner = document.querySelector(".mobile-logo-banner");
const flagToggleBtn = document.querySelector("#flag-toggle-button")
const height = ~~(12 * (gameBoard.clientHeight/gameBoard.clientWidth))
const width = Math.ceil(12 * (gameBoard.clientWidth / gameBoard.clientHeight));
const tl = gsap.timeline()
let flagDialogue;
const cookieObj = makeCookieObj()
let replay; 

setTimeout(() => {
  if (Object.keys(cookieObj).includes("playAgain")) {
    replay = cookieObj["playAgain"];
  } else {
    replay = false;
  }
}, 5)





window.addEventListener('load', () => {
  if(cookieObj) {
    if(cookieObj['muted']=="true") {
      soundtrack.muted=true
      muteBtn.src="img/audio-muted.svg";
      mobileMuteBtn.src="img/audio-muted-mobile.svg"
    }
  } else {
    document.cookie = "muted=false"
  }
  
  if(mediaQuery.matches){
    tl
    .set(sideBar, {x: "-40vw"})
    .set(sideBar, {visibility: "visible"}, '+= 1');
    flagDialogue = `right-clicking <img src="img/right-click.svg" class="right-click"> on it. Doing so will mark the hill 
                 so you can remember and will keep you from accidentally smashing the hill. 
                 You can unflag a hill the same way.`;
  } else {
    tl
    .set(sideBarContain, {y: "10dvh"})
    .set(sideBarContain, {visibility: "visible"}, '+= 1');
    flagDialogue = `press and hold for one second on the molehills you want to flag. Doing so will mark the hill so you can remember and will keep you from accidentally smashing the hill in the future. Press and hold for one second again to unflag the molehill.`;
  }

  introTextP.innerHTML = `You just discovered that your yard is covered in molehills. 
                    Smash them down so the grass can grow, but be careful! 
                Some of the hills have moles sleeping underneath, and they don't like to be woken up.
                After you smash a hill, you'll see a handy-dandy number telling you whether there are any moles
                 under the adjacent molehills, and if so, how many there are.<br><br>
                 Think you know where a mole is sleeping? Flag it by ${flagDialogue} (Hint: You have the same number of flags as there are moles.)<br><br>
                 To win, smash all the hills except those that a mole is sleeping under. If you wake a mole, though, it'll wake its friends, and the game will be over.<br><br>
                 Good luck!`
  if (replay=='true') {
    if(mediaQuery.matches) {
      tl
      .set(startDialogue, {width: '50vw', height: '70dvh', x: '-100vw', opacity: 1})
    } else {
      gsap.set(startDialogue, {width: '100vw', height: '100dvh', borderRadius: 0, y: '100dvh', opacity: 1})
    }
    gsap.set(startDialogue, {visibility: 'visible', delay: 1.5})
    setTimeout(()=> gameSetup(), 1500)
  } else {
    gsap.set([introLogo, playBtn, startDialogue], {visibility: 'visible'})
    gsap.from(introLogo, {duration: 1, rotation: 360, opacity: 0, scale: .02, ease: 'power2.out', transformOrigin: '50% 50%', delay: 0.0000001})
    if(mediaQuery.matches) {
      tl
      .to(introLogo, {duration: .5, scale: .5, y: '-22dvh', delay: 1})
      .from(startDialogue, {duration: .5, scale: .2, opacity: 0, ease: 'back.out'})
      .set(gameContainer, {x: '100vw'})
    } else {
      tl
        .from(startDialogue, {duration: .5, scale: .2, opacity: 0, ease: 'back.out', delay: 1})
        .set(gameContainer, {x: '100vw'})
    }
  }
})

playBtn.addEventListener("click", gameSetup);

againBtn.addEventListener('click', () => {
  document.cookie = "playAgain=true; max-age=8"
  let audioFade = setInterval(() => {
    if (!soundtrack.muted) {
        soundtrack.volume -= 0.05;
    } else {
        clearInterval(audioFade);
    }
  }, 35);
  if(mediaQuery.matches) {
    gsap.to(endDialogue, {duration: .3, x: '-100dvh'})
    gsap.to(muteBtn, {duration: .3, opacity: 0})
    gsap.to(gameContainer, {duration: .5, x: '100vw', onComplete: () => {location.reload()}})
  } else {
    gsap.to(endDialogue, {duration: .3, y: '100dvh', onComplete: () => {location.reload()}})
  }
});
    
muteBtn.addEventListener('click', () => {
  if (!soundtrack.muted) {
    soundtrack.muted = true;
    muteBtn.src='img/audio-muted.svg';
    document.cookie="muted=true"
  } else {
    soundtrack.muted = false;
    muteBtn.src='img/audio.svg'
    document.cookie="muted=false"
  }
})

mobileMuteBtn.addEventListener("click", () => {
  if (!soundtrack.muted) {
    soundtrack.muted = true;
    mobileMuteBtn.src = "img/audio-muted-mobile.svg";
    document.cookie="muted=true"
  } else {
    soundtrack.muted = false;
    mobileMuteBtn.src = "img/audio-mobile.svg";
    document.cookie="muted=false"
  }
});


//***************************************//
//*************** CLASSES ***************//
//***************************************//

class Square {
    constructor(column, row, isMole = false, isRevealed = false) {
        this.col = column;
        this.row = row;
        this.isMole = isMole;
        this.isRevealed = isRevealed;
        this.adjMoles = 0;
        this.adjacentList = []
    };
    setRevealed() {
        this.revealed = true;
    };
    
    addAdj(coord) {
        this.adjacentList.push(coord)
    }
    incAdjMoles() {
        this.adjMoles++
    }
    get adjacents() {
        return this.adjacentList
    }
    get coordinates() {
        return JSON.stringify([this.col, this.row])
    }
}

class Board {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.boardDict = new Map()
    };
    addSquare(column, row, isMole = false) {
        let square = new Square(column, row, isMole);
        let coord = JSON.stringify([column, row])
        this.boardDict.set(coord, square)
    }
    getSquare(coord) {
        return this.boardDict.get(coord)
    }
    toggleFlag(coord) {
        let square = this.boardDict.get(coord)
        square.toggleFlag()
    }
    establishAdjs() {
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [coord, square] of this.boardDict) {
            let parsCoord = JSON.parse(coord)
            for (let [x, y] of directions) {
                let adj = [parsCoord[0] + x, parsCoord[1] + y]
                if (adj[0] >= 0 && adj[0] < this.width && adj[1] >= 0 && adj[1] < this.height) {
                    if (Math.abs(x) != Math.abs(y)) {
                        square.addAdj(JSON.stringify(adj))
                    }
                    if (this.boardDict.get(JSON.stringify(adj)).isMole) {
                      square.incAdjMoles();
                    }
                }
            }
        }
    }
}

//***************************************//
//*************** GAMEPLAY **************//
//***************************************//


function gameSetup() {
   let difficulty;
    easyBtn.addEventListener("click", () => {
      easyBtn.classList.add("selected");
      console.log('selected')
      difficulty = "easy";
      if (medBtn.classList.contains("selected")) {
        medBtn.classList.remove("selected");
      }
      if (hardBtn.classList.contains("selected")) {
        hardBtn.classList.remove("selected");
      }
      if (startBtn.style.opacity == 0) {
        gsap.to(startBtn, {
          duration: 0.2,
          opacity: 1,
          scale: 1,
          ease: "back-out",
        });
        startBtn.addEventListener("click", () => {
          playGame(difficulty);
        });
      }
    });
    medBtn.addEventListener("click", () => {
      medBtn.classList.add("selected");
      difficulty = "medium";
      if (easyBtn.classList.contains("selected")) {
        easyBtn.classList.remove("selected");
      }
      if (hardBtn.classList.contains("selected")) {
        hardBtn.classList.remove("selected");
      }
      if (startBtn.style.opacity == 0) {
        gsap.to(startBtn, {
          duration: 0.2,
          opacity: 1,
          scale: 1,
          ease: "back-out",
        });
        startBtn.addEventListener("click", () => {
          playGame(difficulty);
        });
      }
    });
    hardBtn.addEventListener("click", () => {
      hardBtn.classList.add("selected");
      difficulty = "hard";
      if (medBtn.classList.contains("selected")) {
        medBtn.classList.remove("selected");
      }
      if (easyBtn.classList.contains("selected")) {
        easyBtn.classList.remove("selected");
      }
      if (startBtn.style.opacity == 0) {
        gsap.to(startBtn, {
          duration: 0.2,
          opacity: 1,
          scale: 1,
          ease: "back-out",
        });
        startBtn.addEventListener("click", function () {
          playGame(difficulty);
        });
      }
    });
    
    
    gsap.to(playBtn, {duration: .3, scale: 0, opacity: 0})
    if(replay=='true') {
      if(mediaQuery.matches) {
        gsap.to(startDialogue, {duration: .5, x: 0, ease: "power1.out"})
      } else {
        gsap.to(startDialogue, {duration: .5, y: 0, ease: "power1.out"})
      }
    } else {
      if(mediaQuery.matches) {
        tl
        .to(startDialogue, {duration: .5, width: '50vw', opacity: 1, ease: "back-out"})
        .to(startDialogue, {duration: .5, height: '70dvh', ease: 'back-out'}, '-=.4')
      } else {
        tl
        .to(startDialogue, {duration: .5, width: '100vw', opacity: 1, ease: "back-out"})
        .to(startDialogue, {duration: .3, height: '100dvh', borderRadius: 0, ease: 'back-out'}, '-=.4')
      }
    }

    gsap.set(introLogo, {display: 'none', delay: 1.3})

    if(!mediaQuery.matches) {
      tl
      .set(mobileLogoBanner, {display: 'block', delay: 1.3})
      .set(sideBarContain, {display: 'block'})
    }

    tl
    .set(playBtn, {display: 'none', delay: .5})
    .set(difSelect, {display: 'block'}, '<')
    .set(startBtn, {display: 'block', opacity: 0, scale: .2}, '<')
    .from(difHead, {duration: .2, scale: .2, opacity: 0, transformOrigin: '50% 50%'})
    .from(difBtns, {duration: .2, scale: .2, opacity: 0, stagger: .1, ease: 'back-out'})
}

function playGame(difficulty) {
  //*************** INITIALIZATION **************//
  // let isFDown = false;
  let gameLost = false;
  let gameWon = false;
  let touchTimer = null;
  let revealedList = [];
  const moleList = genMoles(height, width, difficulty);
  let flagsRemaining = moleList.length;
  let tilesRevealed = 0;
  flagCounter.innerText = flagsRemaining;

  if (replay=='true') {
    gsap.to(startDialogue, { duration: 0.2, opacity: 0 });
    if (mediaQuery.matches) {
      gsap.to(sideBar, { duration: 0.2, x: 0, delay: 0.2 });
    } else {
      gsap.to(sideBarContain, { duration: 0.2, y: 0, delay: 0.2 });
    }
    tl
      .to(startDialogue, { display: "none", delay: 0.2 })
      .to(gameContainer, { duration: 1, x: 0, opacity: 1 }, "<");;
  } else {
    gsap.to([difSelect, startBtn], { duration: .6, y: '-150dvh' })
    if(mediaQuery.matches) {
      gsap.to(startDialogue, { duration: 0.2, height: "90dvh", delay: 0.2})
    }
    tl
      .set([difSelect, startBtn], { display: "none", delay: 0.5})
      .set([introText, okayBtn], { display: "block", y:'100dvh', opacity: 1}, "<")
      .to([introText, okayBtn], { duration: 0.5, y:0 })
      .to(gameContainer, { duration: 1, x: 0, opacity: 1 }, "<");
  }
  
  soundtrack.volume = 0.4
  soundtrack.play()
  if(mediaQuery.matches) {
    muteBtn.style.display = 'inline-block'
  }

  okayBtn.addEventListener("click", () => {
    gsap.to(startDialogue, { duration: 0.2, opacity: 0 });
    if (mediaQuery.matches) {
      gsap.to(sideBar, { duration: 0.2, x: 0, delay: 0.2 });
    } else {
      gsap.to(sideBarContain, { duration: 0.2, y: 0, delay: 0.2 });
    }
    gsap.to(startDialogue, { display: "none", delay: 0.2 });
  });

  infoBtn.addEventListener("click", () => {
    if(!mediaQuery.matches) {
      gsap.to(sideBarContain, {duration: 0.2, y: '10dvh'})
    }
    tl
    .set(startDialogue, {display: 'flex'})
    .to(startDialogue, {duration: 0.2, opacity: 1})
  })

  // flagToggleBtn.addEventListener("click", () => {
  //   if (!isFDown) {
  //     isFDown = true;
  //     flagMode = true;
  //     this.classList.add("flag-selected");
  //     this.firstChild.src = "img/flag-selected.png";
  //   } else {
  //     isFDown = false;
  //     this.classList.remove("flag-selected");
  //     flagMode = false;
  //     this.firstChild.src = "img/flag.png";
  //   }
  // }); 

  //*************** BOARD CREATION **************//

  //**Establish Virtual Board **/
  const MOLEFIELD = new Board(height, width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (moleList.includes(JSON.stringify([x, y]))) {
        MOLEFIELD.addSquare(x, y, true);
      } else {
        MOLEFIELD.addSquare(x, y);
      }
    }
  }
  MOLEFIELD.establishAdjs();
  console.log(MOLEFIELD.boardDict.size)

  //** Establish Visual Board**//
  gameBoard.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  for (let coord of MOLEFIELD.boardDict.keys()) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("hidden");
    square.id = coord;
    squareP = document.createElement("p");
    squareP.innerText = MOLEFIELD.getSquare(coord).adjMoles;
    
    if (!mediaQuery.matches) {
      square.addEventListener("touchstart", () => {
        touchTimer = setTimeout(() => flag(square), 1000)
      })
      square.addEventListener("touchEnd", () => {
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
        } else {
          reveal(square)
        }
      })
      square.addEventListener("touchcancel", () => {
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }
      })
    } else {
      square.addEventListener("click", () => reveal(square)),
      square.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        flag(event.target);
      });
      square.addEventListener("mouseenter", () => {
        if (
          !gameLost &&
          !gameWon &&
          !square.classList.contains('flagged') &&
          square.classList.contains("hidden")
        ) {
          square.style.backgroundImage = 'url("img/dirt-mound-squashed.png")';
        }
      }),
      square.addEventListener("mouseleave", () => {
        if (!gameLost && !gameWon && !square.classList.contains('flagged')) {
          square.removeAttribute("style");
        }
      });
      squareP.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        flag(square);
      })
    }

    square.appendChild(squareP);
    gameBoard.appendChild(square);
  }

  //*************** MOVE HANDLER/GAME LOGIC **************//
  function reveal(square) {
    if (!gameLost && !gameWon) {
      currentSquare = MOLEFIELD.getSquare(square.id);
      if (!square.classList.contains("flagged")) {
        revealSub(currentSquare);
        if (currentSquare.isMole) {
          gameLost = true;
          document.getElementById(
            currentSquare.coordinates
          ).style.backgroundImage = "url('img/moles.png')";
          moleSqrs = [...moleList];
          moleSqrs.splice(moleSqrs.indexOf(currentSquare.coordinates), 1);
          let timer = 400;
          function molePop() {
            let moleCoord = moleSqrs.pop();
            let sqr = MOLEFIELD.getSquare(moleCoord);
            revealSub(sqr);
            document.getElementById(moleCoord).style.backgroundImage =
              "url('img/moles.png')";
            if (moleSqrs.length > 0) {
              if (timer > 50) {
                timer -= 25;
              }
              setTimeout(molePop, timer);
            }
          }
          setTimeout(molePop, 750);
          if (mediaQuery.matches) {
            endGame();
          } else {
            let endGameDelay = 500;
            for (i = 0; i < moleList.length; i++) {
              toAdd = 400 - i * 25;
              if (toAdd >= 50) {
                endGameDelay += toAdd;
              } else {
                endGameDelay += 50;
              }
            }
            setTimeout(endGame, endGameDelay);
          }
        } else if (currentSquare.adjMoles > 0) {
          square.firstChild.style.opacity = 1;
          square.style.backgroundImage = 'none';
        } else {
          let adjList = [];
          square.style.backgroundImage = "none";
          for (let adjCoord of currentSquare.adjacents) {
            if (!revealedList.includes(adjCoord)) {
              adjList.push(adjCoord);
            }
          }
          let addedList = [...currentSquare.adjacents];
          addedList.push(currentSquare.coordinates);
          while (adjList.length > 0) {
            let currentCoord = adjList.shift();
            let newSquare = MOLEFIELD.getSquare(currentCoord);
            if (
              document
                .getElementById(currentCoord)
                .classList.contains("flagged")
            ) {
              continue;
            } else {
              revealSub(newSquare);
              if (newSquare.adjMoles == 0) {
                for (let adjCoord of newSquare.adjacents) {
                  if (
                    !addedList.includes(adjCoord) &&
                    !revealedList.includes(adjCoord)
                  ) {
                    adjList.push(adjCoord);
                    addedList.push(adjCoord);
                  }
                }
              } else {
                document.getElementById(
                  newSquare.coordinates
                ).firstChild.style.opacity = 1;
              }
            }
          }
        }
      }
    }

    //** Reveal Subfunctions **//

    function revealSub(square) {
      square.setRevealed();
      if (square.isMole) {
        let newPop = pop.cloneNode()
        newPop.play()
      } else {
        tilesRevealed += 1;
      }
      revealedList.push(square.coordinates);
      let htmlSquare = document.getElementById(square.coordinates);
      htmlSquare.classList.remove("hidden");
      htmlSquare.classList.add("revealed");
      console.log(`
      revealing square ${square.coordinates}\n
      total number of tiles/total number of moles: ${MOLEFIELD.boardDict.size}/${moleList.length}\n
      number of revealed tiles: ${tilesRevealed}\n
      total number of non-mole tiles: ${MOLEFIELD.boardDict.size - moleList.length}`);
      if (tilesRevealed == MOLEFIELD.boardDict.size - moleList.length) {
        gameWon = true;
        endGame();
      }
    }

    function endGame() {
      if (gameWon) {
        endgameH1.innerText = 'You Win!'
        endgameImg.src = 'img/sleeping-mole.png'
        endgameText.innerHTML = 'The unoccupied molehills have been smashed, the grass has grown back over them, and the moles are still happily sleeping.<br><br>Good job!'
      } else {
        endgameH1.innerText = "Game Over!";
        endgameImg.src = "img/angry-mole.png";
        endgameText.innerHTML =
          "You woke the moles. The moles are angry. Time to invest in some ankle guards!<br><br>Better luck next time!";
      }
      
      if(mediaQuery.matches) {
        gsap.to(sideBar, {duration: .3, x: '-50vw', ease: 'power2.in'})
      } else {
        gsap.to(sideBar, {duration: .3, y: '40dvh', ease: 'power2.in'})
      }
      gsap.set(sideBar, {display: 'none', delay: 0.3})
      if(mediaQuery.matches) {
        tl
        .set(endDialogue, {display: "flex", x:'-50vw', y:0, delay: 0.4})
        .to(endDialogue, {duration: .3, x: 0, ease: 'power2.out'}, '+=.3')
      } else {
        tl
        .set(endDialogue, {display: "flex", y:'100dvh'})
        .to(endDialogue, {duration: .3, y: 0, ease: 'power2.out'})
        .set([gameContainer, mobileLogoBanner], {display: 'none'})
        .set(sideBarContain, {backgroundColor: '#76bc32'})
      }
    }
  }
  
  function flag(square) {
    console.log(square)
    if (!gameLost && !gameWon) {
      currentSquare = MOLEFIELD.getSquare(square.id);
      if (square.classList.contains("hidden")) {
        if (square.classList.contains("flagged")) {
          square.classList.remove("flagged");
          flagsRemaining += 1;
          flagCounter.innerText = flagsRemaining;
          if(!mediaQuery.matches) {
            square.removeAttribute('style')
          } else {
            square.style.backgroundImage = 'url("img/dirt-mound-squashed.png")';
          }
        } else {
          if (flagsRemaining > 0) {
            square.classList.add("flagged");
            square.style.backgroundImage = 'url("img/flagged.png")'
            flagsRemaining -= 1;
            flagCounter.innerText = flagsRemaining;
          }
        }
        navigator.vibrate(200)
      }
    }
  }
}


//***************************************//
//********** SUPPORT FUNCTIONS **********//
//***************************************//


function genMoles(height, width, difficulty) {
  const moles = [];
  let numHills = height*width
  let coord;
  let num_moles = difficulty=='easy' ? ~~(numHills*0.12) : difficulty=='medium' ? ~~(numHills*0.15) : ~~(numHills*0.2)
  while (moles.length < num_moles) {
    coord = JSON.stringify([
      ~~(Math.random() * width),
      ~~(Math.random() * height),
    ]);
    if (!moles.includes(coord)) { moles.push(coord) };
  }
  return moles;
}

function makeCookieObj() {
  let obj = {};
  if(document.cookie) {
    let cookieString = document.cookie;
    let parsedCookie = cookieString.split("; ");
    
    for (cookie of parsedCookie) {
      let keyValue = cookie.split("=")
      obj[keyValue[0]] = keyValue[1]
    }
    return obj
  } 
  return null 
}



