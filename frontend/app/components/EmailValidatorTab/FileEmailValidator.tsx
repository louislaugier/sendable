import { Button, Checkbox, CheckboxGroup, Switch } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { allowedFileTypes } from "~/constants/files";
import { limits } from "~/constants/limits";
import { getColumnNamesFromCSV, getColumnNamesFromXLS } from "~/utils/file";

export default function FileEmailValidator(props: any) {
    const [globalDragActive, setGlobalDragActive] = useState(false);
    const [localDragActive, setLocalDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [isFileTypeValid, setIsFileTypeValid] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [hasColumnsToScan, setHasColumnsToScan] = useState(false);
    const [columns, setColumns] = useState<Array<string>>([]);
    const [selectedColumns, setSelectedColumns] = useState([]);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const handleWindowDragEnter = (e: DragEvent) => {
            e.preventDefault();
            setGlobalDragActive(true);
        };

        const handleWindowDragOver = (e: DragEvent) => {
            e.preventDefault();
        };

        const handleWindowDragLeave = (e: DragEvent) => {
            e.preventDefault();
            // Check if the mouse is outside the window boundaries
            if (e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY <= 0 || e.clientY >= window.innerHeight) {
                setGlobalDragActive(false);
            }
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setGlobalDragActive(false);
        };

        // Add global drag event listeners
        window.addEventListener('dragenter', handleWindowDragEnter);
        window.addEventListener('dragover', handleWindowDragOver);
        window.addEventListener('dragleave', handleWindowDragLeave);
        window.addEventListener('drop', handleDrop);

        return () => {
            // Remove global drag event listeners
            window.removeEventListener('dragenter', handleWindowDragEnter);
            window.removeEventListener('dragover', handleWindowDragOver);
            window.removeEventListener('dragleave', handleWindowDragLeave);
            window.removeEventListener('drop', handleDrop);
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
        const limit = limits.uploadFileSizeMegaBytes
        if (file.size > limit * 1024 * 1024) {
            alert(`File size exceeds the limit of ${limit}MB`);
            return;
        }

        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType && allowedFileTypes.includes(`.${fileType}`)) {
            setFile(file);
            setFileName(file.name);
            setIsFileTypeValid(true);

            // Get column names based on file type
            if (fileType === 'csv') {
                getColumnNamesFromCSV(file)
                    .then((columnNames) => {
                        console.log(columnNames)
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            } else if (fileType === 'xls' || fileType === 'xlsx') {
                getColumnNamesFromXLS(file)
                    .then((columnNames) => {
                        console.log(columnNames)
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            }
        } else {
            setIsFileTypeValid(false);
        }
    };


    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const submit = async () => {
        setLoading(true);

        setLoading(false);
    }

console.log(columns)

    return (
        <>
            <div className="mb-2 cursor-pointer flex flex-col items-center w-full">
                <div
                    className={`mb-2 drop-zone ${localDragActive ? 'active' : ''} ${!isFileTypeValid ? 'invalid' : ''}`}
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
                        {localDragActive || globalDragActive ? "Release here to upload" : "Click or drop a file to upload"}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleChange}
                            style={{ display: "none" }}
                        />
                        <p className="text-xs text-gray-500" style={{ bottom: "20px" }}>
                            Supported file types: {allowedFileTypes.join(", ")}
                        </p>
                    </div>
                </div>
                {file && <p className="mt-4">Uploaded: {fileName}</p>}
                {!isFileTypeValid && <p style={{ color: 'red' }}>File type not allowed.</p>}

                {file && file.type !== "text/plain" && <>
                    <Switch isSelected={hasColumnsToScan} onValueChange={setHasColumnsToScan} className="mt-4">
                        Select columns to scan manually
                    </Switch>

                    {hasColumnsToScan && <>
                        <CheckboxGroup orientation="horizontal" className="mt-2">
                            {columns.map((column: string) => (
                                <Checkbox key={column} value={column}>{column}</Checkbox>
                            ))}
                        </CheckboxGroup>
                    </>}
                </>}

                <div className="w-full flex justify-center mt-8">
                    <Button onClick={submit} isDisabled={!file || !isFileTypeValid} color="primary" variant="shadow">
                        {isLoading ? 'Checking reachability...' : 'Check reachability'}
                    </Button>
                </div>
            </div>
        </>
    );
}
