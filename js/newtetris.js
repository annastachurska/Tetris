document.addEventListener("DOMContentLoaded", function(){
    console.log("działa");


    let Game = function(setWidth, setHeight) {
        this.boardContainer = document.querySelector('section#tetris'),
        this.width = Number(setWidth),
        this.height = Number(setHeight),

        this.createBoard = function() {
            this.boardContainer.style.width = String(this.width * 20) + "px";
            this.boardContainer.style.height = String(this.height * 20) + "px";
            var numberOfElements = this.width * this.height;
            for (var i=0; i < numberOfElements; i++) {
                var newDiv = document.createElement("div");
                this.boardContainer.appendChild(newDiv);
            }
            this.board = document.querySelectorAll("#tetris div");
        },

        this.time = 250,
        this.points = 0,
        this.wand = {
            timesToUse: 10,
            element: document.querySelector('.wand .result'),
            // self: this,
            handleClick: function(){
                console.log("klik");
                this.timesToUse--;
                console.log(this.timesToUse);
            },
        },

        this.createMatrix = function() {
            let newMatrix = [];
            for (let i=0; i<this.height; i++) {
                let newMatrixRaw =[];
                newMatrixRaw = Array(...Array(this.width)).map(() => 0);
                newMatrix.push(newMatrixRaw);
            }
            this.matrix = newMatrix;
        },

        // this.matrix = [
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        // ],

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
            let number = Math.floor(Math.random()*7);
            this.rotated = this.elementTable[number][1];
            this.normal = this.elementTable[number][0];
            return this.elementTable[number];
        },

        this.line = {
            element: this.findRandomElement()[0],
            positionX: Math.floor(this.width/2),
            positionY: 0,
        },

        this.changeDirection = function(event) {
            switch(event.which) {
                case 37:
                    if ((this.line.positionX >= 1) && (!this.checkLeftCollision())) {
                        this.hideElement();
                        this.line.positionX -= 1;
                        this.showElement();
                    }
                    break;

                case 39:
                    if ((this.line.positionX <(this.width - this.line.element[0].length)) && (!this.checkRightCollision())) {
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
                this.line.positionX = Math.floor(this.width/2);
                this.line.element = this.findRandomElement()[0];
                this.showElement();

            }

        },

        this.checkLeftCollision = function(){
            for (let j=this.line.element.length-1; j>=0; j--) {
                for (let i=0; i<this.line.element[j].length; i++) {
                    if ((this.line.element[j][i] ==1)&&(this.matrix[this.line.positionY+j][this.line.positionX + i-1] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        },

        this.checkRightCollision = function(){
            for (let j=this.line.element.length-1; j>=0; j--) {
                for (let i=0; i<this.line.element[j].length; i++) {
                    if ((this.line.element[j][i] ==1)&&(this.matrix[this.line.positionY+j][this.line.positionX + i+1] ==1)) {
                        return true;
                    }
                }
            }
            return false;
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
                let newMatrix =[];
                newMatrix.push(Array(...Array(this.width)).map(() => 0));

                // const newMatrix = Array(this.width).fill(0);
                // Array(...Array(10)).map(() => 5);
                // const newMatrix =[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
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
                        // console.log(newMatrix);
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
            this.createBoard();
            this.createMatrix();
            this.colorBoard();
            var self = this;
            this.idSetInterval = setInterval(function() {
                self.moveElement();
            }, this.time);
        },

        this.finishGame = function() {
            clearInterval(this.idSetInterval);
            let finalDiv = document.querySelector('.finishedGame');
            finalDiv.style.display = 'block';
            console.log('koniec gry');
        }
    }

    document.querySelector('.start_button').addEventListener('click', () => {
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.introduction').style.display = 'block';
    });


    document.querySelector('.introduction_button').addEventListener('click', () => {
        document.querySelector('.introduction').style.display = 'none';
        document.querySelector('.tetrisContainer').style.display = 'block';
    });


    //
    // let userWidth = prompt('Podaj szerokość','10-20');
    // let userHeight = prompt('Podaj wysokość', '10-20');

    let game = new Game(userWidth, userHeight);
    game.startGame();
    // console.log(game.board);
    // console.log(game.matrix);

    document.addEventListener('keydown', function(event){
        game.changeDirection(event);
    });

    document.querySelector(".wand").addEventListener('click', function(){
        game.wand.handleClick();

    });

});