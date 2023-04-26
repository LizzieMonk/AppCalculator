import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform } from "react-native";
import ButtonComp from "./components/ButtonComp";
import { useEffect, useState } from "react";
import MainOperations from "./components/MainOperations";
import History from "./components/History";

export default function App() {
  const [isExpand, setIsExpand] = useState(true);

  const onExpandCalc = () => {
    setIsExpand(!isExpand);
  };

  const [isChangeText, setIsChangeText] = useState("0");

  const onChangeText = (value) => {
    isChangeText == "0"
      ? setIsChangeText(value)
      : setIsChangeText(isChangeText + value);
  };
  const onEraseText = () => {
    console.log(isChangeText);
    isChangeText.length >1
    ? setIsChangeText(isChangeText.substring(0,isChangeText.length-1))
    : setIsChangeText("0")&& setRes(0);
  }

  const [myMap,setMyMap] = useState(new Map());
  const [history, setHistory] = useState(false);

  // const [orienatation, setOrientation] = useState('portrait');

  // const changeOrient = () =>{
  //   this.state.screen.width<this.state.screen.height
  //   ?setOrientation('portrait')
  //   :setOrientation('landscape')
  // }

  const onShowHistory = () => {
    // for(let item of myMap){
    //   console.log(item);
    // }
  console.log(myMap);
  setHistory(!history);
  }
  const addHistory = () =>{
    let now = new Date();
    setMyMap(myMap.set(now, isChangeText+'='+res));
  }

  useEffect(() => {
    toInfixExpr();
  }, [isChangeText]);

  const [res, setRes] = useState(0);

  const toInfixExpr = () => {
    var elements = [];
    var iElem = 0;
    var symbol = "";
    var numbers =[];
    var iNumbers=0;
    var operations=[];
    var iOperations=0;
    let fraction =true;
    for (let char of isChangeText) {
      if (isNaN(char)) {  //операция
        if (numbers.length != 0) {//если есть число м/у операциями
          for (var j = 0; j < numbers.length; j++) {
            symbol += numbers[j];
          }
          parseFloat(symbol, 10);
          // console.log(typeof(symbol));
          elements[iElem] = symbol;
          iElem++;
          numbers.length = 0;
          iNumbers = 0;
          symbol = "";
        }
          operations[iOperations] = char;
          iOperations++;
      } else {
        if (operations.length != 0) {
          for (var j = 0; j < operations.length; j++) {
            if(operations[j]==','){
              let fullNumber = '';
              fullNumber = elements[iElem-1];
              fullNumber+='.';
              parseFloat(fullNumber,10);
              elements[iElem-1]=fullNumber;
              // console.log(typeof(elements[iElem-1]));
              // console.log(typeof(fullNumber));
              fraction=false;
            }
            else if(operations[j]=='-'||operations[j]=='+'||operations[j]=='*'||operations[j]=='/'||operations[j]=='('||operations[j]==')'){
              if(symbol!=""){
                elements[iElem] = symbol;
                iElem++;
                symbol="";
              }
              elements[iElem] = operations[j];
              iElem++;
            }
            else {symbol += operations[j];}
          }
          if(symbol!=""){
            elements[iElem] = symbol;
            iElem++;
            symbol = "";
          }
          operations.length = 0;
          iOperations = 0;
        }
        if(fraction&&isNaN(elements[iElem-1])){
          numbers[iNumbers]=char;
          iNumbers++;
        } else {
          let fullNumber = '';
          fullNumber = elements[iElem-1];
          fullNumber+=char;
          parseFloat(fullNumber,10);
          elements[iElem-1]=fullNumber;
          fraction=true;
        }
      }
    }
    if (numbers.length != 0) {
      for (var j = 0; j < numbers.length; j++) {
        symbol += numbers[j];
      }
      parseFloat(symbol, 10);
      elements[iElem] = symbol;
      iElem++;
      numbers.length = 0;
      iNumbers = 0;
    }  //добавление последних цифр
    else if (operations.length != 0) {
      for (var j = 0; j < operations.length; j++) {
        if(operations[j]=='!'||operations[j]=='%'||operations[j]==')'||operations[j]=='e'||operations[j]=='п'){
          if(symbol!=""){
            elements[iElem] = symbol;
            iElem++;
            symbol="";
          }
          elements[iElem] = operations[j];
          iElem++;
        }
      }
      if(symbol!=""){
        elements[iElem] = symbol;
        iElem++;
        symbol = "";
      }
      operations.length = 0;
      iOperations = 0;
    }  //добавление последних символов (не всех(!))
    // console.log(elements)
    let hooks = true;
    for(let ch of elements){
      if(ch=='(') hooks = false;
      else if(ch ==')') hooks = true;
    }
    if(!hooks) {
      elements[iElem] = ')';
      iElem++;
    }  //проверка на закрывающуюся скобку
    toPostfix(elements);
  };

  const toPostfix = (value) =>{
    console.log('ф-я '+value);
    let postfixExpr = [];
    let iPostfixExpr = 0;
    const stack = [];
    let operations=[];
    let iOperations =0;
    for(let char of value){
      // console.log('символ: '+char+typeof(char))
      if(!isNaN(char)){  //числа
        postfixExpr[iPostfixExpr]=char;
        iPostfixExpr++;
      }
      else if(char =="("){
        operations[iOperations]=char;
        iOperations++;
        // console.log("символ (   "+char);
      }
      else if(char ==")"){
        // console.log('come')
       //	Заносим в выходную строку из стека всё вплоть до открывающей скобки
      while(operations.length>0 && operations[operations.length-1]!='('){
        postfixExpr[iPostfixExpr]= operations[operations.length-1];
        iPostfixExpr++;
        // operations.length--;
        operations.splice(operations.length-1,1);
      }
      operations.splice(operations.length-1,1);
      }
      else {  //если + - * и тд
        //	Заносим в выходную строку все операторы из стека, имеющие более высокий приоритет
        while (operations.length>0 && ( operationPriority(operations[operations.length-1]) >= operationPriority(char))){
          postfixExpr[iPostfixExpr]= operations[operations.length-1];
          iPostfixExpr++;
          operations.splice(operations.length-1,1);
        }
				//	Заносим в стек оператор
        operations[iOperations]=char;
        iOperations++;
      }
    }
    // console.log('stack-----   '+operations);
    //	Заносим все оставшиеся операторы из стека в выходную строку
    while(operations.length>0){
      postfixExpr[iPostfixExpr]= operations[operations.length-1];
      iPostfixExpr++;
      operations.splice(operations.length-1,1);
    }
    let postfix=[];
    let iPostfix=0
    for(let char of postfixExpr){
      if(char){
        postfix[iPostfix]=char;
        iPostfix++;
      }
    }
    //	Возвращаем выражение в постфиксной записи
    console.log('postfix:   '+postfix+'   длина:   '+postfix.length)
    onCalculate(postfix);
  }

  const  operationPriority = (char) =>{
    if(char=='(') return 0;
    else if(char=='+') return 1;
    else if(char=='-') return 1;
    else if(char=='*') return 2;
    else if(char=='/') return 2;
    else if(char=='^') return 3;
    else if(char=='%') return 4;
    else if(char=='!') return 5;
    else if(char=='√') return 6;
    else if(char=='sin') return 6;
    else if(char=='cos') return 6;
    else if(char=='tan') return 6;
    else if(char=='log') return 6;
    else if(char=='e') return 7;
    else if(char=='п') return 7;
  }

  const onCalculate = (postfix) => {
    let arr=[];
    let iArr=0;
    for(let char of postfix){
      if(!isNaN(char)){
        arr[iArr]=char;
        iArr++;
      }else{
        switch(char){
          case '+':{
            let numberOne = parseFloat(arr[arr.length-2])
            let numberTwo = parseFloat(arr[arr.length-1])
            arr[arr.length-2]=numberOne+numberTwo;
            arr.splice(arr.length-1,1);
            iArr--;
            break;
          }
          case '-':{
            let numberOne = parseFloat(arr[arr.length-2])
            let numberTwo = parseFloat(arr[arr.length-1])
            arr[arr.length-2]=numberOne-numberTwo;
            arr.splice(arr.length-1,1);
            iArr--;
            break;
          }
          case '*':{
            let numberOne = parseFloat(arr[arr.length-2])
            let numberTwo = parseFloat(arr[arr.length-1])
            arr[arr.length-2]=numberOne*numberTwo;
            arr.splice(arr.length-1,1);
            iArr--;
            break;
          }
          case '/':{
            let numberOne = parseFloat(arr[arr.length-2])
            let numberTwo = parseFloat(arr[arr.length-1])
            arr[arr.length-2]=numberOne/numberTwo;
            arr.splice(arr.length-1,1);
            iArr--;
            break;
          }
          case '^':{
            let numberOne = parseFloat(arr[arr.length-2])
            let numberTwo = parseFloat(arr[arr.length-1])
            arr[arr.length-2]=Math.pow(numberOne,numberTwo);
            arr.splice(arr.length-1,1);
            iArr--;
            break;
          }
          case '%':{
            arr[arr.length-1]*=0.01;
            // let numberOne = parseFloat(arr[arr.length-2])
            // let numberTwo = parseFloat(arr[arr.length-1])
            // arr[arr.length-2]=numberOne*numberTwo*0.01;
            // arr.splice(arr.length-1,1);
            // iArr--;
            break;
          }
          case '!':{
            arr[arr.length-1]=factorial(arr[arr.length-1]);
              // Определение факториальной функции
              function factorial(num) {
                if (num === 1) {
                    return 1;
                } else {
                    return num * factorial(num - 1)
                }
            }
            break;
          }
          case '√':{
            arr[arr.length-1]=Math.sqrt(arr[arr.length-1]);
            break;
          }
          case 'sin':{
            arr[arr.length-1]=Math.sin(arr[arr.length-1]);
            break;
          }
          case 'cos':{
            arr[arr.length-1]=Math.cos(arr[arr.length-1]);
            break;
          }
          case 'tan':{
            arr[arr.length-1]=Math.tan(arr[arr.length-1]);
            break;
          }
          case 'log':{
            arr[arr.length-1]=Math.log10(arr[arr.length-1]);
            break;
          }
          case 'ln':{
            arr[arr.length-1]=Math.log(arr[arr.length-1]);
            break;
          }
          case 'e':{
            arr[arr.length-1]*=Math.E;
            break;
          }
          case 'п':{
            arr[arr.length-1]*=Math.PI;
            break;
          }
        }
      }
    }
setRes(parseFloat(arr[0]));
  }

  if (isExpand) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.boxHeader}>
          <Text style={styles.textHeader}>Calculator</Text>
        </View>

      {/* <History option={false} isChangeText={isChangeText} history={myMap}/> */}

        <View style={styles.boxRes}>
          <Text style={styles.textRes}>{isChangeText}</Text>
        </View>

        <View style={styles.boxRes}>
          <Text style={styles.textPreRes}>{res}</Text>
        </View>

        <View style={styles.calc}>
          <ButtonComp textButton={"cos"}
          operationSelect={() => {
            onChangeText("cos(");
          }}/>
          <ButtonComp textButton={"log"}
          operationSelect={() => {
            onChangeText("log(");
          }}/>
          <ButtonComp textButton={"("}
          operationSelect={() => {
            onChangeText("(");
          }}/>
          <ButtonComp textButton={")"}
          operationSelect={() => {
            onChangeText(")");
          }}/>
          <ButtonComp textButton={"◴"}
          operationSelect={() => {
            onShowHistory();
          }}
          />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={"sin"}
            operationSelect={() => {
              onChangeText("sin(");
            }}
          />
          <ButtonComp
            textButton={"tan"}
            operationSelect={() => {
              onChangeText("tan(");
            }}
          />
          <ButtonComp
            textButton={"√"}
            operationSelect={() => {
              onChangeText("√");
            }}
          />
          <ButtonComp
            textButton={"ln"}
            operationSelect={() => {
              onChangeText("ln(");
            }}
          />
          <ButtonComp textButton={""} />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={"AC"}
            operationSelect={() => {
              setIsChangeText("0");
              setRes(0);
            }}
            isExpend={isExpand}
          />
          <ButtonComp textButton={"<="}
          operationSelect={() => {
            onEraseText();
          }}
          isExpend={isExpand} />
          <ButtonComp textButton={"%"}
              operationSelect={() => {
              onChangeText("%");
            }}
            isExpend={isExpand} />
          <ButtonComp textButton={"п"}
            operationSelect={() => {
            onChangeText("п");
          }}/>
          <MainOperations
            textButton={"/"}
            operationSelect={() => {
              onChangeText("/");
            }}
          />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={7}
            operationSelect={() => {
              onChangeText("7");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={8}
            operationSelect={() => {
              onChangeText("8");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={9}
            operationSelect={() => {
              onChangeText("9");
            }}
            isExpend={isExpand}
          />
          <ButtonComp textButton={"e"}
          operationSelect={() => {
            onChangeText("e");
          }}/>
          <MainOperations
            textButton={"*"}
            operationSelect={() => {
              onChangeText("*");
            }}
          />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={4}
            operationSelect={() => {
              onChangeText("4");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={5}
            operationSelect={() => {
              onChangeText("5");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={6}
            operationSelect={() => {
              onChangeText("6");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
          textButton={"n!"}
            operationSelect={() => {
            onChangeText("!");
            }}/>
          <MainOperations
            textButton={"-"}
            operationSelect={() => {
              onChangeText("-");
            }}
          />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={1}
            operationSelect={() => {
              onChangeText("1");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={2}
            operationSelect={() => {
              onChangeText("2");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={3}
            operationSelect={() => {
              onChangeText("3");
            }}
            isExpend={isExpand}
          />
          <ButtonComp textButton={"^"}
            operationSelect={() => {
            onChangeText("^");
            }}/>
          <MainOperations
            textButton={"+"}
            operationSelect={() => {
              onChangeText("+");
            }}
          />
        </View>
        <View style={styles.calc}>
          <ButtonComp
            textButton={"<>"}
            operationSelect={onExpandCalc}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={"0"}
            operationSelect={() => {
              onChangeText("0");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={","}
            operationSelect={() => {
              onChangeText(",");
            }}
            isExpend={isExpand}
          />
          <ButtonComp textButton={""} />
          <MainOperations
            textButton={"="}
            operationSelect={() => {
              addHistory();
              let str= String(res);
              setIsChangeText(str);
            }}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.boxHeader}>
          <Text style={styles.textHeader}>Calculator</Text>
        </View>

        <View style={styles.boxRes}>
          <Text style={styles.textRes}>{isChangeText}</Text>
        </View>

        <View style={styles.boxRes}>
          <Text style={styles.textPreRes}>{res}</Text>
        </View>

        <View style={styles.calc}>
        <ButtonComp
            textButton={"AC"}
            operationSelect={() => {
              setIsChangeText("0");
              setRes(0);
            }}
            isExpend={isExpand}
          />
          <ButtonComp textButton={"<="} />
          <ButtonComp
            textButton={'%'}
            operationSelect={() => {
              onChangeText("%");
            }}
            isExpend={isExpand}
          />
          <MainOperations
            textButton={"/"}
            operationSelect={() => {
              onChangeText("/");
            }}
          />
        </View>
        <View style={styles.calc}>
        <ButtonComp
            textButton={7}
            operationSelect={() => {
              onChangeText("7");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={8}
            operationSelect={() => {
              onChangeText("8");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={9}
            operationSelect={() => {
              onChangeText("9");
            }}
            isExpend={isExpand}
          />
          <MainOperations
            textButton={"*"}
            operationSelect={() => {
              onChangeText("*");
            }}
          />
        </View>
        <View style={styles.calc}>
        <ButtonComp
            textButton={4}
            operationSelect={() => {
              onChangeText("4");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={5}
            operationSelect={() => {
              onChangeText("5");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={6}
            operationSelect={() => {
              onChangeText("6");
            }}
            isExpend={isExpand}
          />
          <MainOperations
            textButton={"-"}
            operationSelect={() => {
              onChangeText("-");
            }}
          />
        </View>
        <View style={styles.calc}>
        <ButtonComp
            textButton={1}
            operationSelect={() => {
              onChangeText("1");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={2}
            operationSelect={() => {
              onChangeText("2");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={3}
            operationSelect={() => {
              onChangeText("3");
            }}
            isExpend={isExpand}
          />
          <MainOperations
            textButton={"+"}
            operationSelect={() => {
              onChangeText("+");
            }}
          />
        </View>
        <View style={styles.calc}>
        <ButtonComp
            textButton={"<>"}
            operationSelect={onExpandCalc}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={"0"}
            operationSelect={() => {
              onChangeText("0");
            }}
            isExpend={isExpand}
          />
          <ButtonComp
            textButton={","}
            operationSelect={() => {
              onChangeText(",");
            }}
            isExpend={isExpand}
          />
          <MainOperations
            textButton={"="}
            operationSelect={() => {
              toInfixExpr();
            }}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#383838",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  calc: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#171717",
  },
  boxHeader: {
    width: "100%",
    marginBottom: "auto",
    // backgroundColor:'red',
    paddingTop: 30,
    paddingBottom: 20,
  },
  textHeader: {
    color: "#fff",
    fontSize: 35,
    paddingLeft: 20,
  },

  boxRes: {
    width: "100%",
    // backgroundColor:'#000',
    paddingBottom: 20,
    alignItems: "flex-end",
  },
  textRes: {
    color: "#fff",
    fontSize: 30,
    paddingRight: 20,
  },
  textPreRes: {
    color: "#7A7A7A",
    fontSize: 20,
    paddingRight: 20,
  },
});
