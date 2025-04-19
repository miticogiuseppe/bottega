"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const CompletedOrders = () => {
    return (
        <Fragment>
            <Seo title="Ordini Evasi" />
            <div className="page error-bg">
                <div className="completed-orders">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="completed-orders-title mb-4">Ordini Evasi</h1>
                                    <p className="fs-4 fw-normal mb-2">Visualizza gli ordini completati e spediti</p>
                                    <p className="fs-15 mb-5 text-muted">Qui puoi controllare lo storico degli ordini già evasi e monitorare i dettagli di consegna.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CompletedOrders;
