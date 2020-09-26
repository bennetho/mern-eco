import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;

  return (
    <div className='history-page'>
      <h2>History</h2>
      <h4>You have {history.length} ordered</h4>
      {/* <div> */}
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of Purchased</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`history/${items._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* </div> */}
    </div>
  );
};

export default OrderHistory;
