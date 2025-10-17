import { TextInput, StyleSheet, TextInputProps } from "react-native";

export default function InputField(props: TextInputProps) {
  return <TextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: "100%",
  },
});
