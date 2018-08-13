import React, {Component, Fragment} from 'react';
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";


export default class Users extends Component {
    state = {
        users: []
    };

    async componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            return <Redirect to={'/login'}/>
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
        let users = await axios.get('http://api-tasks.test/v1/admin/users');
        this.setState({users: users.data.data});
    }

    _logout = () => {
        sessionStorage.removeItem('token');

        this.props.history.push('/');
    };

    render() {
        if (!sessionStorage.getItem('token')) {
            return <Redirect to={'/login'}/>
        }

        const {users} = this.state;

        const tableData = users.map(function(user,key) {
            if(user.role_id ===1){
                user.role_id ='admin';
            }else{
                user.role_id ='normal user';
            }
            return <tr key={key}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role_id}</td>
            </tr>
        });

        return (
            <Fragment>
                <h1>Users list</h1>
                <hr/>
                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>

                <p>Return <Link to={'/'}>Home</Link>.</p>
                <button className='btn btn-primary' onClick={this._logout}>Logout</button>
            </Fragment>
        )
    }
}
