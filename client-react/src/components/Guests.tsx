// import * as React from 'react';
// import { Route, Link, Redirect } from "react-router-dom";
// import { Get } from './Server';

// class Guest extends React.Component {
//     state = { editMode: false, singout: false };

//     async componentDidMount() {
//         try {
//             const id = this.props.guest;
//             const results = await Get(`guest/${id}`);
//             this.setState({ guest: results.data });
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 this.setState({ singout: true });
//             }
//         }
//     }

//     render() {
//         if (this.state.guest) {
//             const guest = this.state.guest;
//             if (this.state.singout) { return (<Redirect to='/logout' />); }
//             if (this.state.editMode) {
//                 const list = Object.keys(guest).map((k, i) => <input value={JSON.stringify(guest[k])} key={k} />);
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
//                         {guest.firstname}, {guest.lastname}, {guest.phoneNumber}

//                         <button className="App-button" onClick={e => { this.setState({ editMode: true }) }}>Edit</button>
//                     </div>
//                 );
//             }
//         }
//         return (<div />);
//     }
// }

// function GuestList(props) {
//     return (
//         <table className='Guests-list'>
//             <thead>
//                 <tr><th>ID</th><th>Name</th><th>Lastname</th></tr>
//             </thead>
//             <tbody>
//                 {props.children}
//             </tbody>
//         </table>
//     );
// }

// function GuestItem(props) {
//     const guest = props.guest;
//     return (
//         <tr className='Guest-list-item'>
//             <td>
//                 <Link to={`guests/${guest.id}`}>
//                     <div className='label'>
//                         {guest.id}
//                     </div>
//                 </Link>
//             </td>
//             <td>
//                 <div className=''>
//                     {guest.firstname}
//                 </div>
//             </td>
//             <td>
//                 <div className=''>
//                     {guest.lastname}
//                 </div>
//             </td>
//         </tr>
//     );
// }

// class Guests extends React.Component {
//     state = { searchquery: '', guests: [], singout: false };

//     componentDidMount() {
//         this.getGuests();
//     }

//     getGuests = async () => {
//         try {
//             const response = await Get(`guest`);
//             console.log(response);
//             this.setState({ guests: response.data });
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
//         const guests = this.state.guests.map(guest => <GuestItem key={guest.id} guest={guest} />);
//         return (
//             <div className='Guests'>
//                 <header className="Guests-header">Guests Management</header>
//                 <div className='Guests-content'>
//                     <Route path='/guests/' exact render={p => <GuestList {...p} >{guests}</GuestList>} />
//                     <Route path='/guests/:id' render={p => <Guest guest={p.match.params.id} {...p} />} />
//                 </div>
//             </div>
//         );
//     }
// }

// export default Guests;