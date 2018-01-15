import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );

}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const winner = calculateWinner(this.props.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else { //display the next player
      status = 'Next player: ' +
        (this.props.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// save the 'move history' to be able to revisit it
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ // beginning of history: empty board
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true, // X starts 
    };
  }
  //moved from board
  handleClick(i) {
    //you can go back in time then click in the board play from that step
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    /*slice: allows to review the game at any step 
    by creating a new array (board) with the new step
    and keeping the old array as well(previous step) */

    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      //as we click on a square we save that move to history
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      //change player on click
    });
  }

  //'X' player plays on even steps and 'O' player on odd steps
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    //read the current step to be able to modify the next one
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares); //check  if someone won
    const fullBoard = isFilled(current.squares); //check board is full

    //map the history stack over your array (board) of data
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return ( //every move has a unique key recorded
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if (winner) {
      status = 'Winner: ' + '\"' + winner +'\"' + '. Congratulations! You are the best!';
    }
    else if (fullBoard && !winner) {
      status = 'Draw: Both players rock!';
    }
    else {
      status = '\"' + (this.state.xIsNext ? 'X' : 'O') + '\"' + ' Player\'s turn: ' + 'Show your opponent what you\'ve got !';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

//calculate the winner via value of X or O on board (brute force)
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // horizontal top
    [3, 4, 5], // horizontal middle
    [6, 7, 8], // horizontal bottom
    [0, 3, 6], // vertical top
    [1, 4, 7], // vertical middle
    [2, 5, 8], // vertical bottom
    [0, 4, 8], // diagonal top-left to bottom-right 
    [2, 4, 6], // diagonal bottom-left to top-right
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; //if the 3 values are the same return winner (X or O)
    }
  }
  return null;
}

// check that the board is filled (brute force)
function isFilled(squares) {
  if (
    squares[0] === null ||
    squares[1] === null ||
    squares[2] === null ||
    squares[3] === null ||
    squares[4] === null ||
    squares[5] === null ||
    squares[6] === null ||
    squares[7] === null ||
    squares[8] === null
  ) {
    return false;
  }
  return true;

}
