import { Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

export default function MainOperations({textButton, operationSelect}) {

  const onClick = ()=>{
    operationSelect();
  }
  if(textButton=='='){
    return (
      <TouchableOpacity style={styles.bottom} onPress={onClick}>
        <View style={[styles.circle, {backgroundColor:'#4F67D3'}]}>
        <Text style={styles.text}>
            {textButton}
        </Text>
        </View>
        </TouchableOpacity>
    );
  }else{
    return (
      <TouchableOpacity style={styles.bottom} onPress={onClick}>
        <View style={styles.circle}>
        <Text style={styles.text}>
            {textButton}
        </Text>
        </View>
        </TouchableOpacity>
    );
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
  circle: {
    backgroundColor:'#232323',
    height:60,
    width:60,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },


  });