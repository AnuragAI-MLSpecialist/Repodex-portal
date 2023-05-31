import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { callLogin } from "../../Graphs/Auth/login";
import { notification } from "antd";
import * as moment from 'moment';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            fields : {
                username : "",
                password : ""
            },
            errors : {
                username : "",
                password : ""
            }
        };
    }

    loginSubmit = async () => {
        try{    
            const { fields, errors } = this.state;
            const { setUserToken, setUserData, setLoginFlag } = this.props;
            const listError = { ...errors };

            if(fields["username"] && fields["username"] === ""){
                listError["username"] = "Username is required";
                this.setState({
                    errors : listError
                });

                return;
            }else {
                listError["username"] = "";
                this.setState({
                    errors : listError
                });
            }

            if(fields["password"] && fields["password"] === ""){
                listError["password"] = "Password is required";
                this.setState({
                    errors : listError
                });

                return;
            }else {
                listError["password"] = "";
                this.setState({
                    errors : listError
                });
            }

            this.setState({
                isLoading : true
            });

            let loginData = await callLogin(fields["username"], fields["password"]);
            console.log("!!!!!!!!!!loginData", loginData);

            if(loginData.status === 500){
                throw loginData.message;
            }

            notification["success"]({
                message: 'Login',
                description:
                'Login Successfully',
            });

            await setUserToken(loginData.authToken);
            await setUserData(loginData.data);
            await setLoginFlag(true);


        }catch(e){
            console.log("Errror printed here", e);
            notification["error"]({
                message: 'Login',
                description: typeof[e] === "string" ? e : "Error",
            });
        } finally {
            this.setState({
                isLoading : false
            })
        }
    }

    //onchange of text input
    onChange = (text, name) => {
        const { fields } = this.state;
        let subFields = { ...fields };
        subFields[name] = text.target.value;
        this.setState({
            fields : subFields
        });
    }

    render() {
        const { errors, isLoading } = this.state;

        return (
            <div>
                {
                    isLoading
                    ?
                    <div>
                        Loader...........
                    </div>
                    :
                    null
                }
                <div className="page-wrapper">
                    <div className="container-fluid p-0">
                        {/* <!-- login page start--> */}
                        <div className="authentication-main">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="auth-innerright">
                                        <div className="authentication-box">
                                            <div className="text-center">
                                                {/* <img src={logo} alt="" /> */}
                                                <div style={{textAlign : "center", marginTop : "9px", fontSize : "25px", fontWeight : "bold", color: "#4466f2"}}>
                                                    CHATPRIX
                                                </div>
                                            </div>
                                            <div className="card mt-4">
                                                <div className="card-body">
                                                    <div className="text-center">
                                                        <h4>LOGIN</h4>
                                                        <h6>Enter your Username and Password </h6>
                                                    </div>
                                                    <form className="theme-form" action={() => this.loginAuth()}>
                                                        <div className="form-group">
                                                            <label className="col-form-label pt-0">Username</label>
                                                            <input className="form-control" type="text" required onChange={(text) => this.onChange(text, "username")} />
                                                            <label className="col-form-label pt-0" style={{color : "red"}}>{errors["email"]}</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-form-label">Password</label>
                                                            <input className="form-control" type="password" required onChange={(text) => this.onChange(text, "password")} />
                                                            <label className="col-form-label pt-0" style={{color : "red"}}>{errors["password"]}</label>
                                                        </div>
                                                        <div className="form-group form-row mt-3 mb-0">
                                                            <button className="btn btn-primary btn-block" type="button" onClick={() => this.loginSubmit()}>Login</button>
                                                        </div>
                                                        {/* <div className="login-divider"></div> */}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- login page end--> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loginFlag: state.auth.loginFlag
});
  
const mapDispatchToProps = (dispatch) => {
    return {
        setLoginFlag: (flag) => {
            dispatch({
                type: 'SET_LOGIN_FLAG',
                flag: flag
            });
        },
        setUserData: (userData) => {
            dispatch({
                type: 'SET_USER_DATA',
                userData: userData
            });
        },
        setUserToken: (authToken) => {
            dispatch({
                type: 'SET_USER_AUTHTOKEN',
                authToken: authToken
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));