import Link from 'next/link'

const Footer = () => {
    return (
        <>
            <footer>
                <div className="credit">
                    <Link href="https://github.com/vikrantmalla/bikrant-malla.com.np.git" className="ff-serif-jose fs-300" passHref>
                        {`Design & Built by Bikrant Malla`}
                    </Link>
                </div>
            </footer>
        </>
    )
}

export default Footer
