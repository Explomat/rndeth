import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { test, signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSignUpFormSubmit: (name) => {
			dispatch(signUpUser(name))
		},

		onTest: (number) => {
			dispatch(test(number))
		}
	}
}

const SignUpFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUpForm)

export default SignUpFormContainer
