import { useState } from "react";

export default function FileUploader() {
    const fileTypes = ["csv", "txt", "xls", "xlsx"];
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isFileTypeValid, setIsFileTypeValid] = useState(true);

    // Handle drag events
    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave" || e.type === "drop") {
            setDragActive(false);
        }
    };

    // Handle file drop
    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const fileType = file.name.split('.').pop().toLowerCase();
            if (fileTypes.includes(fileType)) {
                setFile(file);
                setFileName(file.name);
                setIsFileTypeValid(true);
            } else {
                setIsFileTypeValid(false);
            }
        }
    };

    return (
        <>
            <div className="mb-2">
                <div
                    className={`drop-zone ${dragActive ? 'active' : ''} ${!isFileTypeValid ? 'invalid' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                        width: '300px',
                        height: '100px',
                        border: '2px dashed',
                        borderColor: dragActive ? '#2196f3' : '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '20px',
                        transition: 'border-color 0.3s',
                        backgroundColor: !isFileTypeValid ? '#ffebee' : 'transparent' // Red background if invalid file type
                    }}
                >
                    {dragActive ? "Release to drop" : "Drag files here or click to upload"}
                    <input type="file" style={{ display: "none" }} />
                </div>
                {file && <p>Uploaded: {fileName}</p>}
                {!isFileTypeValid && <p style={{ color: 'red' }}>File type not allowed.</p>}
            </div>
        </>
    );
}
