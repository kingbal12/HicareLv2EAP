import React from 'react';
import { Fragment } from 'react';
import { connect } from "react-redux"
import { history } from "../../../history"

const DisplayName  = (props) => {
    return (
        <Fragment>
              {props.user.login.values != null 
                ?props.user.login.values.loggedInUser.f_name
                :history.push("/")}
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth
    }
}
  
export default connect(mapStateToProps)(DisplayName)