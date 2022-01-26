import ProjectData from '../../helpers/data/ProjectData'
import Link from 'next/link'
import ProjectCard from './ProjectCard'
const ProjectHighlight = () => {
    return (
        <>
            <section className="project" id="project">
                <h1 className="headingleft ff-serif-jose fs-600">Projects</h1>
                <div className="projectItem">
                    {
                        ProjectData.map((project) => {
                            return <ProjectCard key={project.id} {...project} />
                        })
                    }
                </div>
                <Link href="/archive" passHref><h1 className="link ff-serif-jose fs-400"><a>View the Archive</a></h1></Link>
            </section>
        </>
    )
}

export default ProjectHighlight
