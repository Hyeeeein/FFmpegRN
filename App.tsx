/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {FFmpegKit} from 'ffmpeg-kit-react-native';
import React, {useRef, useState} from 'react';
import {
  Button,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Video, {OnProgressData} from 'react-native-video';

function App(): JSX.Element {
  const [originVideoData, setOriginVideoData] = useState<Asset | null>();
  const [convertVideoUri, setConvertVideoUri] = useState('');
  const [videoTime, setVideoTime] = useState(0);
  const [extractImage, setExtractImage] = useState('');
  const videoPlayer = useRef(null);

  // 원본
  const media = async () => {
    const permission = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    if (permission) {
      const result = await launchImageLibrary({
        mediaType: 'video',
      });

      if (result.didCancel) return null;

      const videoData = result.assets ? result.assets[0] : null;

      console.log('videoData', videoData);

      videoData && setOriginVideoData(videoData);
    }
  };

  // 변환
  const convert = () => {
    if (originVideoData) {
      const convertPath = `file:///data/user/0/com.ffmpeg/cache/${
        'convert_' + originVideoData.fileName
      }`;
      const command = `-i ${originVideoData.uri} -s 1280x720 -c:a copy ${convertPath}`;

      FFmpegKit.execute(command).then(async session => {
        setConvertVideoUri(convertPath);
      });
    }
  };

  // 추출
  const extract = () => {
    if (originVideoData && videoTime) {
      let convertTime: any = videoTime.toFixed(2).split('.');
      convertTime = `00:${
        convertTime[0].length === 1 ? '0' + convertTime[0] : convertTime[0]
      }`;

      const imagePath = `file:///data/user/0/com.ffmpeg/cache/${
        'extract_' +
        Math.random() * 1000 +
        originVideoData.fileName?.split('.mp4')[0]
      }.jpg`;
      const command = `-ss ${convertTime} -i ${originVideoData.uri} -frames:v 1 -q:v 2 ${imagePath}`;

      FFmpegKit.execute(command).then(async session => {
        setExtractImage(imagePath);
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 원본 */}
      <View style={styles.contentContainer}>
        {originVideoData?.uri && (
          <Video
            source={{uri: originVideoData.uri}}
            ref={videoPlayer}
            resizeMode="contain"
            style={styles.video}
            repeat
            onProgress={(data: OnProgressData) => {
              setVideoTime(data.currentTime);
            }}
          />
        )}
      </View>

      {/* 변환 */}
      <View style={styles.contentContainer}>
        {convertVideoUri && (
          <Video
            source={{uri: convertVideoUri}}
            ref={videoPlayer}
            resizeMode="contain"
            style={styles.video}
            repeat
          />
        )}
      </View>

      {/* 추출 */}
      <View style={styles.contentContainer}>
        {extractImage && (
          <Image source={{uri: extractImage}} style={styles.image} />
        )}
      </View>

      <Button title="동영상 선택" onPress={media} />
      <Button title="변환" onPress={convert} />
      <Button title="이미지 추출" onPress={extract} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
