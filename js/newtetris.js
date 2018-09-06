document.addEventListener("DOMContentLoaded", function(){
    console.log("działa");


    let Game = function(setWidth, setHeight) {
        this.boardContainer = document.querySelector('section#tetris'),
        this.width = Number(setWidth),
        this.height = Number(setHeight),
        this.timer = 250,

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

        this.index = function(x, y) {
            return x + (y * this.width);
        },

        this.elementTable = [
            [[1],[1],[1],[1]],
            [[1,1],[1,1]],
            [[1,0],[1,1], [1,0]],
            [[0,1,0], [1,1,1], [0,1,0]],
            [[0,1,1], [1,1,0]],
            [[1,1,0], [0,1,1]],
            [[1,0,0],[1,1,1]],
            [[0,0,1],[1,1,1]]
        ],

        this.findRandomElement = function() {
            let number = Math.floor(Math.random()*8);
            return this.elementTable[number];
        },

        this.line = {
            element: this.findRandomElement(),
            positionX: Math.floor(this.width/2),
            positionY: 0,
        },

        this.rotateElement = function(){
            // console.log(this.line.element);
            let rotatedElement = [];
            for (let i=0; i<this.line.element[0].length; i++){
                let rotatedElementLine = [];
                for (let j=this.line.element.length-1; j>=0; j--){
                    rotatedElementLine.push(this.line.element[j][i]);
                }
                rotatedElement.push(rotatedElementLine);
                // console.log(rotatedElementLine);
            }
            // console.log(rotatedElement);
            this.line.element = rotatedElement;
            // console.log(this.line.element);
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
                    if ((this.line.positionX <=(this.width - this.line.element.length)) && (this.line.positionY <=(this.height - this.line.element[0].length))) {
                        this.hideElement();
                        this.rotateElement();
                        this.showElement();
                    }
                    break;

                case 40:
                    clearInterval(this.idSetInterval);
                    var self = this;
                    this.changeInt(50);
                    // if (this.line.positionY == 0) {
                    //     clearInterval(this.idSetInterval);
                    //     this.changeInt(250);
                    // }
                    // console.log("działa");
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
                if (this.line.positionY == 0) {
                    this.finishGame();
                }
                this.addElementToMatrix();
                this.removeCompleteRows();
                this.line.positionY = 0;
                this.line.positionX = Math.floor(this.width/2);
                this.line.element = this.findRandomElement();
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

                for (let i=this.matrix.length-1; i>=0; i--){
                    let sum = this.matrix[i].reduce((prev, next) => {return prev + next});
                    if (sum == this.matrix[i].length) {
                        shouldRepeat = true;
                        this.points++;
                        document.querySelector('.tetris_points').innerText = "Points: " + this.points;
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
            this.createBoard();
            this.createMatrix();
            this.colorBoard();
            this.changeInt(250);
        },

        this.changeInt = function (val){
            let self = this;
            this.idSetInterval = setInterval(function() {
                self.moveElement();
                if (self.line.positionY ==0) {
                    clearInterval(self.idSetInterval);
                    self.changeInt(250);
                }
            }, val );
        },

        this.finishGame = function() {
            clearInterval(this.idSetInterval);
            let finalDiv = document.querySelector('.finishedGame');
            document.querySelector('.tetrisContainer').style.display = 'none';
            finalDiv.style.display = 'block';
            if (this.points == 0) {
                document.querySelector('.finishedGame_points').innerText = "Ohh no... You haven't scored any points.";
                document.querySelector('.finishedGame_text').innerText = 'Here is your consolation prize.';
            } else {
                document.querySelector('.finishedGame_points').innerText = "You have scored " + this.points + " points.";
                document.querySelector('.finishedGame_text').innerText = "Here is your reward.";
            }
            document.querySelector('.finishedGame_joke').innerText = dataJoke;
        }
    }


    document.querySelector('.start_button').addEventListener('click', () => {
        document.querySelector('.start').style.display = 'none';
        document.querySelector('.introduction').style.display = 'block';
    });

    let isInappropriate = true;
    let countChuck = 0;
    let dataWhole = null;
    let dataJoke = null;
    let uglyWords = ['cock', 'fuck', 'dick', 'vagina', 'condom', 'rape', 'nipples', 'gay'];
    const jokesTable = ["Chuck Norris brushes his teeth with a machine gun and flosses with a lightsaber.",
        "The only mistake that Chuck Norris has committed was when he thought he did a mistake.",
        "Chuck Norris didn't audition for walker texas ranger he made da producers audition to film his life."
    ];


    while(isInappropriate) {
        isInappropriate = false;
        countChuck++;
        fetch('https://api.chucknorris.io/jokes/random')
            .then(resp => resp.json())
            .then(data => {
                // console.log('mam dane');
                dataWhole = data;
                dataJoke = data.value;
                console.log(dataWhole);
                console.log(dataJoke);
                console.log(dataJoke.indexOf('Chuck'));

                uglyWords.forEach(element => {
                    if (dataJoke.indexOf(element) !== -1) {
                        console.log('losuj jeszzce raz');
                        isInappropriate = true;

                    }
                });
            })
            .catch(err => {
                console.log(err);
                let randomNumber = Math.floor(Math.random()*3);
                dataJoke = jokesTable[randomNumber];
                // console.log(randomNumber);
                isInappropriate = true;
            });
        if(countChuck > 10) {
            let randomNumber = Math.floor(Math.random()*3);
            dataJoke = jokesTable[randomNumber];
            isInappropriate = true;
        }
    }




    document.querySelector('.introduction_button').addEventListener('click', (element) => {
        let newWidth = document.querySelector('.introduction_input[name="width"]').value;
        let newHeight = document.querySelector('.introduction_input[name="height"]').value;
        if ((newWidth >=10 && newWidth <=20) && (newHeight >=10 && newHeight <=20) ){
            userHeight = Number(newHeight);
            userWidth = Number(newWidth);

            document.querySelector('.introduction').style.display = 'none';
            document.querySelector('.tetrisContainer').style.display = 'block';

            let game = new Game(userWidth, userHeight);
            game.startGame();

            document.addEventListener('keydown', function(event){
                game.changeDirection(event);
            });

            document.querySelector(".wand").addEventListener('click', function(){
                game.wand.handleClick();
            });

        } else {
            document.querySelector('.introduction_message').innerText = 'Please choose numbers between 10-20';
        }

    });


});