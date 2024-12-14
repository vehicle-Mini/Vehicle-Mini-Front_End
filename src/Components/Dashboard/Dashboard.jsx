import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Dashboard.css';
import Header from '../Header/Header';
import ConfirmDeleteModal from './ConfirmDeleteModel.jsx';
import { format } from 'date-fns';

const Dashboard = () => {
  const [Vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEE-MMM-dd'); // Fri-Dec-13
  };

  useEffect(() => {
    // Fetch Vehicles from the API when the component mounts
    fetchVehicle()
  }, []);

  const fetchVehicle = async () => {


    await axios.get('http://localhost:5000/api/vehicle/getallvehicles', { 
      headers: {
        "Content-Type": "application/json",
      },
      // withCredentials: true 
    })
      .then(response => {
        const data = response.data;
        setVehicles(data); 
        console.log(data);
      })

      .catch(error => {
        console.error(error.status)
        console.error("There was an error fetching the vehicles!", error);
      });
  }


  const handleDelete = async () => {
    if (!selectedVehicle) 
      return;
    const id = selectedVehicle._id;
    
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/vehicle/deletevehicle/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true 
      })
      fetchVehicle();
      setShowModal(false);
    }

    catch (error) {
      console.error("There was an error deleting the vehicle!", error);
    }
  };

  const openModal = (Vehicle) => {
    setSelectedVehicle(Vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setShowModal(false);
  };


  return (
    <>
      <Header />

        <>
          <div className="dashboard-container">
            <h1 className="text-center">All Vehicles</h1>
            <Table striped bordered hover className="dashboard-table">
              <thead>
                <tr className="">
                  <th>Vehicle Name</th>
                  <th>Model</th>
                  <th>Plate Number</th>
                  <th>Code</th>
                  <th>Regional Code</th>
                  <th>Status</th>
                  <th>Vehicle Image</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Vehicles.map((Vehicle, index) => (
                  <tr key={index}>
                    <td>{Vehicle.vehicleName}</td>
                    <td>{Vehicle.model}</td>
                    <td>{Vehicle.plateNumber}</td>
                    <td>{Vehicle.code}</td>
                    <td>{Vehicle.region_code}</td>
                    <td>{Vehicle.status}</td>
                    <td>
                      <img
                        src={
                          // Vehicle.profileImage
                          `http://localhost:5000/uploads/${Vehicle.vehicleImage}`
                        }
                        alt="Vehicle"
                        className="vehicle-image"
                      />
                    </td>
                    <td>{formatDate(Vehicle.updatedAt)}</td>
                    <td className="d-flex justify-content-around action-buttons">
                      <button
                        onClick={() => openModal(Vehicle)}
                        className="btn btn-danger btn-icon btn-sm mr-2">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <Link to={`/updatevehicle/${Vehicle._id}`} className="btn btn-success btn-icon btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {selectedVehicle && (
            <ConfirmDeleteModal
              show={showModal}
              handleClose={closeModal}
              handleDelete={handleDelete}
              VehicleName={`${selectedVehicle.vehicleName} ${selectedVehicle.plateNumber}`}
            />
          )}
        </>
    </>
  );
}

export default Dashboard;
