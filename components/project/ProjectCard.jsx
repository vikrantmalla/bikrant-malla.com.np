import { useContext } from 'react'
import Link from 'next/link'
import { MouseContext } from '../../helpers/context/MouseContext';
const ProjectCard = ({ images, alt, title, build, projectview }) => {
    const { cursorChangeHandler } = useContext(MouseContext);
    return (


        <div className="card">
            <div className="card-img">
                <div
                    onMouseEnter={() => cursorChangeHandler("hovered")}
                    onMouseLeave={() => cursorChangeHandler("")}
                >
                    <Link href={projectview}>
                        <a target="_blank" rel="noopener noreferrer"><img src={images} alt={alt} /></a>
                    </Link>
                </div>
            </div>
            <div className="card-details">
                <div className="card-head">
                    <h1 className="ff-serif-jose fs-400">{title}</h1>
                    <p className="ff-serif-jose fs-300">{build}</p>
                </div>
                <div className="card-body">
                    <div
                        onMouseEnter={() => cursorChangeHandler("hovered")}
                        onMouseLeave={() => cursorChangeHandler("")}
                    >
                        <Link href={projectview}>
                            <a target="_blank" rel="noopener noreferrer"><i className="fas fa-chevron-right" /></a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProjectCard
