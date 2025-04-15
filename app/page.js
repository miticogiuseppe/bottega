"use client"
import { basePath } from '../next.config';
import SpkAlert from '../shared/@spk-reusable-components/reusable-uielements/spk-alert';
import SpkButton from '../shared/@spk-reusable-components/reusable-uielements/spk-button';
import { auth } from '../shared/firebase/firebaseapi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react'
import { Card, Col, Form, Nav, Tab } from 'react-bootstrap';

const page = () => {

    const [passwordshow1, setpasswordshow1] = useState(false);

    const [err, setError] = useState("");
    const [data, setData] = useState({
        "email": "adminnextjs@gmail.com",
        "password": "1234567890",
    });
    const { email, password } = data;
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError("");
    };
    const Login = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).then(
            user => { console.log(user); RouteChange(); }).catch(err => { setError(err.message); });
    };

    const Login1 = (_e) => {
        if (data.email == "adminnextjs@gmail.com" && data.password == "1234567890") {
            RouteChange();
        }
        else {
            setError("The Auction details did not Match");
            setData({
                "email": "adminnextjs@gmail.com",
                "password": "1234567890",
            });
        }
    };
    const router = useRouter();
    const RouteChange = () => {
        let path = "/dashboard/sales";
        router.push(path);
    };

    useEffect(() => {
        document.querySelector("body")?.classList.add("authentication-background");

        return () => {
            document.querySelector("body")?.classList.remove("authentication-background");
        }
    });
    return (
        <Fragment>
            <html>
                <body className="">
                    <div className="container">
                        <div className="row justify-content-center align-items-center authentication authentication-basic h-100 pt-3">
                            <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
                                <div className="mb-3 d-flex justify-content-center">
                                    <Link href="dashboard/sales/">
                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-white.png`} alt="logo" className="desktop-logo" />
                                    </Link>
                                </div>
                                <Card className="custom-card my-4">
                                    <Tab.Container id="left-tabs-example" defaultActiveKey="react">
                                        <Nav variant="pills" className="justify-content-center authentication-tabs">
                                            <Nav.Item>
                                                <Nav.Link eventKey="react">
                                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/nextjs.png`} alt="logo" className='avatar avatar-sm' />
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="firebase">
                                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/firbase.png`} alt="logo" className='avatar avatar-sm' />
                                                </Nav.Link>
                                            </Nav.Item>

                                        </Nav>
                                        <Tab.Content className=''>
                                            <Tab.Pane eventKey="react" className='border-0'>
                                                <Card.Body className="">
                                                    <p className="h5 mb-2 text-center">Sign In</p>
                                                    <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back Henry !</p>
                                                    <div className="d-flex mb-3 justify-content-between gap-2 flex-wrap flex-lg-nowrap">
                                                        <SpkButton Buttonvariant='' Size='lg' Customclass='btn-light-ghost border d-flex align-items-center justify-content-center flex-fill bg-light' Buttontype="button">
                                                            <span className="avatar avatar-xs flex-shrink-0">
                                                                <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/media/apps/google.png`} alt="" />
                                                            </span>
                                                            <span className="lh-1 ms-2 fs-13 text-default">Signup with Google</span>
                                                        </SpkButton>
                                                    </div>
                                                    <div className="text-center my-3 authentication-barrier">
                                                        <span>OR</span>
                                                    </div>
                                                    <div className="row gy-3">
                                                        {err &&
                                                            <SpkAlert variant="danger">{err}</SpkAlert>
                                                        }
                                                        <Col xl={12}>
                                                            <Form.Label htmlFor="signin-username" className="text-default">User Name</Form.Label>
                                                            <Form.Control type="email" name="email" className="" id="email" placeholder="user name"
                                                                value={email}
                                                                onChange={changeHandler}
                                                            />
                                                        </Col>
                                                        <div className="col-xl-12 mb-2">
                                                            <Form.Label htmlFor="signin-password" className="text-default d-block">Password<Link href="/authentication/reset-password/basic" className="float-end text-danger">Forget password ?</Link></Form.Label>
                                                            <div className="position-relative">
                                                                <Form.Control name="password" type={(passwordshow1) ? 'text' : "password"} value={password}
                                                                    onChange={changeHandler} className="create-password-input" id="signin-password" placeholder="password" />
                                                                <Link href="#!" scroll={false} className="show-password-button text-muted" id="button-addon2" onClick={() => setpasswordshow1(!passwordshow1)}><i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i></Link>
                                                            </div>
                                                            <div className="mt-2">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                                    <label className="form-check-label text-muted fw-normal" htmlFor="defaultCheck1">
                                                                        Remember password ?
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-grid mt-4">
                                                        <Link href="dashboard/sales/" className="btn btn-primary" onClick={Login1}>Sign In</Link>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-muted mt-3 mb-0">Dont have an account? <Link href="/authentication/sign-up/basic" className="text-primary">Sign Up</Link></p>
                                                    </div>
                                                    <div className="btn-list text-center mt-3">
                                                        <SpkButton Buttonvariant='primary-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-facebook-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                        <SpkButton Buttonvariant='primary1-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-twitter-x-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                        <SpkButton Buttonvariant='primary2-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-instagram-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                    </div>
                                                </Card.Body>

                                            </Tab.Pane>
                                            <Tab.Pane eventKey="firebase" className='border-0'>
                                                <div className="card-body">
                                                    <p className="h5 mb-2 text-center">Sign In</p>
                                                    <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back Henry !</p>
                                                    <div className="d-flex mb-3 justify-content-between gap-2 flex-wrap flex-lg-nowrap">
                                                        <SpkButton Buttonvariant='light-ghost' Size='lg' Customclass='btn-light-ghost border d-flex align-items-center justify-content-center flex-fill bg-light' Buttontype="button">
                                                            <span className="avatar avatar-xs flex-shrink-0">
                                                                <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/media/apps/google.png`} alt="" />
                                                            </span>
                                                            <span className="lh-1 ms-2 fs-13 text-default">Signup with Google</span>
                                                        </SpkButton>
                                                    </div>
                                                    <div className="text-center my-3 authentication-barrier">
                                                        <span>OR</span>
                                                    </div>
                                                    <div className="row gy-3">
                                                        {err &&
                                                            <SpkAlert variant="danger">{err}</SpkAlert>
                                                            // <Alert variant="danger">{err}</Alert>
                                                        }
                                                        <Col xl={12}>
                                                            <Form.Label htmlFor="signin-username" className="text-default">User Name</Form.Label>
                                                            <Form.Control name="email" type="email" className="" id="email" placeholder="user name" value={email}
                                                                onChange={changeHandler} />
                                                        </Col>
                                                        <div className="col-xl-12 mb-2">
                                                            <label htmlFor="signin-password" className="form-label text-default d-block">Password<sup className="fs-12 text-danger">*</sup><Link href="/authentication/reset-password/basic" className="float-end fw-normal text-danger">Forget password ?</Link></label>
                                                            <div className="position-relative">
                                                                <Form.Control name="password" type={(passwordshow1) ? 'text' : "password"}
                                                                    value={password}
                                                                    onChange={changeHandler} className="create-password-input" id="signin-password" placeholder="password" />
                                                                <Link href="#!" scroll={false} className="show-password-button text-muted" id="button-addon2" onClick={() => setpasswordshow1(!passwordshow1)}><i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i></Link>
                                                            </div>
                                                            <div className="mt-2">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                                    <label className="form-check-label text-muted fw-normal" htmlFor="defaultCheck1">
                                                                        Remember password ?
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-grid mt-4">
                                                        <Link href="dashboard/sales/" className="btn btn-primary" onClick={Login}>Sign In</Link>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-muted mt-3 mb-0">Dont have an account? <Link href="/authentication/sign-up/basic" className="text-primary">Sign Up</Link></p>
                                                    </div>
                                                    <div className="btn-list text-center mt-3">
                                                        <SpkButton Buttonvariant='primary-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-facebook-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                        <SpkButton Buttonvariant='primary1-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-twitter-x-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                        <SpkButton Buttonvariant='primary2-light' Customclass='btn-icon' Buttontype="button">
                                                            <i className="ri-instagram-line lh-1 align-center fs-17"></i>
                                                        </SpkButton>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Card>
                            </Col>
                        </div>
                    </div>
                </body>
            </html>
        </Fragment>
    )
}

export default page