import Link from "next/link";


export default function NotFound() {
    return (
        <>
            <div id="notfound" className="container">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1 className="ff-serif-teko">404</h1>
                    </div>
                    <h2 className="ff-serif-jose fs-600">{`OOPs!!`} Page not found!</h2>
                    <p className="ff-serif-jose fs-400">
                        The page you are looking for might have been removed or temporarily unavailable. {`I'm`} guessing you spelled something wrong. Can you double check
                        that URL?
                    </p>
                    <Link href="/"><a className="ff-serif-jose fs-400">Back To Home</a></Link>
                </div>
            </div>

        </>
    )
}