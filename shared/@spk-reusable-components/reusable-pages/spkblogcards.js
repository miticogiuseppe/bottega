import Link from 'next/link'
import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'

const SpkBlogcards = ({ Imgsrc1, Title, Customclass, Linktag, Routepath, Customimgclass, Navigate, Anchorroute, heartfill = false, Linktagposition, Text, Imgsrc2, Name, Time, Customlinkclass, textcolor }) => {
    return (
        <Fragment>
            <Card className={`custom-card ${Customclass}`}>
                {Linktag === "before" ?
                    <Link scroll={false} href={Anchorroute} className={Customlinkclass}>
                        <img src={Imgsrc1} className={Customimgclass} alt="..." />
                    </Link> : ""}
                <Card.Body className="">
                    <Link href={Routepath} className="h5 fw-semibold mb-2 d-block lh-base">{Title}</Link>
                    <p className="mb-3">{Text}<Link scroll={false} href={Navigate} className={`fw-medium text-${textcolor} ms-2 align-middle fs-12 text-Augoration-underline d-inline-block`}>Read More {heartfill ? "" : "?"} </Link></p>
                    <div className="d-flex flex-wrap align-items-center justify-content-between ">
                        <div className="d-flex align-items-center">
                            <div className={`avatar avatar-${Linktagposition === "before" ? "sm" : "md"} avatar-rounded me-2`}>
                                <img src={Imgsrc2} alt="" />
                            </div>
                            <div>
                                <p className="mb-0 fw-medium">{Name}
                                    {Linktagposition === "before" ?
                                        <span className="text-muted fs-12 mb-0">{Time}</span> : ""
                                    }
                                </p>
                                {Linktagposition === "after" ?
                                    <span className="text-muted fs-12 mb-0">{Time}</span>
                                    : ""}
                            </div>
                        </div>
                        <div className="avatar avatar-sm bg-danger-transparent avatar-rounded">
                            <i className={`ri-heart-${heartfill ? "fill" : "line"} text-danger`}></i>
                        </div>
                    </div>
                </Card.Body>
                {Linktag === "after" ?
                    <Link scroll={false} href={Anchorroute} className={Customlinkclass}>
                        <img src={Imgsrc1} className={Customimgclass} alt="..." />
                    </Link> : ""}
            </Card>
        </Fragment>
    )
}

export default SpkBlogcards