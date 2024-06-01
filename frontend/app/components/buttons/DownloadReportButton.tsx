import { Tooltip, Button, Link } from "@nextui-org/react"
import { useState } from "react"
import { apiBaseUrl } from "~/constants/api"
import { useErrorOccurredModal } from "~/contexts/ErrorOccurredModalContext"
import DownloadIcon from "~/components/icons/DownloadIcon"
import { navigateToUrl } from "~/utils/url"

export default function DownloadReportButton(props: any) {
    const { tooltipContent, validationId, reportToken } = props

    const [isLoading, setLoading] = useState(false)

    const { setErrorOccurredModalVisible } = useErrorOccurredModal();

    const downloadReport = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            navigateToUrl(`${apiBaseUrl}/validation_reports/${validationId}.csv.zip?token=${reportToken}`)
        } catch (error) {
            setErrorOccurredModalVisible(true)
        }

        setLoading(false)
    }

    return (
        <>
            <Tooltip content={tooltipContent}>
                <Button as={Link} href={`${apiBaseUrl}/validation_reports/${validationId}.csv.zip?token=${reportToken}`} onClick={downloadReport} isDisabled={isLoading} isLoading={isLoading} isIconOnly variant="light" aria-label="Download">
                    <DownloadIcon />
                </Button>
            </Tooltip>
        </>
    )
}