import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import Post from './Post';
import GetAnswer from './getAnswer';

const config = {
    width: "400px",
    height: "500px",
    floating: true,
    
};
class SimpleForm extends Component {
    render() {
        return (
            // <ChatBot
            //     steps={[
            //         {
            //             id: 'q-firstname',
            //             message: 'What is your first name?',
            //             trigger: 'firstname',
            //         },

            //         {
            //             id: 'firstname',
            //             user: true,
            //             validator: (value) => {
            //                 if (/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(value)) {
            //                     return true;
            //                 }
            //                 else {
            //                     return 'Please input alphabet characters only.';
            //                 }
            //             },
            //             trigger: 'q-lastname'
            //         },
            //         {
            //             id: 'q-lastname',
            //             message: 'What is your last name?',
            //             trigger: 'lastname',
            //         },
            //         {
            //             id: 'lastname',
            //             user: true,
            //             validator: (value) => {
            //                 if (/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(value)) {
            //                     return true;
            //                 }
            //                 else {
            //                     return 'Please input alphabet characters only.';
            //                 }
            //             },
            //             trigger: 'q-email'
            //         },
            //         {
            //             id: 'q-email',
            //             message: 'Finally. what is your email?',
            //             trigger: 'email',
            //         },
            //         {
            //             id: 'email',
            //             user: true,
            //             validator: (value) => {
            //                 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            //                     return true;
            //                 }
            //                 else {
            //                     return 'Please enter a valid email.';
            //                 }
            //             },
            //             trigger: 'q-submit'
            //         },
            //         {
            //             id: 'q-submit',
            //             message: 'Do you wish to submit?',
            //             trigger: 'submit'
            //         },
            //         {
            //             id: 'submit',
            //             options: [
            //                 { value: 'y', label: 'Yes', trigger: 'end-message' },
            //                 { value: 'n', label: 'No', trigger: 'no-submit' },
            //             ]
            //         },
            //         {
            //             id: 'no-submit',
            //             message: 'Your information was not submitted.',
            //             //end: true,
            //         },
            //         {
            //             id: 'end-message',
            //             component: <Post />,
            //             asMessage: true,
            //             trigger: 'getquestion',
            //         },


            //         {
            //             id: 'client_question',
            //             message: ' ',
            //             trigger: 'getquestion',
            //             // end: true,
            //         },
            //         {
            //             id: 'getquestion',
            //             user: true,
            //             validator: (value) => {
            //                 if (/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(value)) {
            //                     return true;
            //                 }
            //                 else {
            //                     return 'Please input alphabet characters only.';
            //                 }
            //             },
            //             trigger: 'getanswer'
            //         },
            //         {
            //             id: 'getanswer',
            //             component: <GetAnswer />,
            //             asMessage: true,
            //             trigger: 'getquestion',
            //             //end: true,
            //         },

            //     ]}
            //     {...config}
            // />
''
        );
    }

}

export default SimpleForm;