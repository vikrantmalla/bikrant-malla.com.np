import Link from 'next/link'

const Footer = () => {
    return (
        <>
            <footer>
                <div className="credit">
                    <Link href="https://github.com/vikrantmalla/bikrant-malla.com.np.git">
                        <a target="_blank" rel="noopener noreferrer" className="ff-serif-jose fs-300"> {`Design & Built by Bikrant Malla`} </a>
                    </Link>

                </div>
            </footer>
        </>
    )
}

export default Footer
