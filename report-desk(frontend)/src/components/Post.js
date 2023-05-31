import React, { Component } from 'react';
import axios from 'axios';


class Post extends Component {
  constructor(props) {
    super(props);
    const { steps } = this.props;
    const { submit, firstname, lastname, email } = steps;

    this.state =  { submit, firstname, lastname, email }; 
  }


  componentDidMount() {
    const userObject = {
      submit:this.state.submit.value,
      first_name:this.state.firstname.value,
      last_name:this.state.lastname.value,
      email:this.state.email.value,
    };
    axios.post(`http://127.0.0.1:5000/saveCustomer`, userObject)
    .then(res => {
      console.log(res)
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>Thank you! Your data was submitted successfully! If you have any question then please procedd ahead</div>
      );
    }
  };


  export default Post;