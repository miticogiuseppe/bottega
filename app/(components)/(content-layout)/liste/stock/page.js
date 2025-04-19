"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const Stock = () => {
    return (
        <Fragment>
            <Seo title="Gestione Stock" />
            <div className="page error-bg">
                <div className="stock">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="stock-title mb-4">Gestione Stock</h1>
                                    <p className="fs-4 fw-normal mb-2">Monitora le scorte dei prodotti disponibili</p>
                                    <p className="fs-15 mb-5 text-muted">Verifica la disponibilità, aggiorna le quantità e ottimizza la gestione del magazzino per evitare esaurimenti o sovraccarichi.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Stock;
