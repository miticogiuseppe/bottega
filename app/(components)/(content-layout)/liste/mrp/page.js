"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const MRP = () => {
    return (
        <Fragment>
            <Seo title="MRP - Pianificazione Materiali" />
            <div className="page error-bg">
                <div className="mrp">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="mrp-title mb-4">MRP - Pianificazione Materiali</h1>
                                    <p className="fs-4 fw-normal mb-2">Gestisci il fabbisogno di materiali per la produzione</p>
                                    <p className="fs-15 mb-5 text-muted">Monitora le scorte di materie prime, prevedi il riordino e ottimizza la gestione del magazzino per evitare sprechi.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MRP;
