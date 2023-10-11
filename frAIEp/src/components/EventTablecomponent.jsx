import React, {useState, useEffect} from "react";
import moment from 'moment'
import axios from 'axios';
import { config } from "../config/env";

const EventTableComponent = ({ patient }) => {

  const [events, setEvents] = useState([])

  useEffect(() => {
    axios
      .get(`${config.bkAPEp}/events`, {params: {patient_id: patient.id}})
      .then((res) => {
        setEvents(res.data.events);
      });
  }, []); 

  const headers = [
    "No.",
    "Fecha",
    "Tipo de evento",    
    "Personal",
    "Accionables",
  ];
  
  return (
    <div>
      <div>
        <table className="styled-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event,i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{ moment.utc(event.created_at).format('hh:mm A - YY-MM-DD') }</td>
                <td>{event.type}</td>
                <td>{event.person}</td>
                <td>
                  <button className="event-detail-button">Ver detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTableComponent;
