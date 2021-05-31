import React from 'react';
import RadialGradient from 'react-native-radial-gradient';
import Colors from '../constants/Colors';

const RadialGradientLayout = () => {
  return (
    <>
      <RadialGradient
        pointerEvents={'none'}
        style={{width: 600, height: 600, position: 'absolute', top: -270, left: -270, opacity: 0.3}}
        colors={[Colors.secondColor, Colors.second_bg + '00', Colors.second_bg + '00', Colors.second_bg + '00']}
        stops={[0.1, 0.4, 0.3, 0.75]}
        center={[300, 300]}
        radius={740} />
      <RadialGradient
        pointerEvents={'none'}
        style={{width: 600, height: 600, position: 'absolute', bottom: -270, right: -270, opacity: 0.3}}
        colors={[Colors.thirdColor, Colors.second_bg + '00', Colors.second_bg + '00']}
        stops={[0, 0.3, 1]}
        center={[300, 300]}
        radius={740} />
    </>
  );
}


export default RadialGradientLayout;
