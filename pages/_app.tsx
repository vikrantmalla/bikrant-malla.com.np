import Router from "next/router"
import nProgress from "nprogress"
import type { AppProps } from 'next/app'
import ThemeContext from '../context/ThemeContext'
import ProjectContext from '../context/ProjectContext'
import MouseContext from '../context/MouseContext'
import DotRing from '../components/shared/cursor/DotRing'
import ScrollArrow from '../components/shared/scrollup/ScrollArrow'
import Footer from '../components/shared/footer/Footer'
import '../styles/globals.scss'

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function MyApp({ Component, pageProps }: AppProps) {
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