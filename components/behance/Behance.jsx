import React from 'react'
import BehanceCard from './BehanceCard'

const Behance = ({behanceData}) => {
    return (
        <>
            <section className="concept"  id="concept">
                <h1 className="headingright ff-serif-jose fs-600">UI/UX Concept</h1>
                <div className="behanceitems">
                {
                    behanceData.project.map((project, index) => {
                        return <BehanceCard key={index} project={project} />
                    })
                }
                </div>
            </section>

        </>
    )
}

export default Behance
