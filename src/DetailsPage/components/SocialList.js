import React from 'react';
import {
  Image,
  Linking,
  Platform,
  TouchableOpacity as RNTouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import fbImage from '../../../content/social-icons/social-fb.png';
import phoneImage from '../../../content/social-icons/social-phone.png';
import vkImage from '../../../content/social-icons/social-vk.png';
import instaImage from '../../../content/social-icons/social-insta.png';
import webImage from '../../../content/social-icons/social-web.png';

const TouchableOpacity = Platform.select({
  ios: () => RNTouchableOpacity,
  android: () => GHTouchableOpacity,
})();

const styles = StyleSheet.create({
  socialImage: {
    height: 40,
    width: 40,
    marginRight: 10
  },
  socialLine: {
    marginTop: 10,
    marginBottom: 5,
    height: 40,
    flexDirection: 'row'
  },
});

export const SocialLink = ({ url, imgSource, isPhone }) => {
  const openUrl = () => {
    const formattedUrl = isPhone ? `tel:${url}` : url;
    Linking.openURL(formattedUrl);
  };

  if (url && Linking.canOpenURL(url)) {
    return (
      <TouchableOpacity onPress={ openUrl }>
        <Image style={styles.socialImage} source={imgSource} />
      </TouchableOpacity>
    );
  }
  return null;
};

export default ({
  facebook,
  website,
  phone,
  vk,
  instagram
}) => (
  <View style={styles.socialLine}>
    {facebook ? <SocialLink url={`${facebook}`} imgSource={fbImage} /> : null}
    {instagram ? <SocialLink url={`${instagram}`} imgSource={instaImage} /> : null}
    {vk ? <SocialLink url={`${vk}`} imgSource={vkImage} /> : null}
    {website ? <SocialLink url={`${website}`} imgSource={webImage} /> : null}
    {phone ? <SocialLink url={`${phone}`} imgSource={phoneImage} isPhone={true} /> : null}
  </View>
);
