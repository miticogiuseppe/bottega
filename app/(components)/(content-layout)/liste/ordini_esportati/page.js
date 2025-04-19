"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const Orders = () => {
    return (
        <Fragment>
            <Seo title="Ordini Esportati" />
            <div className="page error-bg">
                <div className="orders">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="orders-title mb-4">Ordini Esportati</h1>
                                    <p className="fs-4 fw-normal mb-2">Gestisci e visualizza i tuoi ordini esportati</p>
                                    <p className="fs-15 mb-5 text-muted">Qui trovi lo storico dei tuoi ordini esportati con dettagli di tracking e stato della spedizione.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Orders;