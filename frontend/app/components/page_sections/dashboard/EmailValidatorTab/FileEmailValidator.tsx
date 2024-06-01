import { Button, Checkbox, CheckboxGroup, Switch } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { allowedFileTypes } from "~/constants/files";
import { limits } from "~/constants/limits";
import validateEmails from "~/services/api/validate_emails";
import { getColumnNamesFromCSV, getColumnNamesFromXLS } from "~/utils/file";
import RequestSent from "./RequestSent";

export default function FileEmailValidator(props: any) {
    const { resetHistory } = props

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        resetFileColumns()

        const limit = limits.uploadFileSizeMegaBytes
        if (file.size > limit * 1024 * 1024) {
            setErrorMsg(`File size exceeds the limit of ${limit}MB`);
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
                        if (!columnNames.length) {
                            setErrorMsg("No columns names found in file.")
                            return
                        }
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            } else if (fileType === 'xls' || fileType === 'xlsx') {
                getColumnNamesFromXLS(file)
                    .then((columnNames) => {
                        if (!columnNames.length) {
                            setErrorMsg("No columns names found in file.")
                            return
                        }
                        setColumns(columnNames)
                    })
                    .catch((error) => console.error(error));
            }
        } else {
            setErrorMsg("File type not allowed.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const reset = () => {
        resetFileColumns()
        setRequestSent(false)
        setFile(null)
        setFileName("")

        // refresh history
    }

    const resetFileColumns = () => {
        setColumns([])
        if (selectedColumns.length) setSelectedColumns([])
        setHasColumnsToScan(false)
    }

    const submit = async () => {
        setLoading(true);
        setErrorMsg("")

        try {
            const res = await validateEmails({ columnsToScan: selectedColumns }, file!)
            if (res.error) {
                setErrorMsg(res.error);
                setLoading(false);
                return
            }

            await resetHistory()
        } catch { }

        setRequestSent(true);

        setLoading(false);
    }

    const isFileTypeNotAllowed = errorMsg === "File type not allowed."

    return (
        !isRequestSent ?
            <>
                <div className="mb-2 mt-4 cursor-pointer flex flex-col items-center w-full">
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
                                onChange={handleFileChange}
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
                        <Switch isSelected={hasColumnsToScan} onValueChange={(isSelected) => {
                            if (isSelected) setSelectedColumns(columns)
                            else setSelectedColumns([])

                            setHasColumnsToScan(isSelected)
                        }} className="mt-4">
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
            </>
            :
            <RequestSent reset={reset} />
    );
}
