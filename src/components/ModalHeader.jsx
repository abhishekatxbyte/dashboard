import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { SET_FILTERED_DATA } from '../store/slice';

function MyVerticallyCenteredModal(props) {

    const headers = useSelector(state => state.data.headers)
    const [data] = useSelector(state => state.data.dataArray)
    const [customInput, setCustomInput] = useState('');
    const [filteredData, setFilteredData] = useState()
    const dispatch = useDispatch()
    const [headerCondition, setHeaderCondition] = useState('')
    const [baseHeader, setBaseHeader] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('isEqual');

    const [checkboxes, setCheckboxes] = useState([
        { name: 'isEqual', label: 'is equal to' },
        { name: 'isNotEqual', label: 'is not equal to' },
        { name: 'isLessThan', label: 'less than' },
        { name: 'isGreaterThan', label: 'greater than' },
        { name: 'isGreaterThanOrEqual', label: 'greater than or equal' },
        { name: 'isLessThanOrEqual', label: 'less than or equal' },
    ]);

    const [secondHeader, setSecondHeader] = useState('');
    const handleBaseHeaderChange = (event) => {
        const newValue = event.target.value;
        setBaseHeader(newValue);
    };
    const handleSecondHeaderChange = (event) => {
        const newValue = event.target.value;
        setSecondHeader(newValue);
    };
    const handleConditionChange = (event) => {
        const newValue = event.target.value;
        setHeaderCondition(newValue);

        if (newValue === 'HEADER_TO_HEADER') {
            setCheckboxes([
                { name: 'isEqual', label: 'is equal to' },
                { name: 'isNotEqual', label: 'is not equal to' },
                { name: 'isLessThan', label: 'less than' },
                { name: 'isGreaterThan', label: 'greater than' },
                { name: 'isGreaterThanOrEqual', label: 'greater than or equal' },
                { name: 'isLessThanOrEqual', label: 'less than or equal' },
            ]);
        } else if (newValue === 'HEADER_TO_INPUT') {
            setCheckboxes([
                { name: 'isEqual', label: 'is equal to' },
                { name: 'isNotEqual', label: 'is not equal to' },
                { name: 'isLessThan', label: 'less than' },
                { name: 'isGreaterThan', label: 'greater than' },
                { name: 'isGreaterThanOrEqual', label: 'greater than or equal' },
                { name: 'isLessThanOrEqual', label: 'less than or equal' },
                { name: 'isContainsPhrase', label: 'contain the phrase' },
            ]);
        }
    };

    console.log(checkboxes)
    const handleOperatorChange = (event) => {
        setSelectedOperator(event.target.value);
    };
    const handleCustomInputChange = (event) => {
        setCustomInput(event.target.value);
    };
    function filterData(data, xProperty, yProperty, condition, headerCondition, customInput) {
        if (headerCondition === "HEADER_TO_HEADER") {
            const filteredData = data.filter(item => {
                const xValue = item[xProperty];
                const yValue = item[yProperty];

                switch (condition) {
                    case 'isEqual':
                        return xValue === yValue;
                    case 'isNotEqual':
                        return xValue !== yValue;
                    case 'isLessThan':
                        return xValue < yValue;
                    case 'isGreaterThan':
                        return xValue > yValue;
                    case 'isGreaterThanOrEqual':
                        return xValue >= yValue;
                    case 'isLessThanOrEqual':
                        return xValue <= yValue;
                    default:
                        return true; // If condition is not specified, return all data
                }
            });
            return filteredData;
        } else if (headerCondition === "HEADER_TO_INPUT") {
            const isNumber = customInput * 1;
            if (!isNaN(isNumber)) {
                // Handle numeric comparisons when customInput is a valid number
                const filteredData = data.filter(item => {
                    const xValue = item[xProperty];

                    switch (condition) {
                        case 'isEqual':
                            return xValue === isNumber;
                        case 'isNotEqual':
                            return xValue !== isNumber;
                        case 'isLessThan':
                            return xValue < isNumber;
                        case 'isGreaterThan':
                            return xValue > isNumber;
                        case 'isGreaterThanOrEqual':
                            return xValue >= isNumber;
                        case 'isLessThanOrEqual':
                            return xValue <= isNumber;
                        default:
                            return true; // If condition is not specified, return all data
                    }
                });
                return filteredData;
            } else {
                // Handle string comparisons when customInput is not a valid number
                const filteredData = data.filter(item => {
                    const xValue = item[xProperty].toLowerCase(); // Convert xValue to lowercase
                    const customInputLowerCase = customInput.toLowerCase(); // Convert customInput to lowercase

                    switch (condition) {
                        case 'isEqual':
                            return xValue === customInputLowerCase;
                        case 'isNotEqual':
                            return xValue !== customInputLowerCase;
                        case 'isContainsPhrase':
                            return typeof xValue === 'string' && xValue.includes(customInputLowerCase);
                        default:
                            return true; // If condition is not specified, return all data
                    }
                });
                return filteredData;

            }
        } else {
            // Invalid headerCondition, return the original data
            return data;
        }
    }



    useEffect(() => {
        dispatch(SET_FILTERED_DATA(filteredData))
    }, [filteredData])
    function handleHide() {
        props.setModalShow(false)
        const filteredData = filterData(data, baseHeader, secondHeader, selectedOperator, headerCondition, customInput)
        setFilteredData(filteredData)
    }
    return (
        <Modal
            {...props}
            size="lg"

            onHide={handleHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    SET RULES
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modal-body'>
                    <div className='controllers'>
                        <div className="controller">
                            <p>base header</p>
                            <Form.Select
                                onChange={handleBaseHeaderChange} >
                                {/* <option>{baseHeader ? baseHeader : 'Select the header'}</option> */}
                                <option>Select the header</option>

                                {headers.map((header, index) => {
                                    return <option value={header}>{header}</option>
                                })}
                            </Form.Select>
                        </div>
                        <div className="controller">
                            <p>Compare between</p>
                            <Form.Select
                                onChange={handleConditionChange} >
                                {/* <option aria-readonly>{headerCondition === "HEADER_TO_HEADER" ? "header to header" : headerCondition === "HEADER_TO_INPUT" ? 'header to input' : 'Select the header'}</option> */}
                                <option>Select the header</option>

                                <option value={'HEADER_TO_HEADER'}>header to header</option>
                                <option value={'HEADER_TO_INPUT'}>header to input</option>
                            </Form.Select>
                        </div>

                        <div className='controller'>
                            <p>Condition</p>

                            <Form.Select
                                aria-label="Comparison operator"
                                value={selectedOperator}
                                onChange={handleOperatorChange}
                            >
                                {checkboxes.map((checkbox) => (
                                    <option key={checkbox.name} value={checkbox.name}>
                                        {checkbox.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>

                        {headerCondition && headerCondition === 'HEADER_TO_HEADER' ? <div className="controller">
                            <p>base header</p>
                            <Form.Select
                                onChange={handleSecondHeaderChange} >
                                <option>Select the header</option>

                                {headers.map((header, index) => {
                                    return <option value={header}>{header}</option>
                                })}
                            </Form.Select>
                        </div> : <div className="controller">
                            <p>input</p>
                            {/* Step 4: Use the state variable to display the input value */}
                            <Form.Control
                                type="text"
                                placeholder="input text"
                                value={customInput} // Bind the input value to the state variable
                                onChange={handleCustomInputChange} // Attach the event handler
                            />
                        </div>}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleHide}>submit</Button>
            </Modal.Footer>
        </Modal >
    );
}

function ModalHeader() {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                set Rule
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                setModalShow={setModalShow}

            />
        </>
    );
}

export default ModalHeader