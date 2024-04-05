export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-lg">Your Company Name</p>
                    <p className="text-sm">123 Main Street, City, Country</p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm">Follow Us:</p>
                    <div className="flex justify-center md:justify-end">
                        <a href="#" className="mr-4">Facebook</a>
                        <a href="#" className="mr-4">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
