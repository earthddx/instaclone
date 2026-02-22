import { useNavigation } from "expo-router";
import AboutScreen from "../../../components/AboutScreen";

export default function About() {
  const navigation = useNavigation();
  return <AboutScreen onMenu={() => navigation.openDrawer()} />;
}
