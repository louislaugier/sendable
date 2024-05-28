import { Button, Checkbox, CheckboxGroup, Chip, Switch, user } from "@nextui-org/react";
import { useState, useRef, useEffect, useContext } from "react";
import { allowedFileTypes } from "~/constants/files";
import { limits } from "~/constants/limits";
import UserContext from "~/contexts/UserContext";
import CheckIcon from "~/components/icons/CheckIcon";
import validateEmails from "~/services/api/validate_emails";
import { getColumnNamesFromCSV, getColumnNamesFromXLS } from "~/utils/file";

export default function FileEmailValidator(props: any) {
    const { remainingAppValidations } = props

    const [globalDragActive, setGlobalDragActive] = useState(false);
    const [localDragActive, setLocalDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [errorMsg, setErrorMsg] = useState<string>();

    const [hasColumnsToScan, setHasColumnsToScan] = useState(false);
    const [columns, setColumns] = useState<Array<string>>([]);
    const [selectedColumns, setSelectedColumns] = useState<Array<string>>([]);

    const [isLoading, setLoading] = useState(false);
    const [isRequestSent, setRequestSent] = useState(false);

    const { user } = useContext(UserContext);

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
        reset()

        const limit = limits.uploadFileSizeMegaBytes
        if (file.size > limit * 1024 * 1024) {
            alert(`File size exceeds the limit of ${limit}MB`);
            return;
        }

        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType && allowedFileTypes.includes(`.${fileType}`)) {
            setFile(file);
            setFileName(file.name);
            setErrorMsg("");

            // Get column names based on file type
            if (fileType === 'csv') {
                getColumnNamesFromCSV(file)
                    .then((columnNames) => {
                        setSelectedColumns(columnNames);
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            } else if (fileType === 'xls' || fileType === 'xlsx') {
                getColumnNamesFromXLS(file)
                    .then((columnNames) => {
                        setSelectedColumns(columnNames);
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            }
        } else {
            setErrorMsg("File type not allowed.");
        }
    };

    useEffect(() => {
        if (selectedColumns.length !== columns.length) setSelectedColumns(columns);
    }, [columns]);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const reset = () => {
        setColumns([])
        setSelectedColumns([])
        setHasColumnsToScan(false)
    }

    const submit = async () => {
        setLoading(true);
        setErrorMsg("")

        try {
            await validateEmails({ columnsToScan: selectedColumns }, file!)
            reset()
        } catch { }

        setRequestSent(true);

        setLoading(false);
    }

    const isFileTypeNotAllowed = errorMsg === "File type not allowed."

    return (
        isRequestSent ?
            <>
                <div className="mb-2 cursor-pointer flex flex-col items-center w-full">
                    <div
                        className={`mb-2 drop-zone ${localDragActive ? 'active' : ''} ${isFileTypeNotAllowed ? 'invalid' : ''}`}
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
                            backgroundColor: isFileTypeNotAllowed ? '#ffebee' : 'transparent',
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
                    {file && <p className="mt-4">Uploaded: <b>{fileName}</b></p>}
                    {!!errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

                    {file && file.type !== "text/plain" && <>
                        <Switch isSelected={hasColumnsToScan} onValueChange={setHasColumnsToScan} className="mt-4">
                            Select columns manually
                        </Switch>

                        {hasColumnsToScan && <>
                            {columns.length > 1 && <Checkbox value="all" className="mt-4" onValueChange={(isSelected) => {
                                if (isSelected) setSelectedColumns(columns)
                                else setSelectedColumns([])
                            }} isSelected={selectedColumns.length === columns.length}>
                                Select all
                            </Checkbox>}

                            <CheckboxGroup value={selectedColumns}
                                onValueChange={setSelectedColumns} orientation="horizontal" className="mt-4">
                                {columns.map((column: string, index: number) => {
                                    return (
                                        <Checkbox
                                            key={index}
                                            value={column}
                                        >
                                            {column}
                                        </Checkbox>
                                    );
                                })}
                            </CheckboxGroup>
                        </>}
                    </>}

                    <div className="w-full flex justify-center mt-8">
                        <Button onClick={submit} isDisabled={!file || isFileTypeNotAllowed || (hasColumnsToScan && !selectedColumns.length)} color="primary" variant="shadow">
                            {isLoading ? 'Checking reachability...' : 'Check reachability'}
                        </Button>
                    </div>
                </div>
            </> : <>
                <div className="flex flex-col items-center">
                    <Chip
                        startContent={<CheckIcon size={18} />}
                        variant="faded"
                        color="success"
                        className="mt-6 mb-4"
                    >
                        Import successful
                    </Chip>
                    <p className="mb-16">Your validation report will be sent to <b>{user?.email}</b> once every email address has been checked. A maximum of {remainingAppValidations} emails will be validated (your remaining quota), the next ones will be dropped.</p>
                </div>

                <div className="w-full flex justify-center">
                    <Button onClick={() => setRequestSent(false)} color="primary" variant="shadow">
                        New validation batch
                    </Button>
                </div>
            </>
    );
}
