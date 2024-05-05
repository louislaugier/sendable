import { Tooltip, Button, Link } from "@nextui-org/react"
import axios from "axios"
import { useState } from "react"
import { apiBaseUrl } from "~/constants/api"
import { useErrorOccuredModal } from "~/contexts/ErrorOccuredModalContext"
import DownloadIcon from "~/icons/DownloadIcon"
import { navigateToUrl } from "~/utils/url"

export default function DownloadReportButton(props: any) {
    const { tooltipContent, validationId, reportToken } = props

    const [isLoading, setLoading] = useState(false)

    const { setErrorOccuredModalVisible } = useErrorOccuredModal();


    const downloadReport = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            navigateToUrl(`${apiBaseUrl}/reports/${validationId}.csv.zip?token=${reportToken}`)
        } catch (error) {
            setErrorOccuredModalVisible(true)
        }

        setLoading(false)
    }

    return (
        <>
            <Tooltip content={tooltipContent}>
                <Button as={Link} href={`${apiBaseUrl}/reports/${validationId}.csv.zip?token=${reportToken}`} onClick={downloadReport} isDisabled={isLoading} isLoading={isLoading} isIconOnly variant="light" aria-label="Download">
                    <DownloadIcon />
                </Button>
            </Tooltip>
        </>
    )
}