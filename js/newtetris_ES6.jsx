
document.addEventListener("DOMContentLoaded", function(){

    // class containing the Game
    class Game {
        constructor(setWidth, setHeight){
            this.boardContainer = document.querySelector('section#tetris'); // container of all elements
            this.width = setWidth; // setting the game width - number of elements in wrow based on User settings
            this.height = setHeight; //setting of game height - number of elements in column based on User setting
            this.points = 0; // number of points scored by User dugin the game
            this.elementTable = [
                [[1],[1],[1],[1]],
                [[1,1],[1,1]],
                [[1,0],[1,1], [1,0]],
                [[0,1,0], [1,1,1], [0,1,0]],
                [[0,1,1], [1,1,0]],
                [[1,1,0], [0,1,1]],
                [[1,0,0],[1,1,1]],
                [[0,0,1],[1,1,1]],
                [[1]]
            ]; // table of items dropping down during the game
            this.positionX = Math.floor(Number(setWidth/2)); //posiition X of item
            this.positionY = 0; // position Y of item
            this.element = null; // dropping-down element
            this.isSwitchedSideKeys = false; //condition showing whether the keys are switched (rotate and switch buttons)
            this.slowDownTimesToUse = 4; // limiter for slow-down button ti be used
        }

        //function to create a board based on settings selected by user
        // it creates elemens of board
        // it sets the width and height of board container
        // it creates this.board - table of all divs
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

        // function to create a matrix filled with 0 corresponding to elements of a board
        // it returs 2-dimensional matrix which single item will be matrix[y][x]
        createMatrix() {
            const newMatrix = [];
            for (let i=0; i<this.height; i++) {
                let newMatrixRaw = new Array(this.width).fill('0');
                //let newMatrixRaw = Array(...Array(this.width)).map(() => 0);
                newMatrix.push(newMatrixRaw);
            }
            this.matrix = newMatrix;
        }

        // function which returns index of this.board corrensonding to y - rows and x-columns position of element
        index(x, y) {
            return x + (y * this.width);
        }

        // function which choose randomly the element from the elementTable item and returns it
        findRandomElement() {
            let number = Math.floor(Math.random()*9);
            this.number = number;
            return this.elementTable[number];
        }

        // function that detonates the bomb, returns new matrix and colors the board(update the view)
        detonateBomb(){
            const newMatrix = this.matrix;
            const neightbourItems = [ [this.positionY - 1, this.positionX - 1], [this.positionY - 1, this.positionX],
                [this.positionY - 1, this.positionX + 1], [this.positionY, this.positionX - 1],
                [this.positionY, this.positionX], [this.positionY, this.positionX + 1], [this.positionY + 1, this.positionX - 1],
                [this.positionY + 1, this.positionX], [this.positionY + 1, this.positionX + 1]
            ];

            neightbourItems.forEach(element => {
                if(element[0]>=0 && element[0]<this.height && element[1]>=0 && element[1]<this.width) {
                    newMatrix[element[0]][element[1]] = 0;
                }
            });
            this.matrix = newMatrix;
            this.colorBoard();
        }

        // function setting up starting element return this.element
        setStartingElement() {
            this.element = this.findRandomElement();
        }

        //function which rotate element - return rotated element as 2D-matrix
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

        //function for handling pressed keys
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

        //function for handling pressing of keys for special buttons (rotate tetris and switch sides)
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

        // function which returs boolean checking whether element can be rotated (it next position is possible and not already taken)
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

        // function coloring dropping-down element
        // for normal element it colors it in black, for bomb it colors it red
        showElement(){
            for (let i=0; i<this.element.length; i++) {
                for( let j=0; j < this.element[i].length; j++) {
                    if (this.element[i][j] == 1) {
                        let element = this.index(j+this.positionX, i+this.positionY);
                        if (this.number ==8) {
                            this.board[element].style.backgroundColor = 'red';
                        } else {
                            this.board[element].style.backgroundColor = 'black';
                        }
                    }
                }
            }
        }

        // function which add the dropping-down lement to the matrix when dropping-down is no longer possible
        // return new this.matrix including element
        // it does not apply to bomb element - selection done later
        addElementToMatrix(){
            for (let i=0; i<this.element.length; i++) {
                for( let j=0; j < this.element[i].length; j++) {
                    if (this.element[i][j] == 1) {
                        this.matrix[i+this.positionY][j+this.positionX] = 1;
                    }
                }
            }
        }

        //function hides element by changing it stle(background color) to white
        // used when element is dropping down
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

        // function dropping down element
        // it hides element, drops it down my adding 1 to positionY and then shows element only
        // when element will be inside a board and will not collide with other elements
        // additionally it calls the function handling description necessary for bomb element
        // it stops the game if elemeent cannot fall down from initial position
        // for collision it calls the function to add element to this.matrix or for bomb it detonates it
        // calls setNewState - dropping down of new element
        moveElement() {
            this.handleBombDescription();
            if (((this.positionY+1) <= this.height-this.element.length) &&(!(this.checkCollisionWithMatrix()))) {
                this.hideElement();
                this.positionY += 1;
                this.showElement();
            } else {
                if (this.positionY == 0) {
                    this.finishGame();
                }

                if (this.number==8) {
                    this.detonateBomb();
                } else {
                    this.addElementToMatrix();
                }

                this.setNewState();
            }
        }

        // function handling dropping down of a new element
        // removing complete rows, setting new X and Y positions and generating and showing new element;
        setNewState(){
            document.querySelector('.tetrisInfo_text').innerText = '';
            this.removeCompleteRows();
            this.positionY = 0;
            this.positionX = Math.floor(this.width/2);
            this.element = this.findRandomElement();
            this.showElement();
        }

        // function which checks whether element can be mover left
        // returns boolean
        // returns true if it collides thus cannot be moved
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

        // function similar to checkLeftCollision()
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

        // function which checks whether element can drop-down left
        // returns boolean
        // returns true if it collides thus cannot be moved
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

        //function removing complete rows
        removeCompleteRows(){
            //tutaj sprawdzic bo nie trzeba while w takim ukladzie jak jest!!!!!
            let shouldRepeat = true;
            while (shouldRepeat) {
                shouldRepeat = false;
                let newMatrix =[];
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
            document.querySelector('.tetris_slowDown').innerText = `Slow down (${this.slowDownTimesToUse} to use)`;
            this.createBoard();
            this.createMatrix();
            this.setStartingElement();
            while(this.number ==8){
                this.setStartingElement();
            }
            this.showElement()
            this.colorBoard();
            this.changeInt(250);
            this.handleButtons();
        }

        changeInt(val){
            let self = this;
            this.idSetInterval = setInterval(function() {
                self.moveElement();
                if (self.positionY ==0) {
                    self.handleSlowDownButtonVisibility();
                    clearInterval(self.idSetInterval);
                    self.changeInt(250);
                }
            }, val );
        }

        handleRotateButton() {
            const self = this;
            document.querySelector('.tetris_rotate').addEventListener('click', (e)=> {
                document.querySelector('#tetris').style.transform = document.querySelector('#tetris').style.transform == 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
                e.target.innerText = document.querySelector('#tetris').style.transform == 'rotate(180deg)' ? 'Tetris rotated' : 'Rotate tetris';
                self.isSwitchedSideKeys = self.isSwitchedSideKeys== false ? true : false;
            });
        }

        handleSlowDownButton() {
            const self = this;
            document.querySelector('.tetris_slowDown').addEventListener('click', (e)=> {
                self.slowDownTimesToUse--;
                clearInterval(self.idSetInterval);
                self.changeInt(1000);
                e.target.disabled = true;
                e.target.innerText = `Slow down (${this.slowDownTimesToUse} to use)`;
            });
        }

        handleSlowDownButtonVisibility(){
            if (this.slowDownTimesToUse == 0) {
                document.querySelector('.tetris_slowDown').disabled = true;
            } else {
                document.querySelector('.tetris_slowDown').disabled = false;
            }
        }

        handleChageKeysButton(){
            const self = this;
            document.querySelector('.tetris_keys').addEventListener('click', (e)=> {
                self.isSwitchedSideKeys = self.isSwitchedSideKeys== false ? true : false;
                e.target.innerText = self.isSwitchedSideKeys==false ? 'Switch sides' : 'Sides are switched';
            });
        }

        handleButtons(){
            this.handleRotateButton();
            this.handleSlowDownButton();
            this.handleChageKeysButton();
            this.handleMouseOverButtons();
        }

        handleBombDescription(){
            if (this.number == 8) {
                document.querySelector('.tetrisInfo_text').innerText = 'THE BOMB is falling. When it will reeach the surface it will detonate destroying everything in radius of 1 element';
            }
        }

        handleMouseOverButtons(){
            const btnList = [
                ['.tetris_rotate', 'When clicked rotates board upside-down. Usage: unlimited'],
                ['.tetris_keys', 'When clicked the action of left and rught arrows are switched (left arrow moves element to the right and right arrow moves element to the left). Usage: unlimited'],
                ['.tetris_slowDown', 'When clicked slows down the game for dropping of single element. Can be used 4 times']
            ];
            btnList.forEach(element => {
                document.querySelector(element[0]).addEventListener('mouseenter', () => {
                    document.querySelector('.tetrisInfo_text').innerText = element[1];
                });
                document.querySelector(element[0]).addEventListener('mouseleave', () => {
                    document.querySelector('.tetrisInfo_text').innerText = '';
                });
            });
        }

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

    let isInappropriate = false;
    let dataWhole = null;
    let dataJoke = null;
    let uglyWords = ['vagina', 'condom', 'rape', 'nipples', 'gay', 'fag', 'faggot', 'turd', 'scag', 'arse', 'arsehole',
        'ass', 'bastard', 'basterd', 'bellend', 'berk', 'bint', 'bitch', 'bollocks', 'bugger', 'cad', 'cack', 'cock', 'cunt',
        'crap', 'dick', 'dickhead', 'duffer', 'fuck', 'feck', 'knob', 'minger', 'munter', 'naff', 'nutter', 'piss',
        'scrubber', 'shit', 'shite', 'tosser', 'twat', 'wank', 'wanker', 'nigger', 'nigga', 'gook', 'coon', 'spade',
        'pregnant'
    ];
    const jokesTable = ["Chuck Norris brushes his teeth with a machine gun and flosses with a lightsaber.",
        "The only mistake that Chuck Norris has committed was when he thought he did a mistake.",
        "Chuck Norris didn't audition for walker texas ranger he made da producers audition to film his life."
    ];

    function handleJoke() {
        fetch('https://api.chucknorris.io/jokes/random')
            .then(resp => resp.json())
            .then(data => {
                dataWhole = data;
                dataJoke = data.value;
                uglyWords.forEach(element => {
                    if (dataJoke.indexOf(element) !== -1) {
                        isInappropriate = true;
                        let randomNumber = Math.floor(Math.random()*3);
                        dataJoke = jokesTable[randomNumber];
                    }
                });
            })
            .catch(err => {
                let randomNumber = Math.floor(Math.random()*3);
                dataJoke = jokesTable[randomNumber];
                isInappropriate = true;
            });
    }


    document.querySelector('.introduction_button').addEventListener('click', (element) => {
        let newWidth = document.querySelector('.introduction_input[name="width"]').value;
        let newHeight = document.querySelector('.introduction_input[name="height"]').value;
        if ((newWidth >=10 && newWidth <=20) && (newHeight >=10 && newHeight <=20) ){
            let userHeight = Number(newHeight);
            let userWidth = Number(newWidth);

            document.querySelector('.introduction').style.display = 'none';
            document.querySelector('.tetrisContainer').style.display = 'flex';

            let game = new Game(userWidth, userHeight);
            game.startGame();

            document.addEventListener('keydown', function(event){
                if (game.isSwitchedSideKeys == true) {
                    game.changeDirectionOpposite(event);
                } else {
                    game.changeDirection(event);
                }
            });

            handleJoke();

        } else {
            document.querySelector('.introduction_message').innerText = 'Please choose numbers between 10-20';
        }
    });
});