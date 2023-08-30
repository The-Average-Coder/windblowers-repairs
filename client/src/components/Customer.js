import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Axios from 'axios';

function Customer() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({});
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerFirstname, setCustomerFirstname] = useState('');
    const [customerTelephone, setCustomerTelephone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [invalidCustomer, setInvalidCustomer] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(false);

    useEffect(() => {
        loadCustomer();
    }, []);

    const loadCustomer = (id) => {
        Axios.get(`/api/customers/getCustomer/${customerId}`).then((response) => { 
            if (response.data.length === 0) {
                setInvalidCustomer(true);
            }
            else {
                setCustomer(response.data[0]);
                setCustomerSurname(response.data[0].surname);
                setCustomerFirstname(response.data[0].firstname);
                setCustomerTelephone(response.data[0].telephone);
                setCustomerEmail(response.data[0].email);
                setCustomerAddress(response.data[0].address);
            }
        })
    }

    const toggleEditingCustomer = () => {
        if (editingCustomer) {
            setCustomerSurname(customer.surname);
            setCustomerFirstname(customer.firstname);
            setCustomerTelephone(customer.telephone);
            setCustomerEmail(customer.email);
            setCustomerAddress(customer.address);
        }
        setEditingCustomer(!editingCustomer);
    }

    const submitCustomerEdit = () => {
        Axios.put('/api/customers/update', {
            customerId: customerId,
            customerSurname: customerSurname,
            customerFirstname: customerFirstname,
            customerTelephone: customerTelephone,
            customerEmail: customerEmail,
            customerAddress: customerAddress
        }).then((response) => {
            loadCustomer();
        });
        setEditingCustomer(false);
    }

    return <div className="customers__page">
        <div className='customers__mainPanel'>
            <div style={{flex: 1}}>
                {invalidCustomer ? <p>Invalid Customer</p> : <>
                    <button className='normalButton' style={{float: 'right', marginTop: '30px', marginRight: '30px'}} type='button' onClick={toggleEditingCustomer}>{editingCustomer ? 'Cancel Edit' : 'Edit Details'}</button>
                    <button className='submitButton' style={{float: 'right', marginTop: '30px', marginRight: '10px', display: editingCustomer ? 'block' : 'none'}} type='button' onClick={submitCustomerEdit}>Save</button>
                    {editingCustomer ? <>
                        <p className='repairsListTitle'>Editing...</p>
                        <div style={{marginTop: '100px', marginLeft: '30px', lineHeight: '44px'}}>
                            <label>Surname: </label>
                            <input style={{marginLeft: '10px'}} type="text" className='repair_assessmentCostForTime' value={customerSurname} onChange={(e) => {setCustomerSurname(e.target.value)}} /><br />
                            <label>Firstname: </label>
                            <input style={{marginLeft: '10px'}} type="text" className='repair_assessmentCostForTime' value={customerFirstname} onChange={(e) => {setCustomerFirstname(e.target.value)}} /><br />
                            <label>Telephone: </label>
                            <input style={{marginLeft: '10px'}} type="text" className='repair_assessmentCostForTime' value={customerTelephone} onChange={(e) => {setCustomerTelephone(e.target.value)}} /><br />
                            <label>Email: </label>
                            <input style={{marginLeft: '10px'}} type="text" className='repair_assessmentCostForTime' value={customerEmail} onChange={(e) => {setCustomerEmail(e.target.value)}} /><br />
                            <label>Address: </label>
                            <input style={{marginLeft: '10px'}} type="text" className='repair_assessmentCostForTime' value={customerAddress} onChange={(e) => {setCustomerAddress(e.target.value)}} /><br />
                        </div>
                    </> : <>
                        <p className='repairsListTitle'>{customerFirstname} {customerSurname}</p>
                        <p style={{marginTop: '90px', marginLeft: '30px', fontSize: '18px'}}>Telephone: {customerTelephone}</p>
                        <p style={{marginLeft: '30px', fontSize: '18px'}}>Email: {customerEmail === '' ? '<no email>' : customerEmail}</p>
                        <p style={{marginLeft: '30px', fontSize: '18px'}}>Address: {customerAddress === '' ? '<no address>' : customerAddress}</p>
                    </>}
                </>}
            </div>
        </div>
    </div>
}

export default Customer;