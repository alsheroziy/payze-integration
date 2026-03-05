export interface IPayzePaymentData {
	amount: number
	currency: string
	callback: string
	callbackError: string
	info?: string
	lang?: string
	metadata?: Record<string, unknown>
}

export interface IPayzePaymentRequest {
	method: string
	apiKey: string
	apiSecret: string
	data: IPayzePaymentData
}

export interface IPayzePaymentResponseData {
	transactionId: string
	paymentUrl: string
}

export interface IPayzePaymentResponse {
	status: string
	code: number
	data: IPayzePaymentResponseData
}

export interface IPayzeTransactionDetailsRequest {
	method: string
	apiKey: string
	apiSecret: string
	data: {
		transactionId: string
	}
}

export interface IPayzeTransactionDetailsData {
	transactionId: string
	status: string
	amount: number
	currency: string
	info?: string
	metadata?: Record<string, unknown>
	createdAt?: string
	updatedAt?: string
}

export interface IPayzeTransactionDetailsResponse {
	status: string
	code: number
	data: IPayzeTransactionDetailsData
}
