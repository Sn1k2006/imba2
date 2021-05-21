import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {View, Text} from 'native-base';

class TestScrolling extends Component {
  render(){
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{flexGrow: 1}}
        >
          <View style={{marginTop: 10, height: 200}}>
          <ScrollView  contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: '#cb8c92'}} >
            <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet eius inventore laboriosam numquam soluta ullam voluptate. At cupiditate ea et eveniet illo minus omnis perspiciatis reprehenderit soluta voluptatibus? Distinctio mollitia quasi vitae! Accusantium architecto aut consequuntur corporis dignissimos distinctio, earum eveniet fugit, mollitia odio odit porro provident quas sed temporibus vel velit? Architecto consectetur consequatur cupiditate, dolor dolorem explicabo facilis hic ipsa natus nemo nisi nulla, numquam porro quod rem sint, soluta sunt tempora vero vitae. Explicabo minima, nemo nesciunt quam qui quos. Deleniti expedita fugiat ipsum minima nemo rem repellendus saepe sed, tempora veritatis. Dolorem fuga necessitatibus soluta sunt.</Text>
          </ScrollView>
          </View>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo libero maiores maxime optio recusandae suscipit tempora velit. A adipisci eos explicabo id impedit incidunt ipsum iure labore minima nam natus necessitatibus neque nesciunt obcaecati, odit officia quibusdam quis reiciendis repellat suscipit tenetur voluptas voluptatem. Amet ex excepturi, id neque numquam possimus voluptatem! Eaque impedit laborum mollitia natus obcaecati quis ut! Aspernatur assumenda atque dolores, eum harum illo iusto labore nisi obcaecati, ratione rem unde voluptatum. Aut consectetur cumque ducimus earum eius enim fugiat illo incidunt minima minus, officia quam, quia recusandae, reiciendis rem unde vel voluptatem. A ab adipisci alias beatae deleniti distinctio dolor dolorum ducimus earum eius eum explicabo facere, impedit, inventore magnam maxime modi perferendis perspiciatis porro, quasi quibusdam sequi veritatis voluptatum. Dolor ducimus optio quo? Alias atque aut consequatur cumque dolor eaque esse eveniet exercitationem fugiat, iste laboriosam maxime molestias nisi nobis odio pariatur perferendis, placeat, porro provident quam quo ratione repellat reprehenderit repudiandae soluta temporibus tenetur. Ab error qui veniam voluptatem? At, deleniti distinctio, eligendi fuga ipsa magni maxime minus molestias natus neque pariatur, provident quibusdam quo repellendus suscipit. Asperiores delectus, enim hic id ipsa ipsam laboriosam magnam maxime natus obcaecati placeat rem sunt unde voluptate.</Text>


          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo libero maiores maxime optio recusandae suscipit tempora velit. A adipisci eos explicabo id impedit incidunt ipsum iure labore minima nam natus necessitatibus neque nesciunt obcaecati, odit officia quibusdam quis reiciendis repellat suscipit tenetur voluptas voluptatem. Amet ex excepturi, id neque numquam possimus voluptatem! Eaque impedit laborum mollitia natus obcaecati quis ut! Aspernatur assumenda atque dolores, eum harum illo iusto labore nisi obcaecati, ratione rem unde voluptatum. Aut consectetur cumque ducimus earum eius enim fugiat illo incidunt minima minus, officia quam, quia recusandae, reiciendis rem unde vel voluptatem. A ab adipisci alias beatae deleniti distinctio dolor dolorum ducimus earum eius eum explicabo facere, impedit, inventore magnam maxime modi perferendis perspiciatis porro, quasi quibusdam sequi veritatis voluptatum. Dolor ducimus optio quo? Alias atque aut consequatur cumque dolor eaque esse eveniet exercitationem fugiat, iste laboriosam maxime molestias nisi nobis odio pariatur perferendis, placeat, porro provident quam quo ratione repellat reprehenderit repudiandae soluta temporibus tenetur. Ab error qui veniam voluptatem? At, deleniti distinctio, eligendi fuga ipsa magni maxime minus molestias natus neque pariatur, provident quibusdam quo repellendus suscipit. Asperiores delectus, enim hic id ipsa ipsam laboriosam magnam maxime natus obcaecati placeat rem sunt unde voluptate.</Text>
        </ScrollView>
        <Text></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});

export default TestScrolling;