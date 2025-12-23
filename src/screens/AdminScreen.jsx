import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import Dropdown from "../components/DropDown";
import { fetchGrowerNamesAndIDs, fetchLandIdDetails } from "../utils/apiService";
import { useToast } from 'react-native-toast-notifications';

const AdminScreen = ({ navigation }) => {
    const toast = useToast();
    const route = useRoute();
    const { userID } = route.params;
    const [fieldOverseerName, setFieldOverseerName] = useState("");
    const [growerNames, setGrowerNames] = useState([]);
    const [growerName, setGrowerName] = useState("");
    const [growerID, setGrowerID] = useState("");
    const [landID, setLandID] = useState("");
    const [filteredSlips, setFilteredSlips] = useState([]);
    const [filteredLandIDs, setFilteredLandIDs] = useState([]);
    const [slipID, setSlipID] = useState("");
    const [expectedWeight, setExpectedWeight] = useState("");
    const [transporterName, setTransporterName] = useState("");
    const [harvesterName, setHarvesterName] = useState("");

    const [growers, setGrowers] = useState([]);

    const handleSelect = (value) => {
        const [name, id] = value.split("_");
        setGrowerName(value);
        setGrowerID(id);
    }
    console.log(growerName, growerID)
    const getGrowers = async () => {
        try {
            const data = await fetchGrowerNamesAndIDs(userID);
            // console.log(data)
            setGrowers(data);
            const uniqueGrowerNames = [...new Set(data.map(g => g.GrowerName))];
            // console.log(uniqueGrowerNames);
            setGrowerNames(uniqueGrowerNames);
        } catch (error) {
            toast.show("Failed to fetch factory details.", { type: 'danger' });
        }
    };

    const getLandDetails = async () => {
        try {
            const data = await fetchLandIdDetails(growerID, landID);
            if (!data || data.length === 0) throw new Error("No data received");

            setFieldOverseerName(data[0].FieldOverseerName)
        } catch (error) {
            toast.show("Failed to fetch land details.", { type: 'danger' });
        }
    }

    useEffect(() => {
        if (landID) {
            getLandDetails();
        }
        getGrowers();
    }, [growerID, landID])

    useEffect(() => {

        if (growerID) {
            const loadLandIDs = async () => {
                if (growerID) {
                    const allLandIDs = growers.filter((g) => g.GrowerName === growerName).map((g) => g.LandID); // Get district names

                    setFilteredLandIDs(Array.from(new Set(allLandIDs)));
                    console.log("landids", allLandIDs)
                } else {
                    setFilteredLandIDs([]);
                }
            };

            loadLandIDs();
        }

        if (landID) {
            const loadSlipIDs = async () => {
                if (landID) {
                    const allSlips = growers.filter((g) => g.LandID === landID).map((g) => g.SlipID);

                    setFilteredSlips(Array.from(new Set(allSlips)));
                    console.log("all slips :", allSlips)
                } else {
                    setFilteredStates([]);
                }
            };

            loadSlipIDs();
        }

        if (slipID) {
            const loadSlipDetails = async () => {
                if (slipID) {
                    const slipDetails = growers.find((g) => g.SlipID === slipID)

                    setExpectedWeight(slipDetails.Tonnage);
                    setTransporterName(slipDetails.TransporterName);
                    setHarvesterName(slipDetails.HarvesterName)

                    console.log("slip details ;", slipDetails)
                }
            }
            loadSlipDetails();
        }
    }, [landID, growerID, slipID]);

    console.log("selected slip :", slipID)

    const handleNavigate = () => {
        if (growerID) {
            navigation.navigate("GrowerProfile", { growerID, userID, role: "admin" })
        }
        else {
            toast.show("Please select Grower Name.", { type: 'danger' });
        }

    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Grower Name Picker */}
            <Dropdown
                label="Select Grower Name"
                items={growerNames.map((GrowerName, index) => ({ label: GrowerName, value: GrowerName, key: index }))}
                placeholder="Select Grower Name"
                selectedValue={growerName}
                onSelect={handleSelect}
            />

            {/* ShowDetails Button */}
            <CustomButton title="Show Details" onPress={handleNavigate} />

            {/* Land ID Picker */}
            <Dropdown
                label="Select Land ID"
                items={filteredLandIDs.map((landnumber) => ({ label: "Land ID__" + landnumber, value: landnumber }))}
                placeholder="Select Land ID"
                selectedValue={landID}
                onSelect={setLandID}
            />

            {/* Field Overseer Name */}
            <InputField
                label="Field Overseer Name"
                placeholder="Field Overseer Name"
                value={fieldOverseerName}
                onChangeText={setFieldOverseerName}
                editable={false}
            />

            {/* Slip ID Picker */}
            <Dropdown
                label="Select Slip ID"
                items={filteredSlips.map((slipName) => ({ label: "Slip ID__" + slipName, value: slipName }))}
                placeholder="Select Slip ID"
                selectedValue={slipID}
                onSelect={setSlipID}
            />

            {/* Expected Weight/Tonnage */}
            <InputField
                label="Expected Weight/Tonnage"
                placeholder="Expected Weight"
                value={expectedWeight}
                onChangeText={setExpectedWeight}
            />

            {/* Transporter Name */}
            <InputField
                label="Transporter Name"
                placeholder="Enter Transporter Name"
                value={transporterName}
                onChangeText={setTransporterName}
            />

            {/* Harvester Name */}
            <InputField
                label="Harvester Name"
                placeholder="Enter Harvester Name"
                value={harvesterName}
                onChangeText={setHarvesterName}
            />

        </ScrollView>
    );
}

export default AdminScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
});