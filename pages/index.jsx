import Head from 'next/head'
import NavBar from '../components/header/NavBar'
import AboutMe from '../components/intro/AboutMe'
import ProjectHighlight from '../components/project/ProjectHighlight'
import Behance from '../components/behance/Behance'
import Contact from '../components/footer/Contact'

export default function Home() {
  return (
    <>
      <Head>
        <title>Bikrant Malla - FrontEnd Developer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies." />
        <meta name="keywords" content="bikrant malla, vikrant, ui/ux, portfolio, web, frontend, developer, frontend enginner, project" />
        <meta name="author" content="Bikrant Malla" />
        <meta name="google-site-verification" content="pjAbOBn26n0Q6sNbPKdsSIb4F921MU1XrRja9irTkXU" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bikrant Malla - Frontend Developer" />
        <meta property="og:description" content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies." />
        <meta property="og:url" content="https://www.bikrant-malla.com.np" />
        <meta property="fb:app_id" content="668583534114468" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Vikrantmalla09" />
        <meta name="twitter:creator" content="@Vikrantmalla09" />
        <meta property="og:url" content="https://www.bikrant-malla.com.np" />
        <meta property="og:title" content="Bikrant Malla - Frontend Developer" />
        <meta property="og:description" content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies." />
        <meta property="og:image" content="https://www.bikrant-malla.com.np/ogimg.png" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossOrigin="anonymous" />
      </Head>
      <NavBar />
      <main>
        <article className='container'>
          <AboutMe />
          <ProjectHighlight />
          <Behance />
          <Contact />
        </article>
      </main>
    </>
  )
}