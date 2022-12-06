import React from "react"
import { InputGroup, InputGroupAddon, InputGroupText, Form, FormGroup, Input, Label, Button, CustomInput } from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth/registerActions"
import { history } from "../../../../history"

class RegisterJWT extends React.Component {
  state = {
    photo: "",
    password: "",
    name: "",
    confirmPass: ""
  }

  handleRegister = e => {
    e.preventDefault()
    this.props.signupWithJWT(
      this.state.email,
      this.state.password,
      this.state.name
    )
  }

  render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <InputGroup>
            <CustomInput type="file" id="exampleCustomFileBrowser" name="customFile" label="프로필 사진 등록" /> 
          </InputGroup>
        </FormGroup>
        <FormGroup className="form-label-group">
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>진료과</InputGroupText>
          </InputGroupAddon>
            <Input
              type="text"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="form-label-group">
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>진료가능분야</InputGroupText>
          </InputGroupAddon>
            <Input
              type="text"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="form-label-group">
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>약력</InputGroupText>
          </InputGroupAddon>
            <Input
              type="text"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="form-label-group">
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>자기소개</InputGroupText>
          </InputGroupAddon>
            <Input
              type="text"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="form-label-group">
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>면허번호</InputGroupText>
          </InputGroupAddon>
            <Input
              type="text"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </InputGroup>
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Login
          </Button.Ripple>
          {/* <Button.Ripple color="primary" type="submit">
            Register
          </Button.Ripple> */}
          <Button.Ripple 
            color="primary"
            onClick={() => {
              history.push("/shedule")
            }} >
            Register
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.register
  }
}
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT)
