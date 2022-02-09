import { useContext } from 'react'
import Link from 'next/link'
import { ProjectContext } from '../../helpers/context/ProjectContext'
const ArchiveDetails = ({ id, year, title, isnew, build, projectview, viewcode }) => {
    const { AddKeyword } = useContext(ProjectContext);
    const tags = [...build];
    return (
        <>
                <div className={`${isnew ? "project active" : "project"}`} key={id}>
                    <div className="project-head">
                        <div className="details">
                            <div className="title">
                                <h1 className="ff-serif-jose fs-400">{title}</h1>
                                {isnew && <span className="new ff-serif-jose">{`NEW!`}</span>}
                            </div>
                            <p className="ff-serif-jose fs-300">{year}</p>
                        </div>
                        <div className="links">
                            <Link href={viewcode}>
                                <a target="_blank" rel="noopener noreferrer"><i className="fab fa-github" /></a>
                            </Link>
                            <Link href={projectview}>
                                <a target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt" /></a>
                            </Link>
                        </div>
                    </div>
                    <div className="tag">
                        {
                            tags.map((tag, id) => {
                                return (
                                    <span className="ff-serif-jose fs-300" key={id} onClick={() => AddKeyword(tag)}>{tag} </span>
                                )
                            })
                        }
                    </div>

                </div>
        </>
    )
}

export default ArchiveDetails
