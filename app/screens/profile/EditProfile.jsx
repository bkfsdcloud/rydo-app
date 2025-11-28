import BottomPanel from "@/app/component/BottomPanel";
import AuthContext from "@/app/context/AuthContext";
import { updateUser } from "@/scripts/api/userApi";
import { commonStyles } from "@/scripts/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name);
  const [gender, setGender] = useState(user?.gender || "Male");
  const [dob, setDob] = useState(
    moment(user?.dateOfBirth || new Date(), "YYYY-MM-DD").toDate()
  );
  const [email, setEmail] = useState(user?.email || "");
  const sheetRef = useRef(null);

  const update = async () => {
    if (!name) {
      Alert.alert("Info", "Name should not be blank");
      return;
    }
    if (!dob) {
      Alert.alert("Info", "Date of Birth not should be blank");
      return;
    }
    const dobString = moment(dob).format("YYYY-MM-DD");
    const body = {
      name: name,
      email: email,
      gender: gender,
      dateOfBirth: dobString,
    };
    const response = await updateUser(body);
    if (response?.data?.user) {
      setUser({ ...user, name, email, gender, dateOfBirth: dobString });
      Alert.alert("Info", response?.data?.message);
    }
  };

  return (
    <>
      <View style={styles.content}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          autoCorrect={false}
          placeholder={"Name"}
          placeholderTextColor={"grey"}
          style={commonStyles.inputWhite}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {["Male", "Female", "Others"].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              style={[
                styles.genderOption,
                gender === g && styles.genderOptionSelected,
              ]}
            >
              <View style={styles.radioOuter}>
                {gender === g && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.genderText}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>DOB</Text>
        <TextInput
          value={dob ? moment(dob).format("DD-MM-YYYY") : ""}
          placeholder={"DOB"}
          placeholderTextColor={"grey"}
          editable={false}
          onPress={() => {
            sheetRef.current?.snapToIndex(0);
          }}
          style={{
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: "center",
          }}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={commonStyles.inputWhite}
          autoCorrect={false}
          placeholder="Email ID"
          placeholderTextColor={"grey"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={[commonStyles.row, { marginTop: 10 }]}>
          <TouchableOpacity style={commonStyles.button} onPress={update}>
            <Text style={commonStyles.buttonText}>Save & Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomPanel
        ref={sheetRef}
        title={" "}
        dynamicSizing={false}
        index={-1}
        snapPoints={["55%"]}
        enablePanClose={true}
        onClose={() => sheetRef.current?.close()}
      >
        <DateTimePicker
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === "ios" ? "inline" : "inline"}
          value={dob}
          collapsable={true}
          onChange={(event, selected) => {
            // sheetRef.current?.close();
            setDob(selected);
          }}
        />
      </BottomPanel>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: { position: "absolute", left: 16, top: 16, padding: 8 },
  backText: { fontSize: 20, color: "#333" },
  title: { fontSize: 18, fontWeight: "600" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: { fontSize: 12, color: "#6b6b6b", marginTop: 12, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  genderRow: { flexDirection: "row", marginTop: 6, marginBottom: 8 },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#fff",
    minWidth: 110,
  },
  genderOptionSelected: {
    borderColor: "#e5e5e5",
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e74c3c",
  },
  genderText: { fontSize: 14, color: "#333" },
  button: {
    marginTop: 18,
    backgroundColor: "#000",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
