import React from 'react';
import RadialGradient from 'react-native-radial-gradient';
import Colors from '../constants/Colors';

const RadialGradientLayout = () => {
  return (
    <>
      <RadialGradient
        style={{width: 600, height: 600, position: 'absolute', top: -250, left: -250, opacity: 0.3}}
        colors={[Colors.secondColor, Colors.second_bg, Colors.second_bg + '00', Colors.second_bg + '00']}
        stops={[0.1, 0.4, 0.3, 0.75]}
        center={[300, 300]}
        radius={600} />
      <RadialGradient
        style={{width: 600, height: 600, position: 'absolute', bottom: -250, right: -250, opacity: 0.4}}
        colors={[Colors.thirdColor, Colors.second_bg, Colors.second_bg + '00', Colors.second_bg + '00']}
        stops={[0.1, 0.4, 0.3, 0.75]}
        center={[300, 300]}
        radius={600} />
    </>
  );
}


export default RadialGradientLayout;
