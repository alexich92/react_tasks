import React, {Component, Fragment} from 'react';
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";

export default class Users extends Component {
    state = {
        tasks: [],
        currentPage:1,
        tasksPerPage:10
    };

    async componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            return <Redirect to={'/login'}/>
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
        let tasks = await axios.get('http://api-tasks.test/v1/tasks');
        this.setState({tasks: tasks.data.data});
    }



    handleClick =(event) => {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }


    render() {
        if (!sessionStorage.getItem('token')) {
            return <Redirect to={'/login'}/>
        }

        const {tasks, currentPage, tasksPerPage} = this.state;


        const indexOfLastTaskOfPage = currentPage * tasksPerPage;
        const indexOfFirstTaskOfPage = indexOfLastTaskOfPage - tasksPerPage;
        const currentTasks = tasks.slice(indexOfFirstTaskOfPage, indexOfLastTaskOfPage);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(tasks.length / tasksPerPage); i++) {
            pageNumbers.push(i);
        }

        const DisplayPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });

        const tableData = currentTasks.map(function(task,key) {
            return <tr key={key}>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.assign}</td>
            </tr>
        });


        return (
            <Fragment>
                <h1>Task list</h1>
                <hr/>
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Assigned to</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData}
                    </tbody>
                </table>
                <ul id="page-numbers">
                    {DisplayPageNumbers}
                </ul>
                <p>Return <Link to={'/'}>Home</Link>.</p>
            </Fragment>
        )
    }
}
