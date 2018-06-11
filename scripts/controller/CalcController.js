class CalcController{
    constructor (){
        this._locale = "pt-BR";
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl        = document.querySelector("#data");
        this._timeEl        = document.querySelector("#hora");

        this._currentDate;
        this.initialize();
        this.initButtonEvents();
    };    

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
       },1000);
    };


    // adding events to the buttons. 
    initButtonEvents(){
        let buttons         = document.querySelectorAll("#buttons > g, #parts > g");
        
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn,'click drag',e=>{
               //let textBtn =  console.log(btn.className.baseVal.replace("btn-",""));
               this.execBtn();
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            })
        });
       
    };

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(events =>{
            element.addEventListener(events,fn,false);
        })
    }

    // btn control
    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'CE':
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
                this.addOperation('.');   
                break;    
            case 'igual':
               
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
            }
    }
   //main calc buttons
    clearEntry(){
        this._operation.pop();
    }
    setError(){
        this.displayCalc = "error";
    }
    clearAll(){
        this._operation = [];
    };

    // heavy lifting business logic
    addOperation(value){
       
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
                this.setLastOperation(value);
                }else if(isNaN(value)){
                    console.log(value);
                }else{
                    //definetely a number
                    this.pushOperation(value);
                }
        }else{

            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                //number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                // refresh display
                this.setLastNumberToDisplay();
            }
          
        }
        console.log(this._operation);
    };
   
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
   
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
    
    isOperator(value){
        //fancy way of returning
        return (['+','-','*','/','%'].indexOf(value) > -1)
    }
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calculate();
        }
    }

    calculate(){
        let last   = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result,last];
    }


    setLastNumberToDisplay(){
        
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