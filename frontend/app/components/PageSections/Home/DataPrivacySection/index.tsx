import { Image } from "@nextui-org/react";

const DataPrivacySection: React.FC = () => {
    return (
        <>
            <Element />
            <Element hidden />
        </>
    );
};

export default DataPrivacySection;

const Element = (props: any) => {
    const { hidden } = props;

    return <div className={`py-10 justify-center bg-gray-100 ${!hidden && 'absolute'}`} style={{ left: 0, width: '100%', opacity: hidden ? 0 : 1 }}>
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Your data stays private and secure
        </h2>
        <div className="flex mt-12" style={{ justifyContent: 'center', maxWidth: '1024px', marginRight: 'auto', marginLeft: 'auto' }}>
            <div>
                <Image
                    alt="GDPR compliance badge"
                    src="/gdpr.png"
                    width={150}
                />
            </div>
            <div>
                <Image
                    alt="CCPA compliance badge"
                    src="/ccpa.png"
                    width={150}
                />
            </div>
        </div>
    </div>
}