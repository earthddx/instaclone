import { router } from "expo-router";
import AboutScreen from "../components/AboutScreen";

export default function About() {
  return <AboutScreen onBack={() => router.back()} />;
}
