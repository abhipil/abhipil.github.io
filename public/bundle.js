(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Life = require("life")

var life = new Life()
life.start()

document.addEventListener("DOMContentLoaded", function(){
    Typed.new("#hi", {
        strings: ["Hi^500, I'm Abhishek"],
        typeSpeed: 100,
        showCursor: false,
        callback: function() {
            $('.header div a')
                .show(1000);
        }
    });
});

},{"life":3}],2:[function(require,module,exports){
var Canvas = function(canvasID, cellSize) {
    var me = this
    var canvas = document.getElementById(canvasID||'life')
    var ctx = canvas.getContext('2d')
    me.width = canvas.width  = window.innerWidth;
    me.height = canvas.height = window.innerHeight;
    me.cellSize = cellSize = cellSize 
                    || Math.floor(Math.max(me.width,me.height)*0.01)

    var universe
    me.set = function(_universe) {
        universe = _universe
    }

    me.draw = function() {
        ctx.fillStyle = 'white'
        shadow = cellSize*0.2
        ctx.fillRect(0, 0, me.width, me.height)
        var live = universe.filter(function(cell) {
            return cell.isAlive()
        })
        // live.forEach(function(cell) {
        //     ctx.fillStyle = 'grey'
        //     ctx.fillRect(cell.getX()*cellSize-shadow,cell.getY()*cellSize-shadow, cellSize+2*shadow, cellSize+2*shadow)
        // })
        live.forEach(function(cell) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
            ctx.fillRect(cell.getX()*cellSize, cell.getY()*cellSize, cellSize, cellSize)
        })
    }
    return me
}

module.exports = Canvas

},{}],3:[function(require,module,exports){
var Universe = require('./universe.js')
var Canvas = require('./canvas.js')
var Parser = require('./parser.js')
var templates = require('./templates.js')

var Life = function(canvasID, initConfig, cellSize) {
    var me = this
    var canvasID = canvasID ? canvasID : ""
    var initConfig = initConfig || templates.random()
    initConfig = (new Parser('lif')).parse(initConfig)

    var interval = 60
    var hasStarted = null
    var _canvas = new Canvas(canvasID,cellSize)
    var universeWidth = Math.floor(_canvas.width/_canvas.cellSize)
    var universeHeight = Math.floor(_canvas.height/_canvas.cellSize)

    var _universe = new Universe(universeWidth, universeHeight)
    _canvas.set(_universe)
    //this.universe = _universe
    initConfig.forEach(function() {
        var randWidth = 45
        var randHeight = 30
        return function(initCell) {
            var cell =_universe.get(randWidth+initCell[0],randHeight+initCell[1])
            if (!cell)
                console.log((randWidth+initCell[0])+' '+(randHeight+initCell[1]))
            cell.reproduce()
        }
    }())

    this.start = function() {
        hasStarted = hasStarted || setInterval(function() {
            _canvas.draw()
            _universe.update()
        }, interval)
    }

    this.clear = function() {
        hasStarted = !hasStarted || clearInterval(hasStarted)
    }
    return this
}

module.exports = Life

},{"./canvas.js":2,"./parser.js":4,"./templates.js":5,"./universe.js":6}],4:[function(require,module,exports){
var Parser = function(fileType) {
    var me = this
    var format, coordDelimiter, cellDelimiter
    if (fileType === 'lif') {
        format = 'Life 1.06'
        commandDelimiter = '#'
        coordDelimiter = ' '
        cellDelimiter = '\n'
    }

    me.parse = function(data) {
        return data.split(cellDelimiter)
            .filter(function(line) {
                return line.length>1 && !line.startsWith(commandDelimiter)
            })
            .map(function(line) {
                return line.split(coordDelimiter)
                            .map(function(coord) {
                                return parseInt(coord.trim(),10)
                            })
            })
    }
}

module.exports = Parser

},{}],5:[function(require,module,exports){
var automaton = {
    gosperglidergun_106 : '#Life 1.06\n6 -4\n4 -3\n6 -3\n-6 -2\n-5 -2\n2 -2\n3 -2\n16 -2\n17 -2\n-7 -1\n-3 -1\n2 -1\n3 -1\n16 -1\n17 -1\n-18 0\n-17 0\n-8 0\n-2 0\n2 0\n3 0\n-18 1\n-17 1\n-8 1\n-4 1\n-2 1\n-1 1\n4 1\n6 1\n-8 2\n-2 2\n6 2\n-7 3\n-3 3\n-6 4\n-5 4',
    vacuumgun_106: '#Life 1.06\n-23 -21\n-22 -21\n2 -21\n3 -21\n-23 -20\n-22 -20\n2 -20\n0 -19\n2 -19\n-9 -18\n-8 -18\n0 -18\n1 -18\n-24 -17\n-23 -17\n-9 -17\n-7 -17\n-24 -16\n-23 -16\n-9 -16\n-7 -16\n-6 -16\n-8 -15\n-7 -15\n-8 -14\n20 -13\n21 -13\n-8 -12\n20 -12\n21 -12\n-8 -11\n-7 -11\n-24 -10\n-23 -10\n-9 -10\n-7 -10\n-6 -10\n8 -10\n12 -10\n-24 -9\n-23 -9\n-9 -9\n-7 -9\n7 -9\n13 -9\n21 -9\n22 -9\n-9 -8\n-8 -8\n7 -8\n21 -8\n22 -8\n7 -7\n8 -7\n12 -7\n-23 -6\n-22 -6\n9 -6\n10 -6\n11 -6\n-23 -5\n-22 -5\n9 -4\n10 -4\n11 -4\n7 -3\n8 -3\n12 -3\n7 -2\n21 -2\n22 -2\n7 -1\n13 -1\n21 -1\n22 -1\n8 0\n12 0\n20 2\n21 2\n20 3\n21 3\n13 8\n14 8\n13 9\n15 9\n23 9\n24 9\n15 10\n23 10\n24 10\n13 11\n14 11\n15 11\n-2 12\n0 12\n-3 13\n-2 13\n-1 13\n-3 14\n-2 14\n-1 14\n-3 15\n13 15\n14 15\n15 15\n1 16\n3 16\n15 16\n-3 17\n-2 17\n3 17\n13 17\n15 17\n-8 18\n-7 18\n-2 18\n2 18\n3 18\n13 18\n14 18\n-9 19\n-7 19\n0 19\n-9 20\n-10 21\n-9 21',

    trueperiod22gun_106: '#Life 1.06\n-4 -10\n-3 -10\n-3 -9\n5 -9\n-3 -8\n-1 -8\n14 -8\n15 -8\n-2 -7\n-1 -7\n12 -7\n13 -7\n16 -7\n2 -6\n3 -6\n4 -6\n12 -6\n13 -6\n15 -6\n16 -6\n2 -5\n3 -5\n5 -5\n6 -5\n14 -5\n15 -5\n16 -5\n2 -4\n5 -4\n6 -4\n19 -4\n20 -4\n3 -3\n4 -3\n19 -3\n21 -3\n13 -2\n21 -2\n21 -1\n22 -1\n-22 1\n-21 1\n3 1\n-21 2\n1 2\n3 2\n-21 3\n-19 3\n-5 3\n-4 3\n-3 3\n2 3\n3 3\n-20 4\n-19 4\n-15 4\n-6 4\n-2 4\n-16 5\n-14 5\n-13 5\n-6 5\n-1 5\n-17 6\n-12 6\n-5 6\n-4 6\n-2 6\n8 6\n-16 7\n-12 7\n-3 7\n1 7\n2 7\n9 7\n-15 8\n-14 8\n-13 8\n1 8\n3 8\n7 8\n8 8\n9 8\n3 9\n3 10\n4 10',
    rpentomino_106: '#Life 1.06\n0 -1\n1 -1\n-1 0\n0 0\n0 1',
}

var gliderHrefs = Object.keys(automaton)

templates = {}
templates.random = function() {
    var rand = gliderHrefs[Math.floor(Math.random()*gliderHrefs.length)]
    return automaton[rand]
}

module.exports = templates

},{}],6:[function(require,module,exports){
var Universe = function(width, height) {
    var me = this

    var grid = new Array(width*height)

    var toroidize = function(x, y) {
        return ((x%width)+width)%width + ((y%height)+height)%height*width
    }

    var createCell = function(x, y) {
        var cell = {}
        var alive = false
        var neighbours = (function() {
            var n = []
            var index = [-1,0,1]
            index.forEach(function(w){
                //if(w+x<0 || w+x>=width) return
                index.forEach(function(h){
                    if(w===0&&h===0) return
                    n.push(toroidize(w+x,y+h))
                })
            })
            return n
        }())

        cell.getX = function() { return x }
        cell.getY = function() { return y }
        cell.isAlive = function() { return alive }
        cell.kill = function() {
            alive = false
        }
        cell.reproduce = function() {
            alive = true
        }
        cell.numNeighbours = function() {
            return neighbours.filter(function(c) {
                return grid[c].isAlive()
            }).length
        }
        return cell
    }

    ;(function(w, h) {
        for(var i = 0; i < w; i++){
            for(var j = 0; j < h; j++){
                ;(function(){
                    grid[i+j*w] = createCell(i,j)
                }())           
            }
        }
    }(width, height))

    me.update = function() {
        var kill=[], revive=[]
        for (var i=0; i<grid.length; i++) {
            var num = grid[i].numNeighbours()
            if (num<2 || num>3) kill.push(grid[i])
            if (num==3) revive.push(grid[i])
        }
        kill.forEach(function(cell) {
            cell.kill()
        })
        revive.forEach(function(cell) {
            cell.reproduce()
        })
        // var killThese = grid.filter(function(cell) {
        //     var num = cell.numNeighbours()
        //     return num<2 || num>3
        // })
        // grid.filter(function(cell) {
        //     return cell.numNeighbours()==3
        // }).forEach(function(cell) {
        //     cell.reproduce()
        // })
        // killThese.forEach(function(cell) {
        //     cell.kill()
        // })
    }
    me.get = function(x, y) {
        return grid[toroidize(x,y)]
    }

    me.filter = function(fn) {
        return grid.filter(fn)
    }

    return me
}

module.exports = Universe

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9saWZlL2xpYi9jYW52YXMuanMiLCJub2RlX21vZHVsZXMvbGlmZS9saWIvbGlmZS5qcyIsIm5vZGVfbW9kdWxlcy9saWZlL2xpYi9wYXJzZXIuanMiLCJub2RlX21vZHVsZXMvbGlmZS9saWIvdGVtcGxhdGVzLmpzIiwibm9kZV9tb2R1bGVzL2xpZmUvbGliL3VuaXZlcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIExpZmUgPSByZXF1aXJlKFwibGlmZVwiKVxuXG52YXIgbGlmZSA9IG5ldyBMaWZlKClcbmxpZmUuc3RhcnQoKVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpe1xuICAgIFR5cGVkLm5ldyhcIiNoaVwiLCB7XG4gICAgICAgIHN0cmluZ3M6IFtcIkhpXjUwMCwgSSdtIEFiaGlzaGVrXCJdLFxuICAgICAgICB0eXBlU3BlZWQ6IDEwMCxcbiAgICAgICAgc2hvd0N1cnNvcjogZmFsc2UsXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5oZWFkZXIgZGl2IGEnKVxuICAgICAgICAgICAgICAgIC5zaG93KDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsInZhciBDYW52YXMgPSBmdW5jdGlvbihjYW52YXNJRCwgY2VsbFNpemUpIHtcbiAgICB2YXIgbWUgPSB0aGlzXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lEfHwnbGlmZScpXG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgbWUud2lkdGggPSBjYW52YXMud2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbWUuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBtZS5jZWxsU2l6ZSA9IGNlbGxTaXplID0gY2VsbFNpemUgXG4gICAgICAgICAgICAgICAgICAgIHx8IE1hdGguZmxvb3IoTWF0aC5tYXgobWUud2lkdGgsbWUuaGVpZ2h0KSowLjAxKVxuXG4gICAgdmFyIHVuaXZlcnNlXG4gICAgbWUuc2V0ID0gZnVuY3Rpb24oX3VuaXZlcnNlKSB7XG4gICAgICAgIHVuaXZlcnNlID0gX3VuaXZlcnNlXG4gICAgfVxuXG4gICAgbWUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICBzaGFkb3cgPSBjZWxsU2l6ZSowLjJcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIG1lLndpZHRoLCBtZS5oZWlnaHQpXG4gICAgICAgIHZhciBsaXZlID0gdW5pdmVyc2UuZmlsdGVyKGZ1bmN0aW9uKGNlbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjZWxsLmlzQWxpdmUoKVxuICAgICAgICB9KVxuICAgICAgICAvLyBsaXZlLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAvLyAgICAgY3R4LmZpbGxTdHlsZSA9ICdncmV5J1xuICAgICAgICAvLyAgICAgY3R4LmZpbGxSZWN0KGNlbGwuZ2V0WCgpKmNlbGxTaXplLXNoYWRvdyxjZWxsLmdldFkoKSpjZWxsU2l6ZS1zaGFkb3csIGNlbGxTaXplKzIqc2hhZG93LCBjZWxsU2l6ZSsyKnNoYWRvdylcbiAgICAgICAgLy8gfSlcbiAgICAgICAgbGl2ZS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjE1KSdcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChjZWxsLmdldFgoKSpjZWxsU2l6ZSwgY2VsbC5nZXRZKCkqY2VsbFNpemUsIGNlbGxTaXplLCBjZWxsU2l6ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIG1lXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzXG4iLCJ2YXIgVW5pdmVyc2UgPSByZXF1aXJlKCcuL3VuaXZlcnNlLmpzJylcbnZhciBDYW52YXMgPSByZXF1aXJlKCcuL2NhbnZhcy5qcycpXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXIuanMnKVxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJylcblxudmFyIExpZmUgPSBmdW5jdGlvbihjYW52YXNJRCwgaW5pdENvbmZpZywgY2VsbFNpemUpIHtcbiAgICB2YXIgbWUgPSB0aGlzXG4gICAgdmFyIGNhbnZhc0lEID0gY2FudmFzSUQgPyBjYW52YXNJRCA6IFwiXCJcbiAgICB2YXIgaW5pdENvbmZpZyA9IGluaXRDb25maWcgfHwgdGVtcGxhdGVzLnJhbmRvbSgpXG4gICAgaW5pdENvbmZpZyA9IChuZXcgUGFyc2VyKCdsaWYnKSkucGFyc2UoaW5pdENvbmZpZylcblxuICAgIHZhciBpbnRlcnZhbCA9IDYwXG4gICAgdmFyIGhhc1N0YXJ0ZWQgPSBudWxsXG4gICAgdmFyIF9jYW52YXMgPSBuZXcgQ2FudmFzKGNhbnZhc0lELGNlbGxTaXplKVxuICAgIHZhciB1bml2ZXJzZVdpZHRoID0gTWF0aC5mbG9vcihfY2FudmFzLndpZHRoL19jYW52YXMuY2VsbFNpemUpXG4gICAgdmFyIHVuaXZlcnNlSGVpZ2h0ID0gTWF0aC5mbG9vcihfY2FudmFzLmhlaWdodC9fY2FudmFzLmNlbGxTaXplKVxuXG4gICAgdmFyIF91bml2ZXJzZSA9IG5ldyBVbml2ZXJzZSh1bml2ZXJzZVdpZHRoLCB1bml2ZXJzZUhlaWdodClcbiAgICBfY2FudmFzLnNldChfdW5pdmVyc2UpXG4gICAgLy90aGlzLnVuaXZlcnNlID0gX3VuaXZlcnNlXG4gICAgaW5pdENvbmZpZy5mb3JFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmFuZFdpZHRoID0gNDVcbiAgICAgICAgdmFyIHJhbmRIZWlnaHQgPSAzMFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5pdENlbGwpIHtcbiAgICAgICAgICAgIHZhciBjZWxsID1fdW5pdmVyc2UuZ2V0KHJhbmRXaWR0aCtpbml0Q2VsbFswXSxyYW5kSGVpZ2h0K2luaXRDZWxsWzFdKVxuICAgICAgICAgICAgaWYgKCFjZWxsKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKChyYW5kV2lkdGgraW5pdENlbGxbMF0pKycgJysocmFuZEhlaWdodCtpbml0Q2VsbFsxXSkpXG4gICAgICAgICAgICBjZWxsLnJlcHJvZHVjZSgpXG4gICAgICAgIH1cbiAgICB9KCkpXG5cbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhc1N0YXJ0ZWQgPSBoYXNTdGFydGVkIHx8IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2NhbnZhcy5kcmF3KClcbiAgICAgICAgICAgIF91bml2ZXJzZS51cGRhdGUoKVxuICAgICAgICB9LCBpbnRlcnZhbClcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhc1N0YXJ0ZWQgPSAhaGFzU3RhcnRlZCB8fCBjbGVhckludGVydmFsKGhhc1N0YXJ0ZWQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGlmZVxuIiwidmFyIFBhcnNlciA9IGZ1bmN0aW9uKGZpbGVUeXBlKSB7XG4gICAgdmFyIG1lID0gdGhpc1xuICAgIHZhciBmb3JtYXQsIGNvb3JkRGVsaW1pdGVyLCBjZWxsRGVsaW1pdGVyXG4gICAgaWYgKGZpbGVUeXBlID09PSAnbGlmJykge1xuICAgICAgICBmb3JtYXQgPSAnTGlmZSAxLjA2J1xuICAgICAgICBjb21tYW5kRGVsaW1pdGVyID0gJyMnXG4gICAgICAgIGNvb3JkRGVsaW1pdGVyID0gJyAnXG4gICAgICAgIGNlbGxEZWxpbWl0ZXIgPSAnXFxuJ1xuICAgIH1cblxuICAgIG1lLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5zcGxpdChjZWxsRGVsaW1pdGVyKVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmUubGVuZ3RoPjEgJiYgIWxpbmUuc3RhcnRzV2l0aChjb21tYW5kRGVsaW1pdGVyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lLnNwbGl0KGNvb3JkRGVsaW1pdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvb3JkLnRyaW0oKSwxMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyXG4iLCJ2YXIgYXV0b21hdG9uID0ge1xuICAgIGdvc3BlcmdsaWRlcmd1bl8xMDYgOiAnI0xpZmUgMS4wNlxcbjYgLTRcXG40IC0zXFxuNiAtM1xcbi02IC0yXFxuLTUgLTJcXG4yIC0yXFxuMyAtMlxcbjE2IC0yXFxuMTcgLTJcXG4tNyAtMVxcbi0zIC0xXFxuMiAtMVxcbjMgLTFcXG4xNiAtMVxcbjE3IC0xXFxuLTE4IDBcXG4tMTcgMFxcbi04IDBcXG4tMiAwXFxuMiAwXFxuMyAwXFxuLTE4IDFcXG4tMTcgMVxcbi04IDFcXG4tNCAxXFxuLTIgMVxcbi0xIDFcXG40IDFcXG42IDFcXG4tOCAyXFxuLTIgMlxcbjYgMlxcbi03IDNcXG4tMyAzXFxuLTYgNFxcbi01IDQnLFxuICAgIHZhY3V1bWd1bl8xMDY6ICcjTGlmZSAxLjA2XFxuLTIzIC0yMVxcbi0yMiAtMjFcXG4yIC0yMVxcbjMgLTIxXFxuLTIzIC0yMFxcbi0yMiAtMjBcXG4yIC0yMFxcbjAgLTE5XFxuMiAtMTlcXG4tOSAtMThcXG4tOCAtMThcXG4wIC0xOFxcbjEgLTE4XFxuLTI0IC0xN1xcbi0yMyAtMTdcXG4tOSAtMTdcXG4tNyAtMTdcXG4tMjQgLTE2XFxuLTIzIC0xNlxcbi05IC0xNlxcbi03IC0xNlxcbi02IC0xNlxcbi04IC0xNVxcbi03IC0xNVxcbi04IC0xNFxcbjIwIC0xM1xcbjIxIC0xM1xcbi04IC0xMlxcbjIwIC0xMlxcbjIxIC0xMlxcbi04IC0xMVxcbi03IC0xMVxcbi0yNCAtMTBcXG4tMjMgLTEwXFxuLTkgLTEwXFxuLTcgLTEwXFxuLTYgLTEwXFxuOCAtMTBcXG4xMiAtMTBcXG4tMjQgLTlcXG4tMjMgLTlcXG4tOSAtOVxcbi03IC05XFxuNyAtOVxcbjEzIC05XFxuMjEgLTlcXG4yMiAtOVxcbi05IC04XFxuLTggLThcXG43IC04XFxuMjEgLThcXG4yMiAtOFxcbjcgLTdcXG44IC03XFxuMTIgLTdcXG4tMjMgLTZcXG4tMjIgLTZcXG45IC02XFxuMTAgLTZcXG4xMSAtNlxcbi0yMyAtNVxcbi0yMiAtNVxcbjkgLTRcXG4xMCAtNFxcbjExIC00XFxuNyAtM1xcbjggLTNcXG4xMiAtM1xcbjcgLTJcXG4yMSAtMlxcbjIyIC0yXFxuNyAtMVxcbjEzIC0xXFxuMjEgLTFcXG4yMiAtMVxcbjggMFxcbjEyIDBcXG4yMCAyXFxuMjEgMlxcbjIwIDNcXG4yMSAzXFxuMTMgOFxcbjE0IDhcXG4xMyA5XFxuMTUgOVxcbjIzIDlcXG4yNCA5XFxuMTUgMTBcXG4yMyAxMFxcbjI0IDEwXFxuMTMgMTFcXG4xNCAxMVxcbjE1IDExXFxuLTIgMTJcXG4wIDEyXFxuLTMgMTNcXG4tMiAxM1xcbi0xIDEzXFxuLTMgMTRcXG4tMiAxNFxcbi0xIDE0XFxuLTMgMTVcXG4xMyAxNVxcbjE0IDE1XFxuMTUgMTVcXG4xIDE2XFxuMyAxNlxcbjE1IDE2XFxuLTMgMTdcXG4tMiAxN1xcbjMgMTdcXG4xMyAxN1xcbjE1IDE3XFxuLTggMThcXG4tNyAxOFxcbi0yIDE4XFxuMiAxOFxcbjMgMThcXG4xMyAxOFxcbjE0IDE4XFxuLTkgMTlcXG4tNyAxOVxcbjAgMTlcXG4tOSAyMFxcbi0xMCAyMVxcbi05IDIxJyxcblxuICAgIHRydWVwZXJpb2QyMmd1bl8xMDY6ICcjTGlmZSAxLjA2XFxuLTQgLTEwXFxuLTMgLTEwXFxuLTMgLTlcXG41IC05XFxuLTMgLThcXG4tMSAtOFxcbjE0IC04XFxuMTUgLThcXG4tMiAtN1xcbi0xIC03XFxuMTIgLTdcXG4xMyAtN1xcbjE2IC03XFxuMiAtNlxcbjMgLTZcXG40IC02XFxuMTIgLTZcXG4xMyAtNlxcbjE1IC02XFxuMTYgLTZcXG4yIC01XFxuMyAtNVxcbjUgLTVcXG42IC01XFxuMTQgLTVcXG4xNSAtNVxcbjE2IC01XFxuMiAtNFxcbjUgLTRcXG42IC00XFxuMTkgLTRcXG4yMCAtNFxcbjMgLTNcXG40IC0zXFxuMTkgLTNcXG4yMSAtM1xcbjEzIC0yXFxuMjEgLTJcXG4yMSAtMVxcbjIyIC0xXFxuLTIyIDFcXG4tMjEgMVxcbjMgMVxcbi0yMSAyXFxuMSAyXFxuMyAyXFxuLTIxIDNcXG4tMTkgM1xcbi01IDNcXG4tNCAzXFxuLTMgM1xcbjIgM1xcbjMgM1xcbi0yMCA0XFxuLTE5IDRcXG4tMTUgNFxcbi02IDRcXG4tMiA0XFxuLTE2IDVcXG4tMTQgNVxcbi0xMyA1XFxuLTYgNVxcbi0xIDVcXG4tMTcgNlxcbi0xMiA2XFxuLTUgNlxcbi00IDZcXG4tMiA2XFxuOCA2XFxuLTE2IDdcXG4tMTIgN1xcbi0zIDdcXG4xIDdcXG4yIDdcXG45IDdcXG4tMTUgOFxcbi0xNCA4XFxuLTEzIDhcXG4xIDhcXG4zIDhcXG43IDhcXG44IDhcXG45IDhcXG4zIDlcXG4zIDEwXFxuNCAxMCcsXG4gICAgcnBlbnRvbWlub18xMDY6ICcjTGlmZSAxLjA2XFxuMCAtMVxcbjEgLTFcXG4tMSAwXFxuMCAwXFxuMCAxJyxcbn1cblxudmFyIGdsaWRlckhyZWZzID0gT2JqZWN0LmtleXMoYXV0b21hdG9uKVxuXG50ZW1wbGF0ZXMgPSB7fVxudGVtcGxhdGVzLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5kID0gZ2xpZGVySHJlZnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmdsaWRlckhyZWZzLmxlbmd0aCldXG4gICAgcmV0dXJuIGF1dG9tYXRvbltyYW5kXVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlc1xuIiwidmFyIFVuaXZlcnNlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIHZhciBtZSA9IHRoaXNcblxuICAgIHZhciBncmlkID0gbmV3IEFycmF5KHdpZHRoKmhlaWdodClcblxuICAgIHZhciB0b3JvaWRpemUgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHJldHVybiAoKHgld2lkdGgpK3dpZHRoKSV3aWR0aCArICgoeSVoZWlnaHQpK2hlaWdodCklaGVpZ2h0KndpZHRoXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZUNlbGwgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHZhciBjZWxsID0ge31cbiAgICAgICAgdmFyIGFsaXZlID0gZmFsc2VcbiAgICAgICAgdmFyIG5laWdoYm91cnMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbiA9IFtdXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBbLTEsMCwxXVxuICAgICAgICAgICAgaW5kZXguZm9yRWFjaChmdW5jdGlvbih3KXtcbiAgICAgICAgICAgICAgICAvL2lmKHcreDwwIHx8IHcreD49d2lkdGgpIHJldHVyblxuICAgICAgICAgICAgICAgIGluZGV4LmZvckVhY2goZnVuY3Rpb24oaCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHc9PT0wJiZoPT09MCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIG4ucHVzaCh0b3JvaWRpemUodyt4LHkraCkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gblxuICAgICAgICB9KCkpXG5cbiAgICAgICAgY2VsbC5nZXRYID0gZnVuY3Rpb24oKSB7IHJldHVybiB4IH1cbiAgICAgICAgY2VsbC5nZXRZID0gZnVuY3Rpb24oKSB7IHJldHVybiB5IH1cbiAgICAgICAgY2VsbC5pc0FsaXZlID0gZnVuY3Rpb24oKSB7IHJldHVybiBhbGl2ZSB9XG4gICAgICAgIGNlbGwua2lsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWxpdmUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGNlbGwucmVwcm9kdWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhbGl2ZSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBjZWxsLm51bU5laWdoYm91cnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBuZWlnaGJvdXJzLmZpbHRlcihmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdyaWRbY10uaXNBbGl2ZSgpXG4gICAgICAgICAgICB9KS5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbFxuICAgIH1cblxuICAgIDsoZnVuY3Rpb24odywgaCkge1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdzsgaSsrKXtcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBoOyBqKyspe1xuICAgICAgICAgICAgICAgIDsoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFtpK2oqd10gPSBjcmVhdGVDZWxsKGksailcbiAgICAgICAgICAgICAgICB9KCkpICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0od2lkdGgsIGhlaWdodCkpXG5cbiAgICBtZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGtpbGw9W10sIHJldml2ZT1bXVxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8Z3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG51bSA9IGdyaWRbaV0ubnVtTmVpZ2hib3VycygpXG4gICAgICAgICAgICBpZiAobnVtPDIgfHwgbnVtPjMpIGtpbGwucHVzaChncmlkW2ldKVxuICAgICAgICAgICAgaWYgKG51bT09MykgcmV2aXZlLnB1c2goZ3JpZFtpXSlcbiAgICAgICAgfVxuICAgICAgICBraWxsLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAgICAgY2VsbC5raWxsKClcbiAgICAgICAgfSlcbiAgICAgICAgcmV2aXZlLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAgICAgY2VsbC5yZXByb2R1Y2UoKVxuICAgICAgICB9KVxuICAgICAgICAvLyB2YXIga2lsbFRoZXNlID0gZ3JpZC5maWx0ZXIoZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAvLyAgICAgdmFyIG51bSA9IGNlbGwubnVtTmVpZ2hib3VycygpXG4gICAgICAgIC8vICAgICByZXR1cm4gbnVtPDIgfHwgbnVtPjNcbiAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gZ3JpZC5maWx0ZXIoZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGNlbGwubnVtTmVpZ2hib3VycygpPT0zXG4gICAgICAgIC8vIH0pLmZvckVhY2goZnVuY3Rpb24oY2VsbCkge1xuICAgICAgICAvLyAgICAgY2VsbC5yZXByb2R1Y2UoKVxuICAgICAgICAvLyB9KVxuICAgICAgICAvLyBraWxsVGhlc2UuZm9yRWFjaChmdW5jdGlvbihjZWxsKSB7XG4gICAgICAgIC8vICAgICBjZWxsLmtpbGwoKVxuICAgICAgICAvLyB9KVxuICAgIH1cbiAgICBtZS5nZXQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHJldHVybiBncmlkW3Rvcm9pZGl6ZSh4LHkpXVxuICAgIH1cblxuICAgIG1lLmZpbHRlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIHJldHVybiBncmlkLmZpbHRlcihmbilcbiAgICB9XG5cbiAgICByZXR1cm4gbWVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVbml2ZXJzZVxuIl19
