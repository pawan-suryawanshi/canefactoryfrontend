import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import CustomButton from "../components/CustomButton";
import ConfirmationModal from "../components/ConfirmationModal";
import InputField from "../components/InputField";
import Dropdown from "../components/DropDown";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Location from "expo-location";
import { getCoordinates, getUserLocation, calculateDistance, getDistanceFromAI } from "../utils/locationUtils";
import { fetchLandIDs, fetchFactories, fetchFieldOverseers } from "../utils/apiService";
import { useToast } from 'react-native-toast-notifications';
import config from "../config/config"; 

const IP_ADDRESS = config.IP_ADDRESS; 

const GenerateSlip = ({ navigation }) => {
    const toast = useToast();
    const route = useRoute();
    const { userID, growerID, growerName } = route.params;
    // const [growerID, setGrowerID] = useState("");
    const [growers, setGrowers] = useState([]);
    const [fieldOverseers, setFieldOverseers] = useState([]);
    const [fieldOverseerName, setFieldOverseerName] = useState("");
    const [landIDs, setLandIDs] = useState([]);
    const [landID, setLandID] = useState("");
    const [tonnage, setTonnage] = useState(null);
    const [transporterName, setTransporterName] = useState("");
    const [harvesterName, setHarvesterName] = useState("");
    const [factories, setFactories] = useState([]);
    const [factoryName, setFactoryName] = useState("");
    const [distance, setDistance] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [coordinatesCache, setCoordinatesCache] = useState({});
    const [userCoords, setUserCoords] = useState(null);

    useEffect(() => {
        (async () => {
            const coords = await getUserLocation();
            if (coords) setUserCoords(coords);
        })();
    }, []);

    useEffect(() => {

        const getFieldOverseers = async () => {
            let id = toast.show("Loading...");
            try {
                const data = await fetchFieldOverseers();
                console.log(data)
                setFieldOverseers(data);
                const overseer = data.find((g) => g.UserID === userID);
                if (overseer) {
                    setFieldOverseerName(overseer.FieldOverseerName);
                } else {
                    toast.show("Field overseer not found.", { type: 'danger' });
                }
            } catch (error) {
                toast.show("Unable to fetch fetch Overseers details.", { type: 'danger' });

            }
            finally {
                toast.hide(id);
            }
        };

        const getFactories = async () => {
            let id = toast.show("Loading...");
            try {
                const data = await fetchFactories(userID);
                console.log(data)
                setFactories(data);
            } catch (error) {
                toast.show("Unable to fetch factory details.", { type: 'danger' });

            }
            finally {
                toast.hide(id);
            }
        }

        getFactories();

        getFieldOverseers();
    }, []);

    useEffect(() => {
        if (growerID) {
            const loadLandIDs = async () => {
                let id = toast.show("Loading...");
                try {
                    const data = await fetchLandIDs(growerID);
                    { data && setLandIDs(data); }
                } catch (error) {
                    Alert.alert("Error", "Failed to fetch land details.");
                }
                finally {
                    toast.hide(id);
                }
            };

            loadLandIDs();
        }
    }, []);

    const handleFactorySelection = async (selectedFactory) => {
        setFactoryName(selectedFactory);
        if (!selectedFactory) return;

        const factoryDetails = factories.find((g) => g.FactoryName === selectedFactory);
        if (!factoryDetails) return;
        let id = toast.show("Loading...");
        try {
            const factoryCoords = await getCoordinates(factoryDetails.FactoryAddress);
            console.log("factory coords:", factoryCoords)
            console.log("user coords:", userCoords)
            if (!factoryCoords || !userCoords) return;

            const aiDistance = await getDistanceFromAI(userCoords, factoryCoords);

            if (aiDistance) {
                setDistance(aiDistance);
            } else {
                console.log("Using fallback Haversine distance");
                throw new Error("No such address is found");
            }
        } catch (error) {
            toast.show("Error calculating distance.", { type: 'danger' });
        }
        finally {
            toast.hide(id);
        }
    };

    const buildPayload = (fieldOverseerName, growerName, growerID, landID, tonnage, transporterName, harvesterName, factoryName, distance) => ({
        fieldOverseerName,
        growerName,
        growerID: parseInt(growerID),
        landID,
        tonnage,
        transporterName,
        harvesterName,
        factoryName,
        distance: distance.toString(),
    });

    const clearFormData = () => {
        setLandID("");
        setTonnage("");
        setTransporterName("");
        setHarvesterName("");
        setFactoryName("");
        setDistance("");
    };

    const handleSubmit = async () => {

        const payload = buildPayload(fieldOverseerName, growerName, growerID, landID, tonnage, transporterName, harvesterName, factoryName, distance);

        if (!fieldOverseerName || !growerName || !growerID || !landID || !tonnage || !transporterName || !harvesterName || !factoryName || !distance) {
            toast.show("Complete all fields before submitting.", { type: 'danger' });
            return;
        }
        let id = toast.show("Loading...");
        try {
            const response = await fetch(`${IP_ADDRESS}/api/slip-details/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON payload
                    },
                    body: JSON.stringify(payload), // Send payload as JSON
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add slip details.");
            }

            const data = await response.json();
            console.log("Response Data:", data);
            toast.show("Slip details added successfully!", { type: 'success' });

            // clearFormData();
        } catch (error) {
            console.error("Error:", error);
            toast.show("Failed to add slip details.", { type: 'danger' });
        }
        finally {
            clearFormData();
            toast.hide(id);
        }

        console.log("Confirmed! Submitting data...");

    };

    const handleOpenModal = () => setModalVisible(true);
    const handleCloseModal = () => setModalVisible(false);

    const handleConfirm = () => {
        handleSubmit();
        setModalVisible(false);
        console.log("Confirmed! Submitting data...");

    };

    const handleExport = async () => {
        const payload = buildPayload(fieldOverseerName, growerName, growerID, landID, tonnage, transporterName, harvesterName, factoryName, distance);

        if (!fieldOverseerName || !growerName || !growerID || !landID || !tonnage || !transporterName || !harvesterName || !factoryName || !distance) {
            toast.show("Complete all fields before exporting.", { type: 'danger' });
            return;
        }
        let id = toast.show("Exporting...");
        try {
            // Generate HTML for the PDF
            const htmlContent = `
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { text-align: center; color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f4f4f4; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h1 style="text-align: center;">Slip Details</h1>
                    <p><strong>Field Overseer Name:</strong> ${fieldOverseerName}</p>
                    <p><strong>Grower Name:</strong> ${growerName}</p>
                    <p><strong>Land ID:</strong> ${landID}</p>
                    <p><strong>Added Tonnage:</strong> ${tonnage}</p>
                    <p><strong>Transporter Name:</strong> ${transporterName}</p>
                    <p><strong>Harvester Name:</strong> ${harvesterName}</p>
                    <p><strong>Factory Name:</strong> ${factoryName}</p>
                    <p><strong>Distance:</strong> ${distance}</p>
                </body>
                </html>
            `;

            // Create the PDF
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Share the PDF
            await Sharing.shareAsync(uri);
            console.log('PDF shared:', uri);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.show("PDF export failed.", { type: 'danger' });
        }
        finally {
            toast.hide(id);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Field Overseer Name */}
            <InputField
                label="Field Overseer Name"
                placeholder="Field Overseer Name"
                value={fieldOverseerName}
                onChangeText={setFieldOverseerName}
                editable={false}
            />

            {/* Grower Name Picker */}
            <InputField
                label="Grower Full Name"
                placeholder="Grower's Full Name"
                value={growerName}
                editable={false}
            />

            {/* Land ID Picker */}
            <Dropdown
                label="Select Land ID"
                items={landIDs.map((g) => ({ label: "Grower Land ID__" + g.LandID, value: g.LandID, key: g.LandID }))}
                placeholder="Select Land ID"
                selectedValue={landID}
                onSelect={setLandID}
            />

            {/* Add Tonnage */}
            <InputField
                label="Add Tonnage"
                placeholder="Add Tonnage"
                value={tonnage}
                onChangeText={setTonnage}
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

            {/* Select Factory Name */}
            <Dropdown
                label="Factory Name"
                items={factories.map((g) => ({ label: g.FactoryName, value: g.FactoryName, key: g.FactoryID }))}
                placeholder="Select Factory Name"
                selectedValue={factoryName}
                // onSelect={setFactory}
                onSelect={handleFactorySelection}
            />

            {/* Distance of Land from Factory (KM) */}
            <InputField
                label="Distance of Land from Factory (KM)"
                placeholder="Distance"
                value={distance ? `${distance}` : ""}
                editable={false}
            />


            {/* Submit Button */}
            <CustomButton title="Export As PDF" onPress={handleExport} />
            <CustomButton title="Generate Slip" onPress={handleOpenModal} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title="Generate Slip"
                message="Would you like to add more?"
            />
        </ScrollView>
    );
};

export default GenerateSlip;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
});

