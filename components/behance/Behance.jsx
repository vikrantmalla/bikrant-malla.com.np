import React from 'react'
import  BehanceData  from '../../helpers/data/BehanceData'
import BehanceCard from './BehanceCard'
const Behance = () => {
    return (
        <>
            <section className="concept"  id="concept">
                <h1 className="headingright ff-serif-jose fs-600">UI/UX Concept</h1>
                <div className="behanceitems">
                {
                    BehanceData.map((project) => {
                        return <BehanceCard key={project.id} {...project} />
                    })
                }
                </div>
            </section>

        </>
    )
}

export default Behance
