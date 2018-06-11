class CalcController{
    constructor (){
        this._locale = "pt-BR";
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl        = document.querySelector("#data");
        this._timeEl        = document.querySelector("#hora");

        this._currentDate;
        this.initialize();
        this.initButtonEvents();
        this.initializeKeyboard();
    };    

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
       },1000);
       this.setLastNumberToDisplay();
    };
    initializeKeyboard(){
        document.addEventListener('keyup', e=>{

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                this.addOperation(e.key);
                    break;
                case ',':
                case '.':
                    this.addDot();   
                    break;    
                case 'Enter':
                case '=':
                    this.calculate();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                }
        });
    }

    // adding events to the buttons. 
    initButtonEvents(){
        let buttons         = document.querySelectorAll("#buttons > g, #parts > g");
        
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn,'click drag',e=>{
               let textBtn =  btn.className.baseVal.replace("btn-","");
               this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            })
        });
       
    };

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event,fn,false);
        })
    }

    // btn control main switch
    execBtn(value){

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
               this.addOperation('+');
                break;
            case 'subtracao':
            this.addOperation('-');
                break;    
            case 'divisao':
            this.addOperation('/');
                break;
            case 'porcento':
            this.addOperation('%');   
                break;
            case 'multiplicacao':
                this.addOperation('*');   
                break;    
            case 'ponto':
                this.addDot();   
                break;    
            case 'igual':
                this.calculate();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
            }
    }
   //main calc buttons
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    setError(){
        this.displayCalc = "error";
    }
    clearAll(){
        this._operation    = [];
        this._lastNumber   = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    };

    // heavy lifting business logic
    addOperation(value){
       
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
           
                this.setLastOperation(value);
           
            }else{
                    //definetely a number
                    this.pushOperation(value);
                    this.setLastNumberToDisplay();
                }
        }else{

            if(this.isOperator(value)){
                this.pushOperation(value);
          
            }else{
                //number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // refresh display
                this.setLastNumberToDisplay();
            }
          
        }
    };

    addDot(){
        let lastOperation = this.getLastOperation();
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')> -1) return

        if(this.isOperator(lastOperation)|| !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString + ".");
        }

        this.setLastNumberToDisplay();

    };
    
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
   
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
    
    isOperator(value){
        //fancy way of returning true if isOperator returns true
        return (['+','-','*','/','%'].indexOf(value) > -1)
    }
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calculate();
        }
    }
    getResult(){
        return eval(this._operation.join(""));
    }
    calculate(){
        let last = '';
        this._lastOperator = this.getLastItem();
        //holy validation batman
        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem,this._lastOperator,this._lastNumber];

        }


        if(this._operation.length >3 ){
        
            let last   = this._operation.pop(); 
            this._lastNumber = this.getResult();          
        
        }else if(this._operation.length ==3){
        
            this._lastNumber = this.getLastItem(false);  
        
        }

        let result = this.getResult();

        if (last == '%'){
            //result is equal to result /100
            result /= 100;
            this._operation = [result];
        }else{

            this._operation = [result];
            if(last) this._operation.push(last);
        }
        this.setLastNumberToDisplay(); 
    }

    getLastItem(isOperator){
        let lastItem;
            for (let i = this._operation.length-1; i>=0;i--){

                if(this.isOperator(this._operation[i])== isOperator){
                    lastItem = this._operation[i];
                    break;
                }
           
            }
            if(!lastItem){
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            }
            return lastItem;
        }

    
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    }

    // setting date and time on the display
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    };
    
    // getters and setters from the base environment variables
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    };
    set displayCalc(x){
        this._displayCalcEl.innerHTML = x; 
    };
    get currentDate(){
        return new Date();
    }
    set currentDate(x){
        this.dataAtual = x;
    }

};