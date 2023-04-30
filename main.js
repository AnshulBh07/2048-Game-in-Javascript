//defining variables
var board;
var rows = 4;
var columns = 4;
var score = 0;

window.onload = function () {
  //we call a setGame function on window load
  setGame();
};

function setGame() {
  //initially the board will be empty
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  //now we populate our board with empty tiles first
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      //we need to create a <div id="coordinate" > </div> element
      let tile = document.createElement("div");
      let num = board[i][j];
      //setting the id for this element
      tile.id = i.toString() + "-" + j.toString();

      //now we call an update tile function that will update the tile style depending on it's value
      updateTile(tile, num);

      //appending tiles to board
      document.getElementById("board").append(tile);
    }
  }
  generateTwo();
  generateTwo();
}

function updateTile(tile, num) {
  //clearing the contents inside if any
  tile.innerText = "";
  //clearing class
  tile.classList.value = "";
  //adding the tile class list
  tile.classList.add("tile");

  //now depending on the value the tile holds we will style it
  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

//now creating event handler, we will use an event object e to find out what event occured
//for us 4 events can occur all of which are associated with key press
document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    // slide left function is called
    slideLeft();
    generateTwo();
  } else if (e.code == "ArrowRight") {
    slideRight();
    generateTwo();
  } else if (e.code == "ArrowUp") {
    slideUp();
    generateTwo();
  } else if (e.code == "ArrowDown") {
    slideDown();
    generateTwo();
  }
  document.getElementById("score").innerHTML = score;
});

/*What our function is supposed to do is:
1.Take the complete row as input (for sliding left and right only); [2,2,2,0]
2.Clear zeroes; [2,2,2]
3.Shift left or right to add consecutive similars; [4,0,2]
4.Clear zeroes again; [4,2]
5.Append zeroes (empty tiles) again; [4,2,0,0]
And we get our modified row after slide.*/
function clearZeroes(r) {
  return r.filter((num) => num != 0);
}

function slide(nums) {
  //first clearing zeroes
  nums = clearZeroes(nums); //[2,2,2]

  //adding consecutive similars
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] == nums[i + 1]) {
      nums[i] *= 2;
      nums[i + 1] = 0;
      score += nums[i];
    }
  } //[4,0,2]

  //clear zero again
  nums = clearZeroes(nums); //[4,2]

  //append zeroes/empty tiles
  while (nums.length < columns) {
    nums.push(0);
  } //[4,2,0,0]
  return nums;
}

function slideLeft() {
  //we will iterate for all rows of our matrix so
  for (let i = 0; i < rows; i++) {
    let r = board[i];
    r = slide(r);
    board[i] = r;

    //now we update our html again
    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  //we will iterate for all rows
  for (let i = 0; i < rows; i++) {
    let r = board[i].reverse();
    r = slide(r);
    board[i] = r.reverse();

    //updating html
    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];

      updateTile(tile, num);
    }
  }
}

//up and down functions are performed for the columns
function slideUp() {
  //has to be done for all columns
  for (let j = 0; j < columns; j++) {
    let nums = [];
    //forming nums arrow to operate slide on
    for (let i = 0; i < rows; i++) {
      nums.push(board[i][j]);
    }

    nums = slide(nums);

    //updating html for that column
    for (let i = 0; i < rows; i++) {
      board[i][j] = nums[i];
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let j = 0; j < columns; j++) {
    let nums = [];

    for (let i = 0; i < rows; i++) {
      nums.push(board[i][j]);
    }

    nums = nums.reverse();

    nums = slide(nums);

    nums = nums.reverse();

    for (let i = 0; i < rows; i++) {
      board[i][j] = nums[i];
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];

      updateTile(tile, num);
    }
  }
}

//now we create a function to generate 2 randomly
function generateTwo() {
  //first we check whether the board has empty tile or not
  if (!hasEmptyTile()) return;

  //this variable is used to find an empty tile given that it exists
  let found = false;
  while (!found) {
    let i = Math.floor(Math.random() * rows);
    let j = Math.floor(Math.random() * columns);

    if (board[i][j] == 0) {
      board[i][j] = 2;
      //adding this tile to the html
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      updateTile(tile, 2);
      found = !found;
    }
  }
}

//this function will also determine whether the game gets over or not
function hasEmptyTile() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] == 0) return true;
    }
  }
  return false;
}
