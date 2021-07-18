import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import Voice from '@react-native-community/voice';
import axios from 'axios'
// import YoutubePlayer from "react-native-youtube-iframe";
// import Sound from 'react-native-sound';


import SoundPlayer from 'react-native-sound-player'
console.log("popping pockets")
try {
  // play the file tone.mp3
  console.log('in here??')
  // SoundPlayer.playSoundFile('track', 'mp3')//.then(res => console.log(res, '??'))
  // or play from url
  // SoundPlayer.playUrl('https://example.com/music.mp3')
} catch (e) {

  console.log(`cannot play the sound file`, e)
}




const App = () => {

  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rhymes, setRhymes] = useState([])
  const [rhymeOrigin, setRhymeOrigin] = useState("")
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
    startRecording()
  }, []);



  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    // startRecording()
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  const onSpeechStartHandler = (e) => {
    console.log("start handler==>>>", e)
  }
  const onSpeechEndHandler = (e) => {
    setIsLoading(false)
    console.log("stop handler", e)
  }

  const onSpeechResultsHandler = async (e) => {
    let text = e.value[0]

    let sentence = text.split(' ')
    setResult(sentence)
    let wordToRhyme = sentence[sentence.length - 1]
    setRhymeOrigin(wordToRhyme)
    console.log(wordToRhyme)

    setIsLoading(true)

    let res = await axios.get(`https://api.datamuse.com/words?rel_rhy=${wordToRhyme}&max=10`)

    console.log(res.data)
    setIsLoading(false)
    setRhymes(res.data)


  }

  const startRecording = async () => {
    setIsLoading(true)
    try {
      await Voice.start('en-Us')
      SoundPlayer.playSoundFile('track', 'mp3')

    } catch (error) {
      console.log("error raised", error)
    }
  }

  const stopRecording = async () => {
    try {
      await Voice.stop()
      SoundPlayer.stop()

    } catch (error) {
      console.log("error raised", error)
    }
  }
  const showRhymes = () => rhymes.map(rhyme => <Text style={{ textAlign: 'center' }} key={rhyme.word}>{rhyme.word}</Text>)


  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 25, marginBottom: 15 }}>
        FLOW {new Date().getTime()}
      </Text>
      <View>
        {/* <YoutubePlayer
          height={250}
          play={playing}
          videoId={"dACGECIf-wI"}
          onChangeState={onStateChange}
        /> */}
        <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
      </View>
      <SafeAreaView>
        <Text style={styles.headingText}>Drop some sick beats</Text>
        {/* <View style={styles.textInputStyle}> */}
        <TouchableOpacity
          onPress={startRecording}
          style={{ textAlign: 'center', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png' }}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
        {/* {isLoading ? <ActivityIndicator size="large" color="red" />

            :
            
            <TouchableOpacity
              onPress={startRecording}
            >
              <Image
                source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png' }}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>} */}

        {/* </View> */}
        <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', marginTop: 30 }}>Word: {rhymeOrigin}</Text>
        <View>{isLoading ? <Text>Loading...</Text> : showRhymes() || ""}</View>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 24,
            backgroundColor: 'red',
            padding: 8,
            borderRadius: 4
          }}
          onPress={stopRecording}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#CDCDCD',
    textAlign: 'center'
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26
  },
  textInputStyle: {
    textAlign: 'center',
    width: '100%',
  }
});

export default App;




