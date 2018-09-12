import React, { Component } from 'react';
import classNames from 'classnames'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
      super();
      this.m = 4;
      this.n = 7;

      this.renderCell = this.renderCell.bind(this);
      this.renderRow = this.renderRow.bind(this);
      this.renderGrid = this.renderGrid.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.debounce = this.debounce.bind(this);
      this.findRoute = this.findRoute.bind(this);
      this.findRouteHelper = this.findRouteHelper.bind(this);

      this.deBounceOnClick = this.debounceWithImmediate(
        this.handleClick,
        1000,
        true
      );

      this.startCell = 0;
      this.obstacles = [1, 2, 5, 10];

      this.state = {
        endCell: -1,
        routeCells: [],
        hilightIndex: -1
      }
  }

  findRoute(startKey, endKey) {
    const startX = Math.floor(startKey / this.n);
    const startY = startKey % this.n;

    const endX = Math.floor(endKey / this.n);
    const endY = endKey % this.n;
    const route = [];

    // console.log("Find for: " + startX + startY + endX + endY);

    this.findRouteHelper(startX, startY, endX, endY, route);

    return route;
  }

  findRouteHelper(startX, startY, endX, endY, route) {
    if (startX >= this.m || startY >= this.n || startX < 0 || startY < 0) {
      return false;
    }

    const key = startX * this.n + startY;
    if (this.obstacles.includes(key) || route.includes(key)) {
      return false;
    }

    route.push(key);
    console.log(route + "Route.");
    if ((startX === endX && startY === endY) ||
      this.findRouteHelper(startX + 1, startY, endX, endY, route) ||
      this.findRouteHelper(startX, startY + 1, endX, endY, route) ||
      this.findRouteHelper(startX - 1, startY, endX, endY, route) ||
      this.findRouteHelper(startX, startY - 1, endX, endY, route)) {
      return true;
    }

    route.pop();

    return false;
  }

  debounce(func, wait) {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  debounceWithImmediate(func, wait, immediate) {
    let timeout;
    return (...args) => {
      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      }, wait);

      if (callNow) {
        func.apply(this, args);
      }
    };
  }

  handleClick(key, event) {
    console.log("Click happen! " + key);
    //const routeCells = [ 1, 4, 8 ];

    const route = this.findRoute(this.startCell, key);
    // console.log("route: " + route);

    this.setState({
      routeCells: route,
      hilightIndex: -1,
      endCell: key
    });

    let interval = setInterval(() => {
      this.setState({
        hilightIndex: this.state.hilightIndex + 1
      })

      const { hilightIndex, routeCells } = this.state;
      if (hilightIndex > routeCells.length) {
        console.log("clearInterval");
        clearInterval(interval);
      }
    }, 1000);
  }

  renderCell(row, column) {
    const key = row * this.n + column;
    const isStartCell = this.startCell === key;
    const { routeCells, hilightIndex, endCell } = this.state;

    const indexOfCellInRoute = routeCells.indexOf(key);
    const isRouteCell = indexOfCellInRoute >= 0 && indexOfCellInRoute <= hilightIndex;

    const isObstacle = this.obstacles.includes(key);
    const isEndCell = key === endCell;

    const classes = classNames(
      "Cell",
      { StartCell: isStartCell },
      { RouteCell: isRouteCell },
      { Obstacle: isObstacle },
      { EndCell: isEndCell}
    );

    return (
      <div className={ classes } key={ key }
        onClick={ () => this.deBounceOnClick.call(null, key) }
      >
      </div>
    )
  }

  renderRow(row) {
    const ret = [];
    for (let i = 0; i < this.n; i++) {
      ret.push(this.renderCell(row, i));
    }

    return ret;
  }

  renderGrid() {
    const grid = [];
    for (let i = 0; i < this.m; i++) {
      grid.push(
        <div className='Row' key={ i }>
          { this.renderRow(i) }
        </div>
      )
    }

    return grid;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Grid sample</h1>
        </header>
        <div className="Grid">
          { this.renderGrid() }
        </div>
      </div>
    );
  }
}

export default App;
