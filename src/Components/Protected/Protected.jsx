import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Protected(props) {
    let Cmp =  props.Cmp
    const navigate = useNavigate();
    useEffect(() => {
      if (!localStorage.getItem('admin-user'))//user is not logged in so when user try to navigate using a get url typing it redirect it to the /Register url or Register page
      {
        navigate("/Login");
      }
    }, [])
  return (
      <div>
        <Cmp/>
      </div>
  );
}
export default Protected