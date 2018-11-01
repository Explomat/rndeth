export const commonConstants = {
	'APP_ERROR_MESSAGE': 'APP_ERROR_MESSAGE',
	'APP_INFO_MESSAGE': 'APP_INFO_MESSAGE'
}

export function error(err){
	return {
		type: commonConstants.APP_ERROR_MESSAGE,
		errorMessage: err
	};
}

export function info(inf){
	return {
		type: commonConstants.APP_INFO_MESSAGE,
		infoMessage: inf
	};
}