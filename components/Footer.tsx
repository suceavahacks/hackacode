export const Footer = () => {
    return (
        <footer className="w-full bg-[#091319] text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-lg">
                    &copy; {new Date().getFullYear()} Hackacode. All rights reserved.
                </p>
                <p className="text-lg">
                    Made with 🍵 by{" "}
                    <a
                        href="https://github.com/orgs/suceavahacks/teams/hackacode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF865B] underline"
                        style={{ textDecorationColor: '#FF865B', textDecorationStyle: 'wavy', textUnderlineOffset: '4px' }}
                    >
                        Luigi & Adelin
                    </a>
                </p>
            </div>
        </footer>
    )
}