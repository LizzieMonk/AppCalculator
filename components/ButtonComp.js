import { Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ButtonComp({textButton, operationSelect, isExpend}) {

  const onClick = ()=>{
    operationSelect();
  }
  if(textButton=='<>' && isExpend){
    return (
      <TouchableOpacity style={[styles.bottom, {backgroundColor:'#383838'}]} onPress={onClick}>
          <Text style={[styles.text, {color:'#4F67D3'}]}>
            {textButton}
          </Text>
        </TouchableOpacity>
    );
  } else if(isExpend){
    return (
      <TouchableOpacity style={[styles.bottom, {backgroundColor:'#383838'}]} onPress={onClick}>
          <Text style={styles.text}>
            {textButton}
          </Text>
        </TouchableOpacity>
    );
  }
  else {
    if(textButton=="◴"){
      return (
        <TouchableOpacity style={styles.bottom} onPress={onClick}>
            <Text style={[styles.text,{fontSize:40},{color:'#4F67D3'}]}>
              {textButton}
            </Text>
          </TouchableOpacity>
      );
    }else {
    return (
      <TouchableOpacity style={styles.bottom} onPress={onClick}>
          <Text style={styles.text}>
            {textButton}
          </Text>
        </TouchableOpacity>
    );
  }
  }
}

const styles = StyleSheet.create({
  bottom: {
    height: '100%',
    flex:1,
    // backgroundColor: 'red',
    alignItems:'center',
    justifyContent:'center',
  },
  text: {
    color: '#fff',
    fontSize: 25,
  },


  });