import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";

export default function Create() {
  const [input, setInput] = React.useState({
    title: "",
    description: "",
    post: null
  })
  
  return (
    <SafeAreaView
      className="bg-primary-100 h-full"
      edges={["right", "top", "left"]}
    >
      <View>
        <Text>Create a post</Text>
      </View>
      <View>
        <ComponentButton title="Select..." onPress={}/>
      </View>
      <View>
        <ComponentInput placeholder="Title" onChangeText={}/>
      </View>
      <View>
        <ComponentInput placeholder="Description" onChangeText={}/>
      </View>
    </SafeAreaView>
  );
}
