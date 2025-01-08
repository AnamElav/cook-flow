import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Modal, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import { useCallback } from "react";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
// import Voice from "@react-native-voice/voice";
import { summarizeStep } from "../utils/summarizeStep";
import { RootStackParamList } from "..";

/*
 * TODO:
 */

type RecipeScreenProps = NativeStackScreenProps<RootStackParamList, "Recipe">;

const RecipeScreen: React.FC<RecipeScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [simplifiedSteps, setSimplifiedSteps] = useState<string[]>([]);
  const [ingredientsVisible, setIngredientsVisible] = useState(false);
  const [audioMode, setAudioMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // useEffect(() => {
  //   Voice.onSpeechResults = onSpeechResults;
  //   Voice.onSpeechError = onSpeechError;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  // const startListening = async () => {
  //   try {
  //     await Voice.start("en-US");
  //     setIsListening(true);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //     setIsListening(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const onSpeechResults = (event: any) => {
  //   const spokenWords = event.value[0].toLowerCase(); // First recognized word/phrase
  //   if (spokenWords.includes("next")) {
  //     nextStep();
  //   } else if (spokenWords.includes("previous")) {
  //     prevStep();
  //   }
  // };

  // const onSpeechError = (event: any) => {
  //   console.error("Speech error:", event.error);
  // };

  useEffect(() => {
    const processSteps = async () => {
      try {
        // Summarize each step using OpenAI
        const summarized = await Promise.all(
          recipe.steps.map((step) => summarizeStep(step, recipe.ingredients))
        );
        setSimplifiedSteps(summarized);
      } catch (error) {
        console.error("Error processing steps:", error);
        setSimplifiedSteps(recipe.steps); // Fallback to original steps
      }
    };

    processSteps();
  }, [recipe.steps, recipe.ingredients]);

  const nextStep = () => {
    if (currentStep < simplifiedSteps.length - 1) {
      if (audioMode) {
        speakStep(currentStep + 1);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      if (audioMode) {
        speakStep(currentStep - 1);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleAudioMode = async () => {
    const newAudioMode = !audioMode;
    setAudioMode(newAudioMode);

    if (newAudioMode) {
      // Configure audio settings to play even if ringer mode is off
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Enable playback in silent mode
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      speakStep(currentStep);
    } else {
      // Reset audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
      });
    }
  };

  const speakStep = (step: number) => {
    Speech.stop();
    Speech.speak(recipe.steps[step]);
  };

  // Stop audio when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Button
        title="Show Ingredients"
        onPress={() => setIngredientsVisible(true)}
      />
      <Text style={styles.step}>
        {simplifiedSteps.length > 0
          ? simplifiedSteps[currentStep]
          : "Loading..."}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Previous"
          onPress={prevStep}
          disabled={currentStep === 0}
        />
        <Button
          title="Next"
          onPress={nextStep}
          disabled={currentStep === simplifiedSteps.length - 1}
        />
      </View>
      <Button title="Restart" onPress={() => navigation.navigate("Input")} />
      <Button
        title={audioMode ? "Disable Audio Mode" : "Enable Audio Mode"}
        onPress={toggleAudioMode}
      />
      <Button
        title="Start Voice Commands"
        // onPress={isListening ? stopListening : startListening}
      />
      <Modal visible={ingredientsVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.title}>Ingredients</Text>
          <FlatList
            data={recipe.ingredients}
            renderItem={({ item }) => (
              // <Text style={styles.ingredient}>{he.decode(item)}</Text>
              <Text style={styles.ingredient}>{decodeURIComponent(item)}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button title="Close" onPress={() => setIngredientsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  step: { fontSize: 18, marginVertical: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  modal: { flex: 1, padding: 20, justifyContent: "center" },
  ingredient: { fontSize: 16, marginVertical: 5 },
});

export default RecipeScreen;
