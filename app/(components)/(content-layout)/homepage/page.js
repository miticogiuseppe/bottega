"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";


const Homepage = () => {
    return (
        <Fragment>
            <Seo title="Profumeria - Homepage" />
            <div className="page error-bg">
                <div className="homepage">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="homepage-title mb-4">Benvenuto nella nostra Profumeria!</h1>
                                    <p className="fs-4 fw-normal mb-2">Scopri la nostra esclusiva collezione di profumi</p>
                                    <p className="fs-15 mb-5 text-muted">Lasciati avvolgere dalle migliori fragranze.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Homepage;
