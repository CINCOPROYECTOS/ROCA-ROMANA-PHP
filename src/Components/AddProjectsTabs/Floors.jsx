import React, { useState, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import CloseIcon from "@mui/icons-material/Close";
import toast from 'react-hot-toast';
import { translate } from '@/utils';

const Floors = ({onFloorFieldsChange}) => {
    const [floorFields, setFloorFields] = useState([{ floorTitle: "", floorImgs: [] }]);
    const [currentFloorIndex, setCurrentFloorIndex] = useState(0);

    const getOrdinal = (index) => {
        if (index + 1 === 11 || index + 1 === 12 || index + 1 === 13) {
            return `${index + 1}th`;
        } else {
            const suffixes = ["st", "nd", "rd"];
            const remainder = (index + 1) % 10;
            const suffix = suffixes[remainder - 1] || "th";
            return `${index + 1}${suffix}`;
        }
    };

    const handleAddFloor = () => {
        const lastFloorIndex = floorFields.length - 1;
        const lastFloor = floorFields[lastFloorIndex];
        if (lastFloor.floorTitle.trim() === "" || lastFloor.floorImgs.length === 0) {
            toast.error(translate("firstAddOne"));
        } else {
            const newFloorIndex = floorFields.length;
            setFloorFields([...floorFields, { floorTitle: "", floorImgs: [] }]);
            setCurrentFloorIndex(newFloorIndex);
        }
    };

    const handleRemoveFloor = (index) => {
        const updatedFloorFields = [...floorFields];
        updatedFloorFields.splice(index, 1);
        setFloorFields(updatedFloorFields);
        // Update currentFloorIndex if it was removed
        if (index === currentFloorIndex) {
            setCurrentFloorIndex(Math.max(0, index - 1));
        }
    };

    const handleFloorInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFloorFields = [...floorFields];
        updatedFloorFields[index][name] = value;
        setFloorFields(updatedFloorFields);
    };

    const onDropFloorImgs = (floorIndex, acceptedFiles) => {
    
        setFloorFields(prevFloorFields => {
            const updatedFloorFields = [...prevFloorFields];
           
            updatedFloorFields[floorIndex].floorImgs = [...updatedFloorFields[floorIndex]?.floorImgs, ...acceptedFiles];
            return updatedFloorFields;
        });
    };

    const removeFloorImgs = (floorIndex, imgIndex) => {
        setFloorFields(prevFloorFields => {
            const updatedFloorFields = [...prevFloorFields];
            updatedFloorFields[floorIndex].floorImgs.splice(imgIndex, 1);
            // Update currentFloorIndex if it was removed from the current floor
            // if (floorIndex === currentFloorIndex) {
            setCurrentFloorIndex(Math.max(0, floorIndex)); // Set it to the current index or to 0 if it's the last floor
            // }
            return updatedFloorFields;
        });
    };

    // const getInputPropsfloor = (floorIndex, imgIndex) => ({
    //     onClick: () => handleUploadClick(floorIndex, imgIndex)
    // });
    const { getRootProps: getRootPropsFloor, getInputProps: getInputPropsFloor, isDragActive: isDragActiveFloor } = useDropzone({
        onDrop: (acceptedFiles) => onDropFloorImgs(currentFloorIndex, acceptedFiles), // Pass the correct floor index directly
        accept: 'image/*',
    });
    const handleUploadClick = (floorIndex, imgIndex) => {
        const floorField = floorFields[floorIndex];
        const floorImg = floorField.floorImgs[imgIndex];
        // Do something with the floorField and floorImg, like passing them to another component or updating the state
        // You can perform further actions with the floorField and floorImg as needed
    };

    const floorsFiles = useMemo(
        () => floorFields.map((floor, index) => (
            <>
                <div key={index} className="dropbox_gallary_img_div">
                    {floor.floorImgs.map((file, imgIndex) => (
                        <div key={imgIndex}>
                            <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                            <div className="dropbox_d">
                                <button className="dropbox_remove_img" onClick={() => removeFloorImgs(index, imgIndex)}>
                                    <CloseIcon fontSize='25px' />
                                </button>
                                <div className="dropbox_img_deatils">
                                    <span>{file.name}</span>
                                    <span>{Math.round(file.size / 1024)} KB</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )),
        [floorFields]
    );

    const floorsContent = floorFields.map((floor, floorIndex) => (
        <div key={floorIndex} className="row floorfields">
            <div className="col-sm-12 col-md-6">
                <div className="add_prop_fields">
                    <span> {getOrdinal(floorIndex)}  Floor Title</span>
                    <input
                        type="text"
                        id="prop_title_input"
                        placeholder="Enter Floor Title"
                        name="floorTitle"
                        value={floor.floorTitle}
                        onChange={(e) => handleFloorInputChange(floorIndex, e)}
                    />
                </div>
            </div>
            <div className="col-sm-12 col-md-6">
                <div className="florimgandremove">
                    <div className="add_prop_fields">
                        <span>{getOrdinal(floorIndex)} Floor Images</span>
                        <div className="dropbox">
                            <div {...getRootPropsFloor(floorIndex)} className={`dropzone ${isDragActiveFloor ? "active" : ""}`}>
                                <input {...getInputPropsFloor(floorIndex)} />
                                {floor.floorImgs.length === 0 ? (
                                    isDragActiveFloor ? (
                                        <span>Drop files here...</span>
                                    ) : (
                                        <span>Drag 'n' drop some files here, or click to select files</span>
                                    )
                                ) : null}
                            </div>
                            <div>{floorsFiles[floorIndex]}</div>
                        </div>
                    </div>
                    {floorFields.length > 1 && (
                        <div className="removeFloor">
                            <button onClick={() => handleRemoveFloor(floorIndex)}>
                                <IoMdRemoveCircleOutline />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ));

    
    useEffect(() => {
        onFloorFieldsChange(floorFields);
    }, [floorFields, onFloorFieldsChange]);

    return (
        <div>
            {floorsContent}
            <button className="add_floor" onClick={handleAddFloor}>Add Floor</button>
        </div>
    );
};

export default Floors;
