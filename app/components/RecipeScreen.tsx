import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Modal, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "..";

type RecipeScreenProps = NativeStackScreenProps<RootStackParamList, "Recipe">;

const RecipeScreen: React.FC<RecipeScreenProps> = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [ingredientsVisible, setIngredientsVisible] = useState<boolean>(false);

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Button
        title="Show Ingredients"
        onPress={() => setIngredientsVisible(true)}
      />
      <Text style={styles.step}>{recipe.steps[currentStep]}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Previous"
          onPress={prevStep}
          disabled={currentStep === 0}
        />
        <Button
          title="Next"
          onPress={nextStep}
          disabled={currentStep === recipe.steps.length - 1}
        />
      </View>
      <Button title="Restart" onPress={() => navigation.navigate("Input")} />

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
