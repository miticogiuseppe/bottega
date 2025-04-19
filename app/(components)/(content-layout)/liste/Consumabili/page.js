"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const Consumables = () => {
    return (
        <Fragment>
            <Seo title="Gestione Consumabili" />
            <div className="page error-bg">
                <div className="consumables">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="consumables-title mb-4">Gestione Consumabili</h1>
                                    <p className="fs-4 fw-normal mb-2">Monitora i materiali di consumo e la loro disponibilità</p>
                                    <p className="fs-15 mb-5 text-muted">Gestisci gli articoli essenziali, verifica le scorte e pianifica il riordino per evitare interruzioni nella produzione.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Consumables;
