import { useState, useRef, useEffect } from "react";

export default function FileUploader() {
    const fileTypes = [".csv", ".txt", ".xls", ".xlsx"];
    const [globalDragActive, setGlobalDragActive] = useState(false);
    const [localDragActive, setLocalDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [isFileTypeValid, setIsFileTypeValid] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleWindowDragEnter = (e: DragEvent) => {
            e.preventDefault();
            setGlobalDragActive(true);
        };

        const handleWindowDragLeave = (e: DragEvent) => {
            e.preventDefault();
            setGlobalDragActive(false);
        };

        // Add global drag event listeners
        window.addEventListener('dragenter', handleWindowDragEnter);
        window.addEventListener('dragleave', handleWindowDragLeave);

        return () => {
            // Remove global drag event listeners
            window.removeEventListener('dragenter', handleWindowDragEnter);
            window.removeEventListener('dragleave', handleWindowDragLeave);
        };
    }, []);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setLocalDragActive(true);
        } else if (e.type === "dragleave" || e.type === "drop") {
            setLocalDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setGlobalDragActive(false);
        setLocalDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType && fileTypes.includes(`.${fileType}`)) {
            setFile(file);
            setFileName(file.name);
            setIsFileTypeValid(true);
        } else {
            setIsFileTypeValid(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="mb-2">
                <div
                    className={`mt-8 mb-2 drop-zone ${localDragActive ? 'active' : ''} ${!isFileTypeValid ? 'invalid' : ''}`}
                    onClick={triggerFileInput}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                        width: '300px',
                        height: '100px',
                        border: '2px dashed',
                        borderColor: localDragActive ? '#2196f3' : globalDragActive ? '#BBDEFB' : '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.3s',
                        backgroundColor: !isFileTypeValid ? '#ffebee' : 'transparent',
                        borderRadius: '12px',
                    }}
                >
                    <div className="text-center">
                        {localDragActive || globalDragActive ? "Release here to upload" : "Click or drop a file here to upload"}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleChange}
                            style={{ display: "none" }}
                        />
                        <p className="text-xs text-gray-500" style={{ bottom: "20px" }}>
                            Supported file types: {fileTypes.join(", ")}
                        </p>
                    </div>
                </div>
                {file && <p>Uploaded: {fileName}</p>}
                {!isFileTypeValid && <p style={{ color: 'red' }}>File type not allowed.</p>}
            </div>
        </>
    );
}
