import { useParams, useNavigate } from 'react-router-dom';
import styles from './ticket-details.module.css';
import { useEffect, useState } from 'react';
import { Button, CardActions, Container } from '@mui/material';
import { User } from '@acme/shared-models';

/* eslint-disable-next-line */
export interface TicketDetailsProps {
  users: User[];
}

export function TicketDetails(props: TicketDetailsProps) {
  const [ticketDetails, setTicketDetails] = useState({
    assigneeId: 1,
    completed: false,
    description: 'Install a monitor arm',
    id: 1,
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTicketDetails() {
      const data = await fetch(`/api/tickets/${id}`).then();
      setTicketDetails(await data.json());
    }

    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ticketDetails ? (
    <Container className={styles['container']}>
      <h1>Ticket No : {ticketDetails.id}</h1>
      <p>Description : {ticketDetails.description}</p>
      <p>Status : {ticketDetails.completed ? 'Completed' : 'Not Completed'}</p>
      <p>
        Assigned to :{' '}
        {ticketDetails.assigneeId !== null
          ? props.users.filter(
              (item) => item.id === ticketDetails.assigneeId
            )[0].name
          : ''}
      </p>
      <button onClick={() => navigate(-1)}>back</button>
    </Container>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
}

export default TicketDetails;
