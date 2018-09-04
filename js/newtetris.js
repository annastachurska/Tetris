document.addEventListener("DOMContentLoaded", function(){
    console.log("działa");

    let Game = function() {
        this.board = document.querySelectorAll("#tetris div"),
        this.width = 20,
        this.height = this.board.length / this.width,
        this.time = 250,
        this.points = 0,

        this.matrix = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],

        this.index = function(x, y) {
            return x + (y * this.width);
        },

        this.elementTable = [
            [[[1],[1],[1],[1]],[[1,1,1,1]]],
            [[[1,1],[1,1]],[[1,1],[1,1]]],
            [[[1,0],[1,1], [1,0]], [[1,1,1],[0,1,0]]],
            [[[0,1,0], [1,1,1], [0,1,0]], [[0,1,0], [1,1,1], [0,1,0]]],
            [[[0,1,1], [1,1,0]], [[1,0], [1,1], [0,1]]],
            [[[1,1,0], [0,1,1]], [[0,1], [1,1], [1,0]]],
            [[[1,0,0],[1,1,1]],[[1,1], [1,0], [1,0]]],
            [[[0,0,1],[1,1,1]],[[1,1], [0,1], [0,1]]],
        ],

        this.findRandomElement = function() {
            let number = Math.floor(Math.random()*2);
            this.rotated = this.elementTable[number][1];
            this.normal = this.elementTable[number][0];
            return this.elementTable[number];
        },

        this.line = {
            element: this.findRandomElement()[0],
            positionX: 10,
            positionY: 0,
        },

        this.changeDirection = function(event) {
            switch(event.which) {
                case 37:
                    if (this.line.positionX >= 1) {
                        this.hideElement();
                        this.line.positionX -= 1;
                        this.showElement();
                    }
                    break;

                case 39:
                    if (this.line.positionX <(20 - this.line.element[0].length)) {
                        this.hideElement();
                        this.line.positionX += 1;
                        this.showElement();
                    }
                    break;

                case 38:
                    if (this.line.positionX <=(this.width - this.line.element.length)) {
                        this.hideElement();
                        this.line.element = this.line.element == this.rotated ? this.normal : this.rotated;
                        this.showElement();
                    }
                    break;

                case 40:
                    clearInterval(this.idSetInterval);
                    // console.log("działa");
                    this.time = 50;
                    break;
            }
        },

        this.showElement = function(){
            for (let i=0; i<this.line.element.length; i++) {
                for( let j=0; j < this.line.element[i].length; j++) {
                    if (this.line.element[i][j] == 1) {
                        let element = this.index(j+this.line.positionX, i+this.line.positionY);
                        this.board[element].style.backgroundColor = 'black';
                        // this.matrix[i+this.line.positionY][j+this.line.positionX] = 1;
                        // console.log(this.matrix);
                    }
                }
            }
        },

         this.addElementToMatrix = function(){
            for (let i=0; i<this.line.element.length; i++) {
                for( let j=0; j < this.line.element[i].length; j++) {
                    if (this.line.element[i][j] == 1) {
                        this.matrix[i+this.line.positionY][j+this.line.positionX] = 1;
                    }
                }
            }
        },

        this.hideElement = function(){
            for (let i=0; i<this.line.element.length; i++) {
                for( let j=0; j < this.line.element[i].length; j++) {
                    if (this.line.element[i][j] == 1) {
                        let element = this.index(j+this.line.positionX, i+this.line.positionY);
                        this.board[element].style.backgroundColor = 'white';
                        // this.matrix[i+this.line.positionY][j+this.line.positionX] = 0;
                    }
                }
            }
        },

        this.moveElement = function() {
            // MUSZE DAC JAKO PIERWSZY KROK W STARCIE SHOW ELEMENT
            if (((this.line.positionY+1) <= this.height-this.line.element.length) &&(!(this.checkCollisionWithMatrix()))) {
                this.hideElement();
                this.line.positionY += 1;
                this.showElement();
            } else {
                this.addElementToMatrix();
                this.removeCompleteRows();
                // clearInterval(this.idSetInterval);
                this.line.positionY = 0;
                this.line.positionX = 10;
                this.line.element = this.findRandomElement()[0];
                this.showElement();

            }

        },

        this.checkSideCollision = function(){

        },

        this.checkCollisionWithMatrix = function(){
            for (let j=this.line.element.length-1; j>=0; j--) {
                for (let i=0; i<this.line.element[0].length; i++) {
                    if ((this.line.element[j][i] ==1)&&(this.matrix[this.line.positionY+j+1][this.line.positionX + i] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        },

        this.removeCompleteRows = function(){
            let shouldRepeat = true;
            while (shouldRepeat) {
                shouldRepeat = false;
                const newMatrix =[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
                for (let i=this.matrix.length-1; i>=0; i--){
                    let sum = this.matrix[i].reduce((prev, next) => {return prev + next});
                    if (sum == this.matrix[i].length) {
                        shouldRepeat = true;
                        this.points++;
                        for (let j=0; j < this.matrix.length; j++) {
                            if ((j<i) || (j>i)) {
                                newMatrix.push(this.matrix[j]);
                            }
                        }
                        this.matrix = newMatrix;
                        this.colorBoard();

                    }
                }
            }
        },






        this.colorBoard = function() {
            for (let i=0; i < this.height; i++) {
                for (let j=0; j < this.width; j++) {
                    let element = this.index(j,i);
                    if (this.matrix[i][j] == 1) {
                        // console.log(this.matrix[i][j]);
                        this.board[element].style.backgroundColor = 'black';
                    } else {
                        this.board[element].style.backgroundColor = 'white';
                    }
                }

            }
        },

        this.startGame = function() {
            this.colorBoard();
            var self = this;
            this.idSetInterval = setInterval(function() {
                self.moveElement();
            }, this.time);
        },

        this.finishGame = function() {
            clearInterval(this.idSetInterval);
            console.log('koniec gry');
        }
    }

    let game = new Game();
    game.startGame();

    document.addEventListener('keydown', function(event){
        game.changeDirection(event);
    });

});