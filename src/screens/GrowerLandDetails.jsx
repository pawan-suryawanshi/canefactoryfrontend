import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { pickPhoto, calculateLandArea } from "../utils/landUtils";
import { useRoute } from '@react-navigation/native';
import LandPhotos from "../components/LandPhotos";
import CustomButton from "../components/CustomButton";
import ConfirmationModal from "../components/ConfirmationModal";
import ReadOnlyArea from "../components/ReadOnlyArea";
import AddMoreLand from "../components/AddMoreLand";
import Dropdown from "../components/DropDown";
import { fetchCrops } from "../utils/apiService";
import { useToast } from 'react-native-toast-notifications';
import config from "../config/config"; 

const IP_ADDRESS = config.IP_ADDRESS;

const GrowerLandDetails = ({ navigation }) => {
    const toast = useToast();
    const route = useRoute();
    const { growerID } = route.params;
    const [cropType, setCropType] = useState("");
    const [cropCategory, setCropCategory] = useState("");
    const [photos, setPhotos] = useState([]);
    const [addMoreLand, setAddMoreLand] = useState(null);
    const [totalArea, setTotalArea] = useState({ hectare: 0, acre: 0, gunta: 0, sqft: 0 });
    const [coordinates, setCoordinates] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const [crops, setCrops] = useState([]);

    const handlePickPhoto = async () => {
        const result = await pickPhoto(photos, setPhotos, calculateLandArea, setTotalArea, setCoordinates);
        if (!result.success) {
            Alert.alert(result.title, result.message);
        }
    };

    const handleCropType = (value) => {
        const [name, id] = value.split("_");
        setCropType(name);
    }

    useEffect(() => {
        const getCrops = async () => {
            try {
                const data = await fetchCrops();
                setCrops(data);
            } catch (error) {
                toast.show("Unable to fetch crop details.", { type: 'danger' });

            }
        };
        getCrops();
    }, []);



    const buildPayload = (growerID, cropType, cropCategory, totalArea, coordinates) => ({
        growerID,
        cropType,
        cropCategory,
        totalAreaInHectare: parseFloat(totalArea.hectare),  // Ensure numeric values
        totalAreaInAcre: parseFloat(totalArea.acre),
        totalAreaInGunta: parseFloat(totalArea.gunta),
        coordinates,
    });
    const clearFormData = () => {
        setCropType("");
        setCropCategory("");
        setPhotos([]);
        setTotalArea({ hectare: 0, acre: 0, gunta: 0, sqft: 0 });
        setCoordinates([]);
    };

    const handleSubmit = async () => {
        // console.log("Add more land : ", addMoreLand);
        // console.log("payload", payload);

        const payload = buildPayload(growerID, cropType, cropCategory, totalArea, coordinates);

        console.log("Attempting to send request...");
        console.log("API URL:", `${IP_ADDRESS}/api/land-details/add`);
        console.log("Payload:", JSON.stringify(payload, null, 2));

        if (!growerID || !cropType || !cropCategory || !payload.totalAreaInHectare || !payload.totalAreaInAcre || !payload.totalAreaInGunta || !coordinates) {
            toast.show("Complete all fields before submitting.", { type: 'danger' });
            return;
        }

        try {
            let id = toast.show("Loading...");
            const response = await fetch(`${IP_ADDRESS}/api/land-details/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to submit Land details.");
            }

            const data = await response.json();
            console.log("Response Data:", data);

            toast.show("Grower LandDetails Submitted...!", { type: 'success' })

            // Clear form and photo after successful submission
            clearFormData();


        } catch (error) {
            console.error("Error:", error);
            toast.show("Submission failed. Try again.", { type: 'danger' });
        }
        finally {
            toast.hide(id);
        }

    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleConfirm = () => {
        console.log("Confirmed!");
        setModalVisible(false);
        handleSubmit();
        // Add your submit logic here
    };

    // const handleGoogleEarth = () => {

    // }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Crop Type Picker */}
            <Dropdown
                label="Crop Type/पिक प्रकार"
                items={crops.map((g) => ({ label: g.CropType + "_" + g.CropID, value: g.CropType + "_" + g.CropID, key: g.CropID }))}
                placeholder="Select Crop Type"
                selectedValue={cropType}
                onSelect={handleCropType}
            />

            {/* Crop Category Picker */}
            <Dropdown
                label="Crop Category/पिक श्रेणी"
                items={crops.map((g) => ({ label: g.CropType + "__" + g.CropCategory, value: g.CropCategory, key: g.CropID }))}
                placeholder="Select Crop Category"
                selectedValue={cropCategory}
                onSelect={setCropCategory}
            />
            {/* Land Photos */}
            <LandPhotos label="Land Photos (3-8 photos)/जमिनीच्या फोटो" photos={photos}
                setPhotos={setPhotos}
                calculateLandArea={calculateLandArea}
                setTotalArea={setTotalArea}
                pickPhoto={handlePickPhoto}
                setCoordinates={setCoordinates}
            />

            {/* Read-Only Area */}
            <ReadOnlyArea label="Approximate Total Area of Land/जमिनीचा अंदाजे एकूण क्षेत्रफळ" totalArea={totalArea} />

            {/* GoogleEarth View
            <CustomEditButton title="GoogleEarth View" onPress={handleGoogleEarth} /> */}

            {/* Add More Land */}
            <AddMoreLand label="Add More Land" addMoreLand={addMoreLand} setAddMoreLand={setAddMoreLand} />

            {/* Submit Button */}
            <CustomButton title="Submit" onPress={handleOpenModal} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title="Confirm Submission"
                message="Are you sure you want to submit?"
            />
        </ScrollView>
    );
};

export default GrowerLandDetails;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
});

