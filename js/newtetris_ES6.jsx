

document.addEventListener("DOMContentLoaded", function(){
    console.log("działa");

    class Game {
        constructor(setWidth, setHeight){
            this.boardContainer = document.querySelector('section#tetris');
            this.width = setWidth;
            this.height = setHeight;
            this.points = 0;
            this.elementTable = [
                [[1],[1],[1],[1]],
                [[1,1],[1,1]],
                [[1,0],[1,1], [1,0]],
                [[0,1,0], [1,1,1], [0,1,0]],
                [[0,1,1], [1,1,0]],
                [[1,1,0], [0,1,1]],
                [[1,0,0],[1,1,1]],
                [[0,0,1],[1,1,1]]
            ];
            this.positionX = Math.floor(Number(setWidth/2));
            this.positionY = 0;
            this.element = null;
            this.isSwitchedSideKeys = false;
            this.isWandClicked = false;
            this.isSlowedDown = false;
            this.isElementUpsideDown = false;
            this.wandTimesToUse = 4;



        }
        createBoard() {
            this.boardContainer.style.width = String(this.width * 20) + "px";
            this.boardContainer.style.height = String(this.height * 20) + "px";
            const numberOfElements = this.width * this.height;
            for (let i=0; i < numberOfElements; i++) {
                let newDiv = document.createElement("div");
                this.boardContainer.appendChild(newDiv);
            }
            this.board = document.querySelectorAll("#tetris div");
        }

        createMatrix() {
            const newMatrix = [];
            for (let i=0; i<this.height; i++) {
                let newMatrixRaw = new Array(this.width).fill('0');
                //let newMatrixRaw = Array(...Array(this.width)).map(() => 0);
                newMatrix.push(newMatrixRaw);
            }
            this.matrix = newMatrix;
        }
        /*
        jhgjhgjh
        params: x- hghg
                y - iiuih
        return: iuiuiu
         */
        index(x, y) {
            return x + (y * this.width);
        }

        findRandomElement() {
            let number = Math.floor(Math.random()*8);
            return this.elementTable[number];
        }
        setStartingElement() {
            this.element = this.findRandomElement();
        }

        rotateElement(){
            const rotatedElement = [];
            for (let i=0; i<this.element[0].length; i++){
                let rotatedElementLine = [];
                for (let j=this.element.length-1; j>=0; j--){
                    rotatedElementLine.push(this.element[j][i]);
                }
                rotatedElement.push(rotatedElementLine);
            }
            return rotatedElement;
        }


        changeDirection(event) {
            switch(event.which) {
                case 37:
                    if ((this.positionX >= 1) && (!this.checkLeftCollision())) {
                        this.hideElement();
                        this.positionX -= 1;
                        this.showElement();
                    }
                    break;

                case 39:
                    if ((this.positionX <(this.width - this.element[0].length)) && (!this.checkRightCollision())) {
                        this.hideElement();
                        this.positionX += 1;
                        this.showElement();
                    }
                    break;

                case 38:
                    if ((this.positionX <=(this.width - this.element.length)) && (this.positionY <=(this.height - this.element[0].length)) && (!this.checkRotatedCollision())) {
                        this.hideElement();
                        this.element = this.rotateElement();
                        this.showElement();
                    }
                    break;

                case 40:
                    clearInterval(this.idSetInterval);
                    const self = this;
                    this.changeInt(50);
                    break;
            }
        }

        changeDirectionOpposite(event) {
            switch(event.which) {
                case 39:
                    if ((this.positionX >= 1) && (!this.checkLeftCollision())) {
                        this.hideElement();
                        this.positionX -= 1;
                        this.showElement();
                    }
                    break;

                case 37:
                    if ((this.positionX <(this.width - this.element[0].length)) && (!this.checkRightCollision())) {
                        this.hideElement();
                        this.positionX += 1;
                        this.showElement();
                    }
                    break;

                case 40:
                    if ((this.positionX <=(this.width - this.element.length)) && (this.positionY <=(this.height - this.element[0].length)) && (!this.checkRotatedCollision())) {
                        this.hideElement();
                        this.element = this.rotateElement();
                        this.showElement();
                    }
                    break;

                case 38:
                    clearInterval(this.idSetInterval);
                    const self = this;
                    this.changeInt(50);
                    break;
            }
        }

        checkRotatedCollision(){
            let rotated = this.rotateElement();
            for (let j=rotated.length-1; j>=0; j--) {
                for (let i=0; i<rotated[j].length; i++) {
                    if ((rotated[j][i] ==1)&&(this.matrix[this.positionY+j][this.positionX + i] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        }


        showElement(){
            for (let i=0; i<this.element.length; i++) {
                for( let j=0; j < this.element[i].length; j++) {
                    if (this.element[i][j] == 1) {
                        let element = this.index(j+this.positionX, i+this.positionY);
                        this.board[element].style.backgroundColor = 'black';
                    }
                }
            }
        }



        addElementToMatrix(){
            for (let i=0; i<this.element.length; i++) {
                for( let j=0; j < this.element[i].length; j++) {
                    if (this.element[i][j] == 1) {
                        this.matrix[i+this.positionY][j+this.positionX] = 1;
                    }
                }
            }
        }

        hideElement(){
            for (let i=0; i<this.element.length; i++) {
                for( let j=0; j < this.element[i].length; j++) {
                    if (this.element[i][j] == 1) {
                        let element = this.index(j+this.positionX, i+this.positionY);
                        this.board[element].style.backgroundColor = 'white';
                    }
                }
            }
        }

        moveElement() {
            // MUSZE DAC JAKO PIERWSZY KROK W STARCIE SHOW ELEMENT
            if (((this.positionY+1) <= this.height-this.element.length) &&(!(this.checkCollisionWithMatrix()))) {
                this.hideElement();
                this.positionY += 1;
                this.showElement();
            } else {
                if (this.positionY == 0) {
                    this.finishGame();
                }
                this.addElementToMatrix();
                this.removeCompleteRows();
                this.positionY = 0;
                this.positionX = Math.floor(this.width/2);
                this.element = this.findRandomElement();
                this.showElement();

            }
        }

        checkLeftCollision(){
            for (let j=this.element.length-1; j>=0; j--) {
                for (let i=0; i<this.element[j].length; i++) {
                    if ((this.element[j][i] ==1)&&(this.matrix[this.positionY+j][this.positionX + i-1] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        }

        checkRightCollision(){
            for (let j=this.element.length-1; j>=0; j--) {
                for (let i=0; i<this.element[j].length; i++) {
                    if ((this.element[j][i] ==1)&&(this.matrix[this.positionY+j][this.positionX + i+1] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        }

        checkCollisionWithMatrix(){
            for (let j=this.element.length-1; j>=0; j--) {
                for (let i=0; i<this.element[0].length; i++) {
                    if ((this.element[j][i] ==1)&&(this.matrix[this.positionY+j+1][this.positionX + i] ==1)) {
                        return true;
                    }
                }
            }
            return false;
        }

        removeCompleteRows(){
            let shouldRepeat = true;
            while (shouldRepeat) {
                shouldRepeat = false;
                let newMatrix =[];
                // newMatrix.push(Array(...Array(this.width)).map(() => 0));
                let newMatrixRaw = new Array(this.width).fill('0');
                newMatrix.push(newMatrixRaw);
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
        }


        colorBoard() {
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
        }

        startGame() {
            this.createBoard();
            this.createMatrix();
            this.setStartingElement();
            this.showElement()
            this.colorBoard();
            this.changeInt(250);
        }

        changeInt(val){
            let self = this;
            this.idSetInterval = setInterval(function() {
                self.moveElement();
                if (self.positionY ==0) {
                    clearInterval(self.idSetInterval);
                    self.changeInt(250);
                }
            }, val );
        }

        slowDownOnKey(){
            clearInterval(this.idSetInterval);
            const self = this;
            this.changeInt(1000);
        }

        // handleMagicWand(){
        //     clearInterval(this.idSetInterval);
        //     this.isWandClicked = true;
        //     let self = this;
        //     this.board.forEach((element, number => {
        //         element.addEventListener('click', () => {
        //
        //             let x = number%this.width;
        //             let y = Math.floor(number/self.width);
        //
        //             let element = this.index(y,x);
        //             if (this.matrix[x][y] == 1) {
        //                 // console.log(this.matrix[i][j]);
        //                 this.board[element].style.backgroundColor = 'white';
        //                 this.matrix[x][y] == 0;
        //             } else {
        //                 this.board[element].style.backgroundColor = 'black';
        //                 this.matrix[x][y] == 1;
        //             }
        //             self.isWandClicked = false;
        //         });
        //     });
        //
        //     // handleClick(element);
        //     changeInt(250);
        // }
        //
        // handleClick(){
        //
        // }

        finishGame() {
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
    let uglyWords = ['vagina', 'condom', 'rape', 'nipples', 'gay', 'fag', 'faggot', 'turd', 'scag', 'arse', 'arsehole',
        'ass', 'bastard', 'basterd', 'bellend', 'berk', 'bint', 'bitch', 'bollocks', 'bugger', 'cad', 'cack', 'cock', 'cunt',
        'crap', 'dick', 'dickhead', 'duffer', 'fuck', 'feck', 'knob', 'minger', 'munter', 'naff', 'nutter', 'piss',
        'scrubber', 'shit', 'shite', 'tosser', 'twat', 'wank', 'wanker', 'nigger', 'nigga', 'gook', 'coon', 'spade'
    ];
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
            let userHeight = Number(newHeight);
            let userWidth = Number(newWidth);

            document.querySelector('.introduction').style.display = 'none';
            document.querySelector('.tetrisContainer').style.display = 'block';

            let game = new Game(userWidth, userHeight);
            game.startGame();

            document.addEventListener('keydown', function(event){
                if (game.isSwitchedSideKeys == true) {
                    game.changeDirectionOpposite(event);
                } else {
                    game.changeDirection(event);
                }

            });

            document.querySelector('.tetris_rotate').addEventListener('click', ()=> {
                document.querySelector('#tetris').style.transform = document.querySelector('#tetris').style.transform == 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
            });

            document.querySelector('.tetris_keys').addEventListener('click', ()=> {
                game.isSwitchedSideKeys = game.isSwitchedSideKeys== false ? true : false;
                document.querySelector('.tetris_keys').innerText = game.isSwitchedSideKeys==false ? 'Switch sides' : 'Sides are switched'
                // console.log(game.isSwitchedSideKeys);
            });

            document.querySelector('.tetris_slowDown').addEventListener('click', ()=> {
                game.slowDownOnKey();
            });

            // document.querySelector('.tetris_changeElement').addEventListener('click', ()=> {
            //     game.handleMagicWand();
            // });

        } else {
            document.querySelector('.introduction_message').innerText = 'Please choose numbers between 10-20';
        }

    });


});