import React, { Component } from 'react';
import axios from 'axios';


class GetAnswer extends Component {
  constructor(props) {
    super(props);
    const { steps } = this.props;
    const { getquestion } = steps;

    this.state = { getquestion, answer: "" };

  }


  componentDidMount() {
    const userObject = {

      question: this.state.getquestion.value,
    };
    axios.post(`http://127.0.0.1:5000/getAnswer`, userObject)
      .then(res => {
        console.log(res)
        this.setState({
          answer: res
        });

      }).catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        {this.state.answer.length > 0 ? (<div>{this.state.answer}</div>) : (<div>Loading---</div>)}
      </div>


    );
  }
};


export default GetAnswer;