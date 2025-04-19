"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";

const Report = () => {
    return (
        <Fragment>
            <Seo title="Report Aziendale" />
            <div className="page error-bg">
                <div className="report">
                    <div className="container">
                        <div className="my-auto">
                            <div className="row align-items-center justify-content-center h-100">
                                <Col xl={7} lg={5} md={6} className="col-12">
                                    <h1 className="report-title mb-4">Report Aziendale</h1>
                                    <p className="fs-4 fw-normal mb-2">Analizza i dati e le performance della profumeria</p>
                                    <p className="fs-15 mb-5 text-muted">Consulta le statistiche di vendita, il magazzino e l'andamento degli ordini in un'unica pagina dettagliata.</p>
                                </Col>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Report;
