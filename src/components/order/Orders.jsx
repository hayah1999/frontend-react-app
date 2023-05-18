import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, getOrders, cancelPayment } from "../../features/order/orderSlice";
import { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Container } from "react-bootstrap";
import { Box, Button, Modal } from "@mui/material";
import { useNavigate } from "react-router";
import OrderItems from "./OrderItems";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Orders = () => {
    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [open, setOpen] = useState(null);
    const handleOpen = (orderId) => setOpen(orderId);
    const handleClose = (orderId) => setOpen(null);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userOrders, isLoading } = useSelector((store) => store.order);

    useEffect(() => {
        dispatch(getOrders());
    }, []);

    const format = (createdAt) => {
        return new Date(createdAt).toLocaleDateString('en-GB', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    }

    const checkout = (details) => {
        navigate('/continue-payment', { state: details })
    }
    return (
        <Container>
            {userOrders.map((order) => {
                return (
                    <Accordion key={order.id} expanded={expanded === `panel${order.id}`} onChange={handleChange(`panel${order.id}`)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${order.id}bh-content`}
                            id={`panel${order.id}bh-header`}>

                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Order@ {format(order.createdAt)}
                            </Typography>
                            {(order.status === 'PENDING' &&
                                <Typography style={{ color: 'blue' }}>Order Pending...</Typography>)
                                ||
                                (order.status === 'SHIPPING' &&
                                    <Typography style={{ color: 'rgb(149 144 0)' }}>
                                         <LocalShippingIcon style={{ color: 'rgb(149 144 0)' }}/>
                                          Shipping</Typography>)
                                ||
                                (order.status === 'DELIVERED' &&
                                    <Typography style={{ color: 'green' }}>Delivered!</Typography>)
                                    ||
                                    (order.status === 'CANCELED' &&
                                        <Typography style={{ color: 'red' }}>Canceled</Typography>)
                                        ||
                                        (order.status === 'REFUNDED' &&
                                            <Typography style={{ color: '#C7C7CC' }}>Refunded</Typography>)
                            }

                            {(order.payment && order.payment.status === 'requires_payment_method' || !order.payment) &&
                                <Button
                                    onClick={() => checkout({ order, orderItems: order.order_details })}
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: '#ece87d', color: '#2d2a32', marginLeft: 'auto' }}>
                                    Proceed to payment
                                </Button>}
                            {(order.payment && order.payment.status === 'succeeded' &&
                                <Typography style={{ marginLeft: 'auto', color: 'green' }}>Payment success</Typography>)
                                ||
                                (order.payment && order.payment.status === 'Refunded' &&
                                    <Typography style={{ marginLeft: 'auto', color:'#C7C7CC' }}>Payment refunded</Typography>)
                            }

                        </AccordionSummary>
                        <AccordionDetails>
                            {order.order_details.map((item) => {
                                return <OrderItems item={item} key={item.id} />
                            })}

                            <Typography variant="h6" component="p" sx={{ margin: '2rem' }}>SubTotal: {order.total_amount}$</Typography>
                                {(order.payment && order.payment.status === 'requires_payment_method' || order.status === 'SHIPPING' || order.status === 'PENDING' || !order.payment) &&
                                    <>
                                        <Button variant="outlined" color="error" style={{ display: 'flex', margin: '1rem auto' }} onClick={()=>handleOpen(order.id)}>Cancel Order</Button>
                                        {(order.status === 'SHIPPING' && order.payment.status === 'succeeded' &&
                                                <Modal
                                                open={open === order.id}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to cancel the order
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        You will be charged 15% of the total amount of your order if you canceled now   </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        You will recieve the refunding within 5 to 15 business days   </Typography>
                                                    <Button variant='outlined' color='error' style={{ margin: '1rem' }} onClick={() => { dispatch(cancelPayment(order.id)); handleClose(order.id)}}>Yes, delete</Button>
                                                    <Button variant='outlined' color='primary' style={{ margin: '1rem' }} onClick={()=>handleClose(order.id)}>No</Button>
                                                </Box>
                                            </Modal>)
                                            ||
                                            (order.status === 'PENDING' && order.payment.status === 'succeeded' &&
                                            <Modal
                                                open={open === order.id}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to cancel the order
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        Your order will be permanently deleted    </Typography>
                                                    <Button variant='outlined' color='error' style={{ margin: '1rem' }} onClick={() => { dispatch(cancelPayment(order.id)); handleClose(order.id)}}>Yes, delete</Button>
                                                    <Button variant='outlined' color='primary' style={{ margin: '1rem' }} onClick={()=>handleClose(order.id)}>No</Button>
                                                </Box>
                                            </Modal>
                                            )||
                                            <Modal
                                                open={open === order.id}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to cancel the order
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        Your order will be permanently deleted    </Typography>
                                                    <Button variant='outlined' color='error' style={{ margin: '1rem' }} onClick={() => { dispatch(deleteOrder(order.id)); handleClose(order.id)}}>Yes, delete</Button>
                                                    <Button variant='outlined' color='primary' style={{ margin: '1rem' }} onClick={()=>handleClose(order.id)}>No</Button>
                                                </Box>
                                            </Modal>
                                        }  
                                    </>
                                }
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Container>

    )
}
export default Orders