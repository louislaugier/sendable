export default function CheckIcon(props: any) {
    const { isWhite } = props

    return (
        <>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke={isWhite ? 'white' : 'black'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </>
    )
}