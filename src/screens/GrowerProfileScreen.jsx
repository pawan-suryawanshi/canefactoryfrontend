import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import ConfirmationModal from "../components/ConfirmationModal";
import Dropdown from "../components/DropDown";
import { fetchRegions, fetchGrowerDetails, updateGrowerDetails } from "../utils/apiService";
import { useRoute } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import config from "../config/config";

const IP_ADDRESS = config.IP_ADDRESS;

const GrowerProfileScreen = ({ navigation }) => {
    const toast = useToast();
    const route = useRoute();
    const { growerID, userID, role } = route.params || {};
    const [seasonList, setSeasonList] = useState([]);
    const [photo, setPhotoText] = useState(null);
    const [season, setSeason] = useState("");
    const [seasonStart, setSeasonStart] = useState("");
    const [seasonEnd, setSeasonEnd] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [taluka, setTaluka] = useState('');
    const [village, setVillage] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [pinCode, setPinCode] = useState("");
    const [regions, setRegions] = useState([]);
    const [filteredTalukas, setFilteredTalukas] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);

    // ------------------------------------------
    // ⭐ Generate Cropping Season
    // ------------------------------------------
    const generateSeason = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Jan = 1

        let s, e;

        if (month >= 4) {
            // April → next year
            s = year;
            e = year + 1;
        } else {
            // Jan–Mar → previous season
            s = year - 1;
            e = year;
        }

        const seasonStr = `${s}-${e.toString().slice(-2)}`;

        setSeason(seasonStr);
        setSeasonStart(`${s}-04-01`);
        setSeasonEnd(`${e}-03-31`);
    };

    // Create season list for dropdown: next 5 seasons
    const generateSeasonList = () => {
        const date = new Date();
        const year = date.getFullYear();
        let seasons = [];

        for (let i = 0; i < 5; i++) {
            let s = year + i;
            let e = s + 1;
            seasons.push(`${s}-${e.toString().slice(-2)}`);
        }
        setSeasonList(seasons);
    };

    // Run on load
    useEffect(() => {
        generateSeason();
        generateSeasonList();
    }, []);

    // Load region data + grower details
    useEffect(() => {
        const loadRegions = async () => {
            try {
                const data = await fetchRegions();
                setRegions(data);
            } catch (error) {
                toast.show("Unable to fetch region details.", { type: 'danger' });
            }
        };

        const loadGrowerData = async () => {
            if (growerID) {
                let id = toast.show("Loading...");
                try {
                    const data = await fetchGrowerDetails(growerID);

                    setFullName(data[0].FullName);
                    setAddress(data[0].Grower_Address);
                    setVillage(data[0].Village);
                    setTaluka(data[0].Taluka);
                    setDistrict(data[0].District);
                    setState(data[0].State);
                    setPinCode(data[0].PinCode);
                    setPhotoText(data[0].PhotoUrl);

                    // Update season info
                    setSeason(data[0].season);
                   setSeasonStart(data[0].seasonStart?.split("T")[0]);
                   setSeasonEnd(data[0].seasonEnd?.split("T")[0]);
                } catch {
                    toast.show("Failed to fetch data", { type: 'danger' });
                }
                finally {
                    toast.hide(id);
                }
            }
        };

        loadRegions();
        loadGrowerData();
    }, []);

    // Filter Taluka list
    useEffect(() => {
        if (regions.length > 0) {
            const allTalukas = regions.map(g => g.Taluka);
            setFilteredTalukas([...new Set(allTalukas)]);
        }
    }, [regions]);

    // Filter Districts when Taluka changes
    useEffect(() => {
        if (taluka) {
            const allDistricts = regions
                .filter(g => g.Taluka === taluka)
                .map(g => g.District);

            setFilteredDistricts([...new Set(allDistricts)]);
        } else {
            setFilteredDistricts([]);
        }
    }, [taluka]);

    // Filter States when District changes
    useEffect(() => {
        if (district) {
            const allStates = regions
                .filter(g => g.District === district)
                .map(g => g.State);

            setFilteredStates([...new Set(allStates)]);
        } else {
            setFilteredStates([]);
        }
    }, [district]);

    // Image Picker
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            try {
                const base64Photo = await FileSystem.readAsStringAsync(
                    result.assets[0].uri,
                    { encoding: FileSystem.EncodingType.Base64 }
                );

                setPhotoText(base64Photo);
                toast.show("Photo saved!", { type: 'normal' });
            } catch (error) {
                toast.show("Image processing failed.", { type: 'danger' });
            }
        }
    };

    // Build Server Payload
    const buildPayload = () => ({
        fullName,
        address,
        village,
        taluka,
        district,
        state,
        pinCode,
        photo,
        season,
        seasonStart,
        seasonEnd,
        seasonDate: new Date(),
    });

    const clearFormData = () => {
    setFullName("");
    setAddress("");
    setVillage("");
    setTaluka("");
    setDistrict("");
    setState("");
    setPinCode("");
    setPhotoText("");

    // Regenerate valid season
    generateSeason(); 
};


    // Submit Data
    const handleSubmit = async () => {
        if (!fullName || !address || !village || !taluka || !district || !state || !pinCode || !photo || !season|| !seasonStart || !seasonEnd) {
            toast.show("Complete all fields before submitting.", { type: 'danger' });
            return;
        }

        let id = toast.show("Saving...");

        try {
            const payload = buildPayload();

            const response = await fetch(`${IP_ADDRESS}/api/grower/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Submission failed");

            const data = await response.json();
            toast.show("Grower Details Submitted!", { type: 'success' });

            navigation.navigate("GrowerLandDetails", { growerID: data.growerID });
        } catch {
            toast.show("Submission failed!", { type: 'danger' });
        }
        finally {
            clearFormData();
            toast.hide(id);
        }
    };

    // Update Data
    const handleUpdate = async () => {
        let id = toast.show("Updating...");

        try {
            const payload = buildPayload();
            const data = await updateGrowerDetails(growerID, payload);

            toast.update(id, "Updated Successfully!", { type: "success" });

            navigation.navigate(role === "admin" ? "Admin" : "FieldOverseer", { userID });
        } catch {
            toast.show("Update failed!", { type: 'danger' });
        }
        finally {
            clearFormData();
            toast.hide(id);
        }
    };

    const handleConfirm = () => {
        growerID ? handleUpdate() : handleSubmit();
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Photo Picker */}
                <View style={styles.photoContainer}>
                    {photo ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${photo}` }}
                            style={styles.photo}
                        />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons style={styles.photoPlaceholderText} name="person" color="black" />
                        </View>
                    )}

                    <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                        <FontAwesome6 style={styles.cameraImage} name="camera" />
                        <Text style={styles.photoButtonText}>Take/Upload Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Season Dropdown */}
                <Dropdown
                    label="Season / हंगाम"
                    items={seasonList.map((x, i) => ({ label: x, value: x, key: i.toString() }))}
                    placeholder="Select Season"
                    selectedValue={season}
                    onSelect={(value) => {
                        setSeason(value);
                        const s = value.split("-")[0];
                        const e = "20" + value.split("-")[1];
                        setSeasonStart(`${s}-04-01`);
                        setSeasonEnd(`${e}-03-31`);
                    }}
                />

                {/* Season Dates */}
                <InputField label="Season Start" value={seasonStart} editable={false} />
                <InputField label="Season End" value={seasonEnd} editable={false} />

                {/* Grower Full Name */}
                <InputField
                    label="Grower Full Name / पूर्ण नाव"
                    placeholder="Enter Your Name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                {/* Grower Address */}
                <InputField
                    label="Address / पत्ता"
                    placeholder="Enter Your Address"
                    value={address}
                    onChangeText={setAddress}
                />

                {/* Village */}
                <InputField
                    label="Village / गांव"
                    placeholder="Enter Your Village"
                    value={village}
                    onChangeText={setVillage}
                />

                {/* Taluka */}
                <Dropdown
                    label="Taluka / तालुका"
                    items={filteredTalukas.map((t, i) => ({ label: t, value: t, key: i.toString() }))}
                    placeholder="Select Taluka"
                    selectedValue={taluka}
                    onSelect={setTaluka}
                />

                {/* District */}
                <Dropdown
                    label="District / जिल्हा"
                    items={filteredDistricts.map((d, i) => ({ label: d, value: d, key: i.toString() }))}
                    placeholder="Select District"
                    selectedValue={district}
                    onSelect={setDistrict}
                />

                {/* State */}
                <Dropdown
                    label="State / राज्य"
                    items={filteredStates.map((s, i) => ({ label: s, value: s, key: i.toString() }))}
                    placeholder="Select State"
                    selectedValue={state}
                    onSelect={setState}
                />

                {/* Pin Code */}
                <InputField
                    label="Pin Code / पिन कोड"
                    placeholder="Enter 6-digit code"
                    value={pinCode}
                    onChangeText={setPinCode}
                    maxLength={6}
                    keyboardType="numeric"
                />

                <CustomButton title={growerID ? "Update" : "Submit"} onPress={() => setModalVisible(true)} />

                <ConfirmationModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleConfirm}
                    title="Confirm Submission"
                    message="Are you sure you want to submit?"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default GrowerProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    photoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    photo: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: "#ddd",
    },
    photoPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    photoPlaceholderText: {
        color: "#aaa",
        fontSize: 45,
    },
    photoButton: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    cameraImage: {
        color: "#fff",
        fontSize: 18,
    },
    photoButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
