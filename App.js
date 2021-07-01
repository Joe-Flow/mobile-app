import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import Voice from '@react-native-community/voice';
import axios from 'axios'
import YoutubePlayer from "react-native-youtube-iframe";




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
    } catch (error) {
      console.log("error raised", error)
    }
  }

  const stopRecording = async () => {
    try {
      await Voice.stop()
    } catch (error) {
      console.log("error raised", error)
    }
  }
  const showRhymes = () => rhymes.map(rhyme => <Text key={rhyme.word}>{rhyme.word}</Text>)


  return (
    <View style={styles.container}>
      <View>
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={"dACGECIf-wI"}
          onChangeState={onStateChange}
        />
        <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
      </View>
      <SafeAreaView>
        <Text style={styles.headingText}>Speech Recognition</Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            placeholder="your text"
            style={{ flex: 1 }}
            onChangeText={text => setResult(text)}
          />
          {isLoading ? <ActivityIndicator size="large" color="red" />

            :
            
            <TouchableOpacity
              onPress={startRecording}
            >
              <Image
                source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png' }}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>}

        </View>
        <Text>Word: {rhymeOrigin}</Text>
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
    padding: 24
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 48,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4
  }
});

export default App;



// import { useEffect, useState } from 'react'
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import axios from 'axios'
// import './App.css';

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   let [loading, setIsLoading] = useState(false)
//   let [song, setSong] = useState('')
//   const [rhymes, setRhymes] = useState([])


//   const [result, setResult] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStartHandler;
//     Voice.onSpeechEnd = onSpeechEndHandler;
//     Voice.onSpeechResults = onSpeechResultsHandler;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     }
//   }, [])

//   const onSpeechStartHandler = (e) => {
//     console.log("start handler==>>>", e)
//   }
//   const onSpeechEndHandler = (e) => {
//     setIsLoading(false)
//     console.log("stop handler", e)
//   }

//   const onSpeechResultsHandler = (e) => {
//     let text = e.value[0]
//     setResult(text)
//     console.log("speech result handler", e)
//   }

//   const startRecording = async () => {
//     setIsLoading(true)
//     try {
//       await Voice.start('en-Us')
//     } catch (error) {
//       console.log("error raised", error)
//     }
//   }

//   const stopRecording = async () => {
//     try {
//       await Voice.stop()
//     } catch (error) {
//       console.log("error raised", error)
//     }
//   }


//   useEffect(async () => {
//     console.log(transcript, listening)
//     let tArr = transcript.split(' ')
//     let word = tArr[tArr.length - 1]


//     console.log(`serach for ${word}`)

//     // setSong(song += ' ' + transcript)

//     // (async function () {
    // setIsLoading(true)
//     //let res = await axios.get(`https://rhymebrain.com/talk?function=getRhymes&word=${word}&maxResults=10`)
//     //let res = await axios.get(`https://wordsapiv1.p.mashape.com/words/${word}/rhymes`)

    // let res = await axios.get(`https://api.datamuse.com/words?rel_rhy=${word}&max=10`)

    // console.log(res.data)
    // setIsLoading(false)
    // setRhymes(res.data)
//     // })()
//     console.log(SpeechRecognition, SpeechRecognition.listening)

//   }, [transcript])


//   useEffect(() => {
//     console.log("I am listening ", listening)
//     if (!listening) {
//       SpeechRecognition.startListening()
//       setSong(song += transcript + '<br />')
//     }
//   }, [listening])

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   const showSong = () => {
//     return { __html: song };
//   }

  // const showRhymes = () => rhymes.map(rhyme => <li key={rhyme.word}>{rhyme.word}</li>)

//   return (
//     <div>
//       <p>Microphone: {listening ? 'on' : 'off'}</p>
//       <button onClick={() => SpeechRecognition.startListening()}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={() => { resetTranscript(); setSong('') }}>Reset</button>
//       <p>Transcript: {transcript}</p>


//       <p dangerouslySetInnerHTML={showSong()}></p>

//       <ul>
        // {loading ? 'Loading...' : showRhymes()}
//       </ul>
//     </div>
//   );
// };
// export default Dictaphone;

