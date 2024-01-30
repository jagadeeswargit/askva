import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePicker } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { RNCamera } from 'react-native-camera';

const App = () => {
  const [image, setImage] = useState('')
  const [text, setText] = useState('')
  let [imgUrl, setImgUrl] = useState({})

  useEffect(() => {
    // launchCamera(options ?, callback);

    // // You can also use as a promise without 'callback':
    // const result = await launchCamera(options ?);


  }, [])

  const handleImg = () => {
    launchImageLibrary({}, setImgUrl)
  }


  const openCamera = () => {
    // launchCamera()
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Use the response.uri as the image source
        // setImage(response);
        setImgUrl(response)
      }

      console.log('==== response =====', response)
    });
  }

  useEffect(() => {
    console.log('imgUrl----->>>', imgUrl);
    if (imgUrl) {
      // let temp = imgUrl ? imgUrl?.assets[0]?.uri : ''
      console.log('====imgUrl====', imgUrl);
      // console.log('====temp====', temp);
      getText()
    }
  }, [imgUrl])


  const getText = async() => {
          const result = await TextRecognition.recognize(imgUrl?.assets[0]?.uri);
        console.log('===== result ======', result)
        setText(result)
  }


  // useEffect(() => {
  //   (async () => {
  //     if (image) {
  //       console.log('image', image)
  //       const result = await TextRecognition.recognize(image.assets[0].uri);
  //       console.log('===== result ======', result)
  //       setText(result)
  //     }
  //   })()
  // }, [image])
  return (
    <>
      <View>
        <Text>hello world!</Text>
        <TouchableOpacity
        style={{ padding: 20, backgroundColor: 'blue', margin: 60, display: 'flex', alignItems: 'center' }}
        onPress={() => handleImg()}>
          <Text>select image</Text>
        </TouchableOpacity>

        {
          text ? <Text>{'your Image text here ---->>>>>>'} {text}</Text> : null
        }

        <View>

          <TouchableOpacity style={{ padding: 20, backgroundColor: 'red', margin: 60, display: 'flex', alignItems: 'center' }} onPress={openCamera}>
            <Text>
              Open camera
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
};



const ExampleApp = () => {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* <RNCamera
        ref={cameraRef}
        // style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes);
        }}
      /> */}
      <View>
        <TouchableOpacity onPress={takePicture} >
          <Text> take Picture </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
