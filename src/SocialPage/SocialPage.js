import React from 'react';
import {
  View, Text, Image, Linking, TouchableOpacity, Clipboard, Alert, StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import greenArrow from '../../content/green-arrow.png';
import fbImg from '../../content/social-icons/social-fb.png';
import instaImg from '../../content/social-icons/social-insta.png';
import tgImg from '../../content/social-icons/social-tg.png';
import vkImg from '../../content/social-icons/social-vk.png';
import patreonImg from '../../content/social-icons/money-patreon.png';
import yandexImg from '../../content/social-icons/money-yandex.png';
import ethImg from '../../content/social-icons/money-eth.png';
import btcImg from '../../content/social-icons/money-btc.png';

import { BLUE } from '../Colors/Colors';
import { path } from 'ramda';
import { withNavigation } from "react-navigation";
import { setMapType } from '../Reducers/map';

const fbUrl = 'https://www.facebook.com/n/?cleanpathapp';
const instaUrl = 'https://www.instagram.com/cleanpath.app';
const tgUrl = 'https://t.me/cleanpath';
const vkUrl = 'https://vk.com/cleanpath';
const patreonUrl = 'https://www.patreon.com/cleanpath';
const yandexUrl = 'https://money.yandex.ru/to/410019992394989';

const ethNo = '0xe09d86f742AC095b23926a2807cd1DF1425D8BE8';
const btcNo = '14j6GMJ1Ghfm3mm8LC5HKCti9q19PjHZDu';
const cpUrl = 'https://cleanpath.ru/';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  firstSocialRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 40
  },
  secondSocialRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 10,
  },
  socialImage: {
    height: 40,
    resizeMode: 'stretch',
    width: 40,
  },
  cpLinkHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  cpLink: {
    color: BLUE,
    fontSize: 18,
  },
  greenArrow: {
    height: 14,
    resizeMode: 'stretch',
    marginTop: 5,
    width: 14,
    marginLeft: 3
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center'
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
});

export const SocialImageLink = ({ url, imgSource }) => {
  if (url) {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Image style={styles.socialImage} source={imgSource} />
      </TouchableOpacity>
    );
  }
  return null;
};

export const CoinImage = ({ bufferData, imgSource }) => {
  const addToBuffer = () => {
    Clipboard.setString(bufferData);
    Alert.alert(
      'Номер кошелька сохранён',
      `Номер нашего кошелька (${bufferData}) сохранён в вашем буфере обмена`,
      [{ text: 'OK' }]
    );
  };

  if (bufferData) {
    return (
      <TouchableOpacity onPress={addToBuffer}>
        <Image style={styles.socialImage} source={imgSource} />
      </TouchableOpacity>
    );
  }
  return null;
};

class SocialPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Linking.openURL(cpUrl)}>
          <View style={styles.cpLinkHolder}>
            <Text style={styles.cpLink}>Перейти на cleanpath.ru</Text>
            <Image source={greenArrow} style={styles.greenArrow} />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.subHeader}>Мы в соцсетях</Text>
          <View style={styles.firstSocialRow}>
            <SocialImageLink url={`${instaUrl}`} imgSource={instaImg} />
            <SocialImageLink url={`${tgUrl}`} imgSource={tgImg} />
            <SocialImageLink url={`${vkUrl}`} imgSource={vkImg} />
            <SocialImageLink url={`${fbUrl}`} imgSource={fbImg} />
          </View>
          <Text style={styles.subHeader}>Поддержать проект</Text>
          <View style={styles.secondSocialRow}>
            <SocialImageLink url={`${patreonUrl}`} imgSource={patreonImg} />
            <SocialImageLink url={`${yandexUrl}`} imgSource={yandexImg} />
            <CoinImage bufferData={`${ethNo}`} imgSource={ethImg} />
            <CoinImage bufferData={`${btcNo}`} imgSource={btcImg} />
          </View>
        </View>
        <View>
          <Text style={styles.version}>{`Версия ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}</Text>
        </View>
      </View>
    );
  }
}

export default SocialPage;
