export const Footer = () => {
    return (
        <footer className="w-full bg-secondary text-white py-4 border-t-2 border-white border-opacity-50">
            <div className="container mx-auto text-center h-48 flex items-center justify-center flex-col">
                <p className="text-3xl max-md:text-lg">
                    &copy; {new Date().getFullYear()} Hackacode. All rights reserved.
                </p>
                <p className="text-3xl max-md:text-lg">
                    Made with 🍵 by{" "}
                    <a
                        href="https://github.com/orgs/suceavahacks/teams/hackacode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="color underline"
                        style={{
                            textDecorationStyle: 'wavy',
                            textUnderlineOffset: '4px',
                        }}
                    >
                        Luigi & Adelin
                    </a>
                </p>
            </div>
        </footer>
    );
};