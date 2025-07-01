import { Fragment, useState } from "react";

// import optional lightbox plugins
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import { Lightboxcomponent } from "../../@spk-reusable-components/reusable-plugins/spk-lightbox";
import SpkButton from "../../@spk-reusable-components/reusable-uielements/spk-button";


export const LightboxGallery = () => {

    const [open, setOpen] = useState(false);
    const value = true;
    const div = value.toString();
    const slidedata = [
        { src: "../../assets/images/media/media-40.jpg" },
        { src: "../../assets/images/media/media-41.jpg" },
        { src: "../../assets/images/media/media-43.jpg" },
        { src: "../../assets/images/media/media-44.jpg" },
        { src: "../../assets/images/media/media-45.jpg" },
        { src: "../../assets/images/media/media-46.jpg" },
        { src: "../../assets/images/media/media-60.jpg" }
    ]
    return (
        <Fragment>
            <Row>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-40.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/6.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">Beginner</div>
                            </div>
                            <div className="fs-12 text-muted">Beginner In.co</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-41.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/2.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">Responsive</div>
                            </div>
                            <div className="fs-12 text-muted">Responsive Design</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-42.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/4.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">JavaScript</div>
                            </div>
                            <div className="fs-12 text-muted">JavaScript Devlops</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-43.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/5.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">Layoutscss</div>
                            </div>
                            <div className="fs-12 text-muted">Layout SCSS</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-44.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/6.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">frontend</div>
                            </div>
                            <div className="fs-12 text-muted">Frontend Development.co</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-45.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1 flex-wrap">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/7.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">backenddevlops</div>
                            </div>
                            <div className="fs-12 text-muted">Backend Solutions</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-46.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1 flex-wrap">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/8.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">Frontend Dev</div>
                            </div>
                            <div className="fs-12 text-muted">Project innovations.in</div>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                    <Link scroll={false} href="#!" className="glightbox card search-images-card" data-gallery="gallery1" onClick={() => setOpen(true)}>
                        <img src="../../assets/images/media/media-60.jpg" alt="image" />
                        <div className="p-3 text-center bg-light">
                            <div className="d-flex align-items-center gap-1 justify-content-center mb-1 flex-wrap">
                                <div className="avatar avatar-xs">
                                    <img src="../../assets/images/company-logos/9.png" alt="" />
                                </div>
                                <div className="figure-caption fs-14 fw-medium text-default">Flawless</div>
                            </div>
                            <div className="fs-12 text-muted">Masters In.co</div>
                        </div>
                    </Link>
                </Col>
                <Col xl={12} className=" mb-4">
                    <SpkButton Buttonvariant="info-light" Customclass="btn-loader mx-auto">
                        <span className="me-2">Loading</span>
                        <span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
                    </SpkButton>
                </Col>
            </Row>
            <Lightboxcomponent
                close={() => setOpen(false)} 
                zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }} 
                open={open}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                slides={slidedata}
            />

        </Fragment>
    );
};



