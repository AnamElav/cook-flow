import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../index";

type InputScreenProps = NativeStackScreenProps<RootStackParamList, "Input">;

const InputScreen: React.FC<InputScreenProps> = ({ navigation }) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipe = async () => {
    if (!url) {
      Alert.alert("Error", "Please enter a valid URL!");
      return;
    }
    // http://127.0.0.1:5000/api/scrape
    setLoading(true);
    try {
      const response = await fetch("http://192.168.68.65:8000/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

    //   console.log("Response received:", response);

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        Alert.alert("Error", "Error fetching recipe!");
        return;
      }

      navigation.navigate("Recipe", { recipe: data });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while fetching the recipe!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Paste recipe link here"
        value={url}
        onChangeText={setUrl}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Fetch Recipe" onPress={fetchRecipe} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
});

export default InputScreen;
