import React, { useContext } from 'react'
import Link from 'next/link'
import { ProjectContext } from '../../context/ProjectContext'
const ArchiveHeader = () => {
    const { filterKeyword, RemoveKeyword, ClearKeywords } = useContext(ProjectContext)
    return (
        <>
            <header className="archive-header">
                <Link href="/"><a className='return ff-serif-teko fs-600'>Back to home</a></Link>
                <div className='center'>
                    <div className={`${filterKeyword.length > 0 ? "search" : null}`}>
                        <div className="filter_tags">
                            {filterKeyword.map((tag, id) => {
                                return (
                                    <div className="filter" key={id}>
                                        <span className="ff-serif-jose fs-400">{tag}</span>
                                        <i className="fas fa-times" onClick={() => RemoveKeyword(tag)} />
                                    </div>
                                );
                            })}
                        </div>
                        {filterKeyword.length > 0 && (
                            <button className="clear ff-serif-jose fs-400" onClick={ClearKeywords}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>


            </header>
        </>
    )
}

export default ArchiveHeader
