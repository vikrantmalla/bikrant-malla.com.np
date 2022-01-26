import '../styles/globals.scss'
import ThemeContext from '../helpers/context/ThemeContext'
import ProjectContext from '../helpers/context/ProjectContext'
import MouseContext from '../helpers/context/MouseContext'
import DotRing from '../components/cursor/DotRing'
import Footer from '../components/footer/Footer'
import ScrollArrow from '../components/scrollup/ScrollArrow'
function MyApp({ Component, pageProps }) {
    return (
        <ThemeContext>
            <MouseContext>
                <ProjectContext>
                    <Component {...pageProps} />
                    <DotRing />
                    <ScrollArrow/>
                    <Footer />
                </ProjectContext>
            </MouseContext>
        </ThemeContext>
    )

}

export default MyApp