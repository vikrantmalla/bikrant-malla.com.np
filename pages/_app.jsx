import '../styles/globals.scss'
import ThemeContext from '../context/ThemeContext'
import ProjectContext from '../context/ProjectContext'
import MouseContext from '../context/MouseContext'
import DotRing from '../components/cursor/DotRing'
import Footer from '../components/footer/Footer'
function MyApp({ Component, pageProps }) {
    return (
        <ThemeContext>
            <MouseContext>
                <ProjectContext>
                    <Component {...pageProps} />
                    <DotRing />
                    <Footer />
                </ProjectContext>
            </MouseContext>
        </ThemeContext>
    )

}

export default MyApp