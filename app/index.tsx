import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InputScreen from "./components/InputScreen";
import RecipeScreen from "./components/RecipeScreen";

// Parameter list for stack navigator
export type RootStackParamList = {
  Input: undefined;
  Recipe: { recipe: { title: string; ingredients: string[]; steps: string[] } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
      <Stack.Navigator initialRouteName="Input">
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Recipe" component={RecipeScreen} />
      </Stack.Navigator>
  );
};

export default App;
