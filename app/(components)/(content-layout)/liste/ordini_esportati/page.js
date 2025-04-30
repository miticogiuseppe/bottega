"use client";

import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";
import { Table } from "react-bootstrap";
import { Badge } from "react-bootstrap";

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

                            <div className="table-responsive">
                                <Table className="table text-nowrap">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sito</th>
                                            <th scope="col">Ordine N°</th>
                                            <th scope="col">Data</th>
                                            <th scope="col">Qta</th>
                                            <th scope="col">Sku</th>
                                            <th scope="col">Descrizione</th>
                                            <th scope="col">Formato</th>
                                            <th scope="col">Verifica Stock</th>
                                            <th scope="col">Tipo profumo</th>
                                            <th scope="col">Cod. prodotto</th>
                                            <th scope="col">Vip</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Note</th>
                                            <th scope="col">Lotto</th>
                                            <th scope="col">Lotto TQ</th>
                                            <th scope="col">Stampa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                <th scope="row">TQ</th>
                                
                                <td>1234</td>
                                <td>21,Dec 2023</td>
                                <td>8</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><Badge className="bg-primary-transparent">
                                Paid</Badge></td>
                                        </tr>
                                        <tr>
                                <th scope="row">TQ</th>
                                <td>123456</td>
                                <td>29,April 2023</td>
                                <td>6</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><Badge className="bg-warning-transparent">
                                Pending</Badge></td>
                                        </tr>
                                        <tr>
                                <th scope="row">TQ</th>
                                <td>1278</td>
                                <td>30,Nov 2023</td>
                                
                                <td>1</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><Badge className="bg-primary-transparent">
                                Paid</Badge></td>
                                        </tr>
                                        <tr>
                                <th scope="row">TQ</th>
                                
                                <td>1526</td>
                                <td>18,Mar 2023</td>
                                <td>3</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><Badge className="bg-warning-transparent">
                                Pending</Badge></td>
                                        </tr>
                                        <tr>
                                <th scope="row">TQ</th>
                                
                                <td>198216</td>
                                <td>30,Nov 2023</td>
                                <td>2</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><Badge className="bg-primary-transparent">
                                Paid</Badge></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </Fragment>
    );
};

export default Orders;