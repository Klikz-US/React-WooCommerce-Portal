import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import moment from "moment";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import {
    inventoryRegisterService,
    inventoryGetService,
    inventoryUpdateService,
    inventoryGetListService,
    inventoryDeleteService,
} from "./../services/inventory.service";
import {
    verifyTokenAsync,
    userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { inventorySearchService } from "../services/search.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import Pagination from "../utils/pagination.util";

export function InventoryList() {
    /*
     * Private Page Token Verification Module.
     */
    const auth_obj = useSelector((state) => state.auth);
    const { token, expiredAt } = auth_obj;
    const dispatch = useDispatch();
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        };
    }, [expiredAt, token, dispatch]);
    /* ----------------------- */

    const [inventories, setInventories] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);

    const searchCategory = useFormCheck("drugName");
    const searchValue = useFormInput("");
    const [hasResult, setHasResult] = useState(false);
    const [hasSearchError, setHasSearchError] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const inventoryList = await inventoryGetListService(activePage);
            if (!inventoryList.error) {
                setInventories(inventoryList.data.inventories);
                setTotalPages(parseInt(inventoryList.data.count / 20));
            }

            setPageLoading(false);
        }
        if (!hasResult) {
            setPageLoading(true);
            fetchData();
        }
    }, [dispatch, activePage, hasResult]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        if (searchValue.value.trim() !== "") {
            async function fetchData() {
                setIsSearching(true);

                const searchReq = {
                    field: searchCategory.selected,
                    value: searchValue.value.trim(),
                };

                const searchResult = await inventorySearchService(searchReq);
                if (searchResult.error) {
                    setHasSearchError(true);
                    setHasResult(false);
                } else {
                    setHasSearchError(false);
                    setHasResult(true);
                    setInventories(searchResult.data);
                }

                setIsSearching(false);
            }
            fetchData();
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();

        setHasSearchError(false);
        setHasResult(false);
    };

    const handleDelete = (_id) => {
        async function fetchData() {
            const result = await inventoryDeleteService(_id);
            if (result.error) {
                console.log(result.errMsg);
            } else {
                async function fetchInventoryData() {
                    const inventoryList = await inventoryGetListService(activePage);
                    if (!inventoryList.error) {
                        if (hasResult) {
                            handleSearch();
                        } else {
                            setInventories(inventoryList.data.inventories);
                            setTotalPages(parseInt(inventoryList.data.count / 20));
                        }
                    }
                }
                fetchInventoryData();
            }
            setPageLoading(false);
        }
        setPageLoading(true);
        fetchData();
    };

    const pagination = () => {
        async function handleNextPage(activePage) {
            setActivePage(activePage);
        }

        return (
            <Pagination
                totalPages={totalPages}
                currentPage={activePage}
                onChange={handleNextPage}
            />
        );
    };

    const Inventory = (props) => (
        <tr>
            <td>
                <Link to={"/inventories/edit/" + props.inventory._id}>
                    {props.inventory.drugName}
                </Link>
            </td>
            <td>{props.inventory.dose}</td>
            <td>{props.inventory.ndc}</td>
            <td>{props.inventory.currentCount}</td>
            <td>{props.inventory.lowStock}</td>
            <td>
                {moment(new Date(props.inventory.registered_at)).format(
                    "MMM DD, YYYY"
                )}
            </td>
            <td className="text-center">
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(props.inventory._id)}
                >
                    {" "}
                    <FaTrashAlt className="text-danger mx-1" />
                </span>
            </td>
        </tr>
    );

    const inventoryList = (inventories) => {
        if (pageLoading) {
            return (
                <tr>
                    <td>
                        <Container
                            className="my-5 py-5 text-center"
                            style={{ position: "absolute" }}
                        >
                            <ClipLoader
                                css="margin: auto;"
                                size={100}
                                color={"#ff0000"}
                                loading={pageLoading}
                            />
                        </Container>
                    </td>
                </tr>
            );
        } else {
            return inventories.map(function (inventory, index) {
                return <Inventory inventory={inventory} key={index} />;
            });
        }
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Inventories</h1>

                <Row className="mt-4">
                    <Col>
                        <Form>
                            <Form.Group as={Row}>
                                <Col md="4" className="pl-0 my-auto">
                                    <Form.Control
                                        as="select"
                                        className="text-capitalize"
                                        {...searchCategory}
                                    >
                                        <option value="drugName">Drug Name</option>
                                        <option value="ndc">
                                            NDC
                                        </option>
                                    </Form.Control>
                                </Col>

                                <Col md="5" className="pl-0 my-auto">
                                    <Form.Control
                                        type="text"
                                        {...searchValue}
                                    />
                                </Col>

                                <Col md="3" className="pl-0">
                                    <Button
                                        type="submit"
                                        variant="outline-info"
                                        className="float-left px-2"
                                        disabled={isSearching}
                                        onClick={handleSearch}
                                    >
                                        <FaSearch className="text-danger mx-1" />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        className="float-left px-2"
                                        disabled={isSearching}
                                        onClick={handleCancel}
                                    >
                                        <FcCancel className="text-info mx-1" />
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className="px-0">
                        {totalPages > 1 &&
                            !hasResult &&
                            !hasSearchError &&
                            pagination()}
                    </Col>
                </Row>

                <Row>
                    <Table responsive>
                        <thead className="bg-danger text-white">
                            <tr>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    drug Name
                                </th>
                                <th style={{ width: "20%", maxWidth: "20%" }}>
                                    Dose
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    NDC
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Current Count
                                </th>
                                <th style={{ width: "14%", maxWidth: "14%" }}>
                                    Low Stock Warning
                                </th>
                                <th style={{ width: "13%", maxWidth: "13%" }}>
                                    Registered At
                                </th>
                                <th style={{ width: "5%", maxWidth: "5%" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {!hasSearchError && <tbody>{inventoryList(inventories)}</tbody>}
                    </Table>
                </Row>

                {hasSearchError && (
                    <Row className="justify-content-md-center my-5">
                        <MdErrorOutline
                            className="text-warning mr-1"
                            size={24}
                        />
                        No Inventory Found
                    </Row>
                )}
            </Container>
        </>
    );
}

export function InventoryRegister() {
    /*
     * Private Page Token Verification Module.
     */
    const auth_obj = useSelector((state) => state.auth);
    const { token, expiredAt } = auth_obj;
    const dispatch = useDispatch();
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        };
    }, [expiredAt, token, dispatch]);
    /* ----------------------- */

    const history = useHistory();
    const [formError, setFormError] = useState("");

    const drugName = useFormInput("");
    const dose = useFormInput("");
    const ndc = useFormInput("");
    const currentCount = useFormInput("");
    const lowStock = useFormInput("");

    const handleSubmit = (e) => {
        e.preventDefault();

        async function fetchData() {
            const inventory = {
                drugName: drugName.value,
                dose: dose.value,
                ndc: ndc.value,
                currentCount: currentCount.value,
                lowStock: lowStock.value,
            };
            const result = await inventoryRegisterService(inventory);
            if (result.error) {
                setFormError(result.errMsg);
            } else {
                history.push("/inventories");
            }
        }
        fetchData();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        history.push("/inventories");
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Register A New Drug</h1>

                <Form autoComplete="off">
                    <Container>
                        <Row>
                            <Col>
                                <Card className="h-100 shadow">
                                    <Card.Header className="bg-success text-white">
                                        <h5 className="m-0">
                                            Drug Information
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Row>
                                            <Form.Label>drug Name</Form.Label>
                                            <Form.Control
                                                id="drugName"
                                                name="drugName"
                                                type="text"
                                                {...drugName}
                                            />
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Dose</Form.Label>
                                                <Form.Control
                                                    id="dose"
                                                    name="dose"
                                                    type="text"
                                                    {...dose}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    NDC
                                                </Form.Label>
                                                <Form.Control
                                                    id="ndc"
                                                    name="ndc"
                                                    type="text"
                                                    {...ndc}
                                                />
                                            </Form.Group>
                                        </Form.Row>

                                        
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Current Count</Form.Label>
                                                <Form.Control
                                                    id="currentCount"
                                                    name="currentCount"
                                                    type="text"
                                                    {...currentCount}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>Low Stock Warning</Form.Label>
                                                <Form.Control
                                                    id="lowStock"
                                                    name="lowStock"
                                                    type="text"
                                                    {...lowStock}
                                                />
                                            </Form.Group>
                                        </Form.Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Button
                                    className="float-right mt-5"
                                    variant="outline-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className="float-right mr-2 mt-5"
                                    variant="primary"
                                    onClick={handleSubmit}
                                >
                                    Register Inventory
                                </Button>

                                {formError && (
                                    <Form.Text className="text-danger float-right mr-4">
                                        {formError}
                                    </Form.Text>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Container>
        </>
    );
}

export function InventoryEdit() {
    /*
     * Private Page Token Verification Module.
     */
    const auth_obj = useSelector((state) => state.auth);
    const { token, expiredAt } = auth_obj;
    const dispatch = useDispatch();
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        };
    }, [expiredAt, token, dispatch]);
    /* ----------------------- */

    const { id } = useParams();
    const [inventory, setInventory] = useState({
        drugName: "",
        dose: "",
        ndc: "",
        currentCount: "",
        lowStock: "",
    });

    const history = useHistory();
    const [formError, setFormError] = useState("");

    const drugName = useFormInput(inventory.drugName);
    const dose = useFormInput(inventory.dose);
    const ndc = useFormInput(inventory.ndc);
    const currentCount = useFormInput(inventory.currentCount);
    const lowStock = useFormInput(inventory.lowStock);

    useEffect(() => {
        async function getData() {
            const result = await inventoryGetService(id);
            if (result.error) {
                dispatch(userLogoutAsync());
            } else {
                setInventory(result.data);
            }
        }
        getData();
    }, [dispatch, id, setInventory]);

    const handleSubmit = (e) => {
        e.preventDefault();

        async function fetchData() {
            const inventory = {
                drugName: drugName.value,
                dose: dose.value,
                ndc: ndc.value,
                currentCount: currentCount.value,
                lowStock: lowStock.value
            };
            const result = await inventoryUpdateService(id, inventory);
            if (result.error) {
                setFormError(result.errMsg);
            } else {
                history.push("/inventories");
            }
        }
        fetchData();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        history.goBack();
    };

    return (
        <>
            <Container>
                <h1 className="m-5 text-center">Update Inventory Information</h1>

                <Form autoComplete="off">
                    <Container>
                        <Row>
                            <Col>
                                <Card className="h-100 shadow">
                                    <Card.Header className="bg-success text-white">
                                        <h5 className="m-0">
                                            Inventory Information
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Row>
                                            <Form.Label>drug Name</Form.Label>
                                            <Form.Control
                                                id="drugName"
                                                name="drugName"
                                                type="text"
                                                {...drugName}
                                            />
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Dose</Form.Label>
                                                <Form.Control
                                                    id="dose"
                                                    name="dose"
                                                    type="text"
                                                    {...dose}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    NDC
                                                </Form.Label>
                                                <Form.Control
                                                    id="ndc"
                                                    name="ndc"
                                                    type="text"
                                                    {...ndc}
                                                />
                                            </Form.Group>
                                        </Form.Row>

                                        
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Current Count</Form.Label>
                                                <Form.Control
                                                    id="currentCount"
                                                    name="currentCount"
                                                    type="text"
                                                    {...currentCount}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>Low Stock Warning</Form.Label>
                                                <Form.Control
                                                    id="lowStock"
                                                    name="lowStock"
                                                    type="text"
                                                    {...lowStock}
                                                />
                                            </Form.Group>
                                        </Form.Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Button
                                    className="float-right mt-5"
                                    variant="outline-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className="float-right mr-2 mt-5"
                                    variant="primary"
                                    onClick={handleSubmit}
                                >
                                    Update Inventory
                                </Button>

                                {formError && (
                                    <Form.Text className="text-danger float-right mr-4">
                                        {formError}
                                    </Form.Text>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Container>
        </>
    );
}
