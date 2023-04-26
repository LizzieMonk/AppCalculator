import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, VirtualizedList} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

export default function History({option, isChangeText, history}) {
  if(option){
    console.log('значения:  '+history);
  }

  if(option){
    return (
    // <ScrollView>
      <View style={styles.boxRes}>
      <VirtualizedList data={history} renderItem={({item})=> (
        <Text style={styles.textRes}>{item[0]}</Text>
      )}>
      </VirtualizedList>
      </View>
    // </ScrollView>
    );
  }else{
    return (
      <View style={styles.boxRes}>
        <Text style={styles.textRes}>{isChangeText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  });