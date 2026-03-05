import axios, { isAxiosError } from 'axios'

import { environments } from '@/config/environment.config'
import { ErrorCode } from '@/enums/error-ode.enum'
import BaseError from '@/errors/base.error'
import { StatusCode } from '@/enums/status-code.enum'
import {
	IPayzePaymentResponse,
	IPayzeTransactionDetailsResponse,
} from '@/interfaces/payze.interfaces'
import {
	IPayzeTransaction,
	PayzeTransactionStatus,
} from '@/interfaces/payze-transaction.interfaces'
import PayzeTransactionRepo from '@/repositories/payze-transaction.repo'
import { Types } from 'mongoose'

const PAYZE_BASE_URL = 'https://payze.io/api/v1'

class PayzeService {
	private transactionRepo = new PayzeTransactionRepo()

	public initiatePayment = async (
		orderId: Types.ObjectId | string,
		amount: number,
		currency: string = 'USD',
		info?: string
	): Promise<{ paymentUrl: string; transactionId: string }> => {
		const callbackBase = environments.APP_URL

		const payload = {
			method: 'justPay',
			apiKey: environments.PAYZE_API_KEY,
			apiSecret: environments.PAYZE_API_SECRET,
			data: {
				amount,
				currency,
				callback: `${callbackBase}/v1/orders/callback`,
				callbackError: `${callbackBase}/v1/orders/callback/error`,
				info: info || `Order ${orderId}`,
				lang: 'EN',
				metadata: { orderId: orderId.toString() },
			},
		}

		let response: IPayzePaymentResponse

		try {
			const { data } = await axios.post<IPayzePaymentResponse>(
				PAYZE_BASE_URL,
				payload
			)
			response = data
		} catch (err: unknown) {
			const message =
				isAxiosError(err) && err.response?.data
					? JSON.stringify(err.response.data)
					: String(err)
			throw new BaseError(
				ErrorCode.PaymentFailed,
				StatusCode.BadRequest,
				`Payze payment initiation failed: ${message}`
			)
		}

		if (response.status !== 'OK' || !response.data?.transactionId) {
			throw new BaseError(
				ErrorCode.PaymentFailed,
				StatusCode.BadRequest,
				`Payze returned error: ${JSON.stringify(response)}`
			)
		}

		await this.transactionRepo.create({
			transactionId: response.data.transactionId,
			orderId: new Types.ObjectId(orderId.toString()),
			amount,
			currency,
			status: PayzeTransactionStatus.Pending,
			paymentUrl: response.data.paymentUrl,
			metadata: { orderId: orderId.toString() },
		})

		return {
			transactionId: response.data.transactionId,
			paymentUrl: response.data.paymentUrl,
		}
	}

	public getTransactionDetails = async (
		transactionId: string
	): Promise<IPayzeTransactionDetailsResponse['data']> => {
		const payload = {
			method: 'getPaymentDetails',
			apiKey: environments.PAYZE_API_KEY,
			apiSecret: environments.PAYZE_API_SECRET,
			data: { transactionId },
		}

		let response: IPayzeTransactionDetailsResponse

		try {
			const { data } = await axios.post<IPayzeTransactionDetailsResponse>(
				PAYZE_BASE_URL,
				payload
			)
			response = data
		} catch (err: unknown) {
			const message =
				isAxiosError(err) && err.response?.data
					? JSON.stringify(err.response.data)
					: String(err)
			throw new BaseError(
				ErrorCode.PaymentFailed,
				StatusCode.BadRequest,
				`Payze get details failed: ${message}`
			)
		}

		return response.data
	}

	public confirmTransaction = async (
		transactionId: string
	): Promise<IPayzeTransaction | null> => {
		const details = await this.getTransactionDetails(transactionId)

		const payzeStatus = details?.status?.toUpperCase()
		const internalStatus =
			payzeStatus === 'COMMITTED'
				? PayzeTransactionStatus.Completed
				: payzeStatus === 'FAILED' || payzeStatus === 'REJECTED'
				? PayzeTransactionStatus.Failed
				: PayzeTransactionStatus.Pending

		return this.transactionRepo.updateStatus(
			transactionId,
			internalStatus,
			details as unknown as Record<string, unknown>
		)
	}

	public getLocalTransaction = async (
		transactionId: string
	): Promise<IPayzeTransaction | null> => {
		return this.transactionRepo.getByTransactionId(transactionId)
	}
}

export default PayzeService
