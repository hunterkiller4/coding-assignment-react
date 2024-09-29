// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Ticket, User } from '@acme/shared-models';
import styles from './tickets.module.css';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
}

export function Tickets(props: TicketsProps) {
  const [selectedValue, setSelectedValue] = useState('All');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.tickets.length > 0) {
      if (selectedValue === 'Completed') {
        props.tickets = props.tickets.filter(
          (ticket) => ticket.completed === true
        );
      } else if (selectedValue === 'Incompleted') {
        props.tickets = props.tickets.filter(
          (ticket) => ticket.completed === false
        );
      }
    }
    console.log(selectedValue, props.tickets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, props.tickets]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Container className={styles['tickets']}>
      <h2 className={styles['header']}>Tickets</h2>

      <Button variant="outlined" onClick={handleClickOpen}>
        Add new Ticket
      </Button>

      <Radio
        checked={selectedValue === 'All'}
        onChange={handleChange}
        value="All"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'All' }}
      />
      <span>All</span>

      <Radio
        checked={selectedValue === 'Incompleted'}
        onChange={handleChange}
        value="Incompleted"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'Incompleted' }}
      />
      <span>Incompleted</span>

      <Radio
        checked={selectedValue === 'Completed'}
        onChange={handleChange}
        value="Completed"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'Completed' }}
      />
      <span>Completed</span>

      {props.tickets ? (
        <>
          {props.tickets.map((t) => (
            <Card key={t.id}>
              <CardContent>
                <p>Ticket No : {t.id}</p>
                <p>Description : {t.description}</p>
                <p>Status : {t.completed ? 'Completed' : 'Not Completed'}</p>
                <p>
                  Assigned to :{' '}
                  {t.assigneeId !== null
                    ? props.users.filter((item) => item.id === t.assigneeId)[0]
                        .name
                    : ''}
                </p>
              </CardContent>
              <CardActions>
                <Button onClick={navigate(`/${t.id}`)}>View details</Button>
              </CardActions>
            </Card>
          ))}
        </>
      ) : (
        <span>...</span>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            await fetch('/api/tickets', {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify(formJson),
            }).then();
            handleClose();
          },
        }}
      >
        <DialogTitle>Add new ticket</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="description"
            label="Ticket Description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Tickets;
