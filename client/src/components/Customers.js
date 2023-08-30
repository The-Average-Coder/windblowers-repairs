import '../stylesheets/Customers.css';
import plusSymbol from '../images/plusIcon.png';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Customers(props) {
    const [customerList, setCustomerList] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [creatingNewCustomer, setCreatingNewCustomer] = useState(0);
    const [editingCustomer, setEditingCustomer] = useState(0);

    const [customerId, setCustomerId] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerFirstname, setCustomerFirstname] = useState('');
    const [customerTelephone, setCustomerTelephone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    const [newCustomerFromRepairs, setNewCustomerFromRepairs] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      loadCustomers();

      if (props.newCustomer === true) {
        createNewCustomer();
        setNewCustomerFromRepairs(true);
      }
    }, []);
    
    const loadCustomers = () => {
      Axios.get("/api/customers/get").then((response) => {
        setCustomerList(response.data);
      })
    }

    const createNewCustomer = () => {
      setEditingCustomer(0);
      setCreatingNewCustomer(1);
    }

    const submitNewCustomer = (e) => {
      e.preventDefault();
      setCreatingNewCustomer(0);

      Axios.post("/api/customers/newCustomer", {
        customerSurname: customerSurname,
        customerFirstname: customerFirstname,
        customerTelephone: customerTelephone,
        customerEmail: customerEmail,
        customerAddress: customerAddress
      }).then((response) => {
        setCustomerList([
          ...customerList,
          {
            id: response.data.id,
            surname: customerSurname,
            firstname: customerFirstname,
            telephone: customerTelephone,
            email: customerEmail,
            address: customerAddress
          }
        ]);

        if (newCustomerFromRepairs) {
          navigate(`/repairs/new/${response.data.id}`);
        }
      }).catch((error) => {
        console.log(error);
      });

      setCustomerId('');
      setCustomerSurname('');
      setCustomerFirstname('');
      setCustomerTelephone('');
      setCustomerEmail('');
      setCustomerAddress('');
    }

    const cancelNewCustomer = () => {
      setCreatingNewCustomer(0);
      setNewCustomerFromRepairs(false);

      setCustomerId('');
      setCustomerSurname('');
      setCustomerFirstname('');
      setCustomerTelephone('');
      setCustomerEmail('');
      setCustomerAddress('');
    }

    const editCustomer = (e, customer) => {
      e.stopPropagation();
      e.preventDefault();

      setEditingCustomer(1);

      setCustomerId(customer.id);
      setCustomerSurname(customer.surname);
      setCustomerFirstname(customer.firstname);
      setCustomerTelephone(customer.telephone);
      setCustomerEmail(customer.email);
      setCustomerAddress(customer.address);
    }

    const submitEditCustomer = (e) => {
      e.preventDefault();
      setEditingCustomer(0);

      Axios.put('/api/customers/update', {
        customerId: customerId,
        customerSurname: customerSurname,
        customerFirstname: customerFirstname,
        customerTelephone: customerTelephone,
        customerEmail: customerEmail,
        customerAddress: customerAddress
      })

      customerList.forEach((element, index) => {
        if (element.id === customerId) {
          customerList[index].surname = customerSurname
          customerList[index].firstname = customerFirstname
          customerList[index].telephone = customerTelephone
          customerList[index].email = customerEmail
          customerList[index].address = customerAddress
        }
      })

      setCustomerId('');
      setCustomerSurname('');
      setCustomerFirstname('');
      setCustomerTelephone('');
      setCustomerEmail('');
      setCustomerAddress('');
    }

    const cancelEditingCustomer = () => {
      setEditingCustomer(0);
      
      setCustomerId('');
      setCustomerSurname('');
      setCustomerFirstname('');
      setCustomerTelephone('');
      setCustomerEmail('');
      setCustomerAddress('');
    }

    const deleteCustomer = (e, id) => {
      e.stopPropagation();
      e.preventDefault();

      Axios.delete(`/api/customers/deleteCustomer/${id}`)

      setCustomerList(prev => prev.filter((el) => el.id !== id));
    }

    return (<div className='customers__page'>
        <div className='customers__mainPanel'>
          <div className='customers__customerListPanel' newCustomer={creatingNewCustomer} editingCustomer={editingCustomer}>
            <p className='repairsListTitle'>Customers</p>
            <p className='repairsListCount'>{customerList.length}</p>
            <div className='customers__customerList'>
              <button className='customers__newCustomerButton' onClick={createNewCustomer} disabled={editingCustomer}><img src={plusSymbol} /><p>Add New Customer</p></button>
              <input type='text' className='customers__customerSearchBar' value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder='Search...'/>
              { customerSearch.replace(/\s+/g, '') === '' ? <p className='customers__customerSearchInstruction'>Search To Show Customers</p> :
              customerList.filter(customer => `${customer.firstname.toLowerCase()} ${customer.surname.toLowerCase()} ${customer.telephone.toLowerCase()} ${customer.email.toLowerCase()} ${customer.address.toLowerCase()}`.includes(customerSearch.toLowerCase())).map((val) => {
                return [
                  <Link className='customers__customerElement' to={`/customer/${val.id}`}>
                    <p className='customers__customerElementTitle'>{val.firstname} <span>{val.surname}</span></p>
                    <p className='customers__customerElementTelephone'>{val.telephone}</p>
                    <p className='customers__customerElementEmail'>{val.email.length > 0 ? val.email : "<no email>"}</p>
                    <p className='customers__customerElementAddress'>{val.address.length > 0 ? val.address : "<no address>"}</p>

                    <button className='customers__editCustomerButton' onClick={(e) => {editCustomer(e, val)}} creatingNewCustomer={creatingNewCustomer} editingCustomer={editingCustomer}>Edit</button>
                    <button className='customers__deleteCustomerButton' onClick={(e) => {deleteCustomer(e, val.id)}} creatingNewCustomer={creatingNewCustomer} editingCustomer={editingCustomer}>Delete</button>
                  </Link>
                ];
              })}
            </div>
          </div>
          <div className='customers__newCustomerPanel' newCustomer={creatingNewCustomer}>
            <p className='customers__newCustomerPanelTitle'>New Customer</p>
            <form className='customers__newCustomerForm' onSubmit={submitNewCustomer}>
              <input type="text" placeholder='Surname' className='manufacturerInput' value={customerSurname} onChange={(e) => {setCustomerSurname(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Firstname' className='modelInput' value={customerFirstname} onChange={(e) => {setCustomerFirstname(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Phone Number' className='serialNumberInput' value={customerTelephone} onChange={(e) => {setCustomerTelephone(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Email (Optional)' className='serialNumberInput' value={customerEmail} onChange={(e) => {setCustomerEmail(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Address (Optional)' className='serialNumberInput' value={customerAddress} onChange={(e) => {setCustomerAddress(e.target.value)}} maximumScale={1} ></input><br />
              <div className='customers__newCustomerButtons'>
                <button className='customers__cancelNewCustomer' type='button' onClick={cancelNewCustomer}>Cancel</button>
                <button className='customers__submitNewCustomer' type='submit'>Submit</button>
              </div>
            </form>
          </div>
          <div className='customers__newCustomerPanel' newCustomer={editingCustomer}>
            <p className='customers__newCustomerPanelTitle'>Edit Customer</p>
            <form className='customers__newCustomerForm' onSubmit={submitEditCustomer}>
              <input type="text" placeholder='Surname' className='manufacturerInput' value={customerSurname} onChange={(e) => {setCustomerSurname(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Firstname' className='modelInput' value={customerFirstname} onChange={(e) => {setCustomerFirstname(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Phone Number' className='serialNumberInput' value={customerTelephone} onChange={(e) => {setCustomerTelephone(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Email (Optional)' className='serialNumberInput' value={customerEmail} onChange={(e) => {setCustomerEmail(e.target.value)}} maximumScale={1} ></input><br />
              <input type="text" placeholder='Address (Optional)' className='serialNumberInput' value={customerAddress} onChange={(e) => {setCustomerAddress(e.target.value)}} maximumScale={1} ></input><br />
              <div className='customers__newCustomerButtons'>
                <button className='customers__cancelNewCustomer' type='button' onClick={cancelEditingCustomer}>Cancel</button>
                <button className='customers__submitNewCustomer' type='submit'>Save</button>
              </div>
            </form>
          </div>
        </div>
    </div>);
}

export default Customers;