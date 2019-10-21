// import * as React from 'react';
// import { Route, Link, Redirect } from "react-router-dom";
// import { Get } from './Server';

// export interface ReservationProps { room: number }
// export interface ReservationState { reservation: number, editMode: boolean, singout: boolean }

// class Reservation extends React.Component<ReservationProps, ReservationState> {
//     //state = { editMode: false, singout: false, redirectTo: '' };

//     componentDidMount() {
//         this.fetchData();
//     }


//     fetchData() {
//         // try {
//         const id = this.props.reservation;
//         Get(`reservation/${id}`).then(results => {
//             this.setState({ reservation: results.data });
//         }).catch(error => {
//             if (error.response && error.response.status === 401) {
//                 this.setState({ singout: true });
//             }
//         });
//         // } catch (error) {

//         // }
//     }

//     deleteRes() {
//         const resID = this.state.reservation.resID;
//         const guestName = `${this.state.reservation.guestFirstname} ${this.state.reservation.guestLastname}`;
//         const confirmation = window.confirm(`Are you sure you want to delete reservation ${resID} for ${guestName}?`);
//         if (confirmation) {
//             console.log(`Wow, staph! ${resID}`);
//             //await Delete(`reservation/${resId}`);
//             //
//             this.props.history.push(`/reservations`);
//             //this.setState({redirectTo: '/reservations'});
//         }
//     }

//     render() {
//         if (this.state.reservation) {
//             const reservation = this.state.reservation;
//             if (this.state.singout) { return (<Redirect to='/logout' />); }
//             if (this.state.redirectTo) { return (<Redirect to={this.state.redirectTo} />); }
//             if (this.state.editMode) {
//                 const list = Object.keys(reservation).map((k, i) => <input value={JSON.stringify(reservation[k])} key={k} />);
//                 console.log(list);
//                 return (
//                     <div className="Guest-single">
//                         {list}
//                     </div>
//                 );
//             } else {
//                 //let index = 0;
//                 //const images = room.meta.images.map(v => <img key={v.id} src={v.imageLink} alt={`Zdjęcie ${index}`} />);
//                 return (
//                     <div className="Guest-single">
//                         {reservation.guestFirstname}, {reservation.guestLastname}, {reservation.guestPhoneNumber}

//                         <button className="App-button" onClick={e => { this.setState({ editMode: true }) }}>Edit</button>
//                         <button className="App-button" onClick={e => { this.deleteRes() }}>Delete</button>
//                     </div>
//                 );
//             }
//         }
//         return (<div />);
//     }
// }

// function ReservationList(props) {
//     return (
//         <table className='Guests-list'>
//             <thead>
//                 <tr><th>ID</th><th>Start</th><th>End</th><th>Room</th></tr>
//             </thead>
//             <tbody>
//                 {props.children}
//             </tbody>
//         </table>
//     );
// }

// function ReservationItem(props) {
//     const reservation = props.reservation;
//     return (
//         <tr className='Reservation-list-item'>
//             <td>
//                 <Link to={`reservation/${reservation.id}`}>
//                     <div className='label'>
//                         {reservation.id}
//                     </div>
//                 </Link>
//             </td>
//             <td>
//                 <div className=''>
//                     {reservation.start}
//                 </div>
//             </td>
//             <td>
//                 <div className=''>
//                     {reservation.end}
//                 </div>
//             </td>
//             <td>
//                 <Link to={`room/${reservation.room}`}>
//                     <div className='label'>
//                         {reservation.room}
//                     </div>
//                 </Link>
//             </td>
//         </tr>
//     );
// }

// class Reservations extends React.Component {
//     state = { searchquery: '', reservations: [], singout: false };

//     componentDidMount() {
//         this.getReservations();
//     }

//     getReservations = async () => {
//         try {
//             const response = await Get(`reservation`);
//             console.log(response);
//             this.setState({ reservations: response.data });
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 this.setState({ singout: true });
//             }
//         }
//     }

//     render() {
//         if (this.state.singout) {
//             return (<Redirect to='/logout' />);
//         }
//         const reservations = this.state.reservations.map(reservation => <ReservationItem key={reservation.id} reservation={reservation} />);
//         return (
//             <div className='Reservations'>
//                 <header className="Reservations-header">Reservations Management</header>
//                 <div className='Reservations-content'>
//                     <Route path='/reservations/' exact render={p => <ReservationList {...p} >{reservations}</ReservationList>} />
//                     <Route path='/reservation*/:id' render={p => <Reservation reservation={p.match.params.id} {...p} />} />
//                 </div>
//             </div>
//         );
//     }
// }

// export default Reservations;