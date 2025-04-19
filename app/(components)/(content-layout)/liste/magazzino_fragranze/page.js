"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const Warehouse = () => {
    return (
        <Fragment>
            <Seo title="Magazzino Fragranze" />
            <div className="page error-bg">
                <div className="warehouse">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="warehouse-title mb-4">Magazzino Fragranze</h1>
                                    <p className="fs-4 fw-normal mb-2">Gestisci le scorte di profumi e verifica la disponibilità</p>
                                    <p className="fs-15 mb-5 text-muted">Monitora le quantità, verifica le nuove spedizioni e aggiorna il magazzino con le ultime fragranze.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Warehouse;
