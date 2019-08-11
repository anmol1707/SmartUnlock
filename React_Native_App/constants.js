import {Dimensions} from 'react-native';

export const {height} = Dimensions.get('window');
const guidelineBaseHeight = 812;
const verticalScale = size => height / guidelineBaseHeight * size;

export {
    verticalScale
}
