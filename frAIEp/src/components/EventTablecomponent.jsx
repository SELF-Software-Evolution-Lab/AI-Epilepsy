import React, {useState, useEffect} from "react";
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
        <table class="styled-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event,i) => (
              <tr>
                <td>{i}</td>
                <td>{event.date_created}</td>
                <td>{event.type}</td>
                <td>{event.health_provider}</td>
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
