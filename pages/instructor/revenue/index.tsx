import { InstructorLayout } from '@/layouts'
import { centsToUsd } from '@/lib/stripe'
import { axios } from '@/services/api/axios'
import { Button } from '@/ui'
import { handleFrontEndResponse } from '@/utils/apiresponses'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import Stripe from 'stripe'

const Revenue = () => {
    const updateStripeAccDetailMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(`/stripe/update-stripe-account-details`)
            return res.data.data.url
        },
        onSuccess: (url: string) => {
            console.log("url==>",url)
            window.location.href = url
        },
        onError: (error: any) => {
            alert(handleFrontEndResponse(error))
        }
    })
    const { data, isLoading, error } = useQuery<{
        data: {
            balance: Stripe.Response<Stripe.Balance>
        }
    }>(["get-stripe-balance"], async () => {
        const res = await axios.get(`instructor/revenue/get-balance`)
        return res.data
    })
    return (
        <InstructorLayout>
            <>
                {
                    isLoading && <div>loading...</div>
                }
                {
                    (!isLoading && !data && error) &&
                    <div>{handleFrontEndResponse(error)}</div>
                }
                {
                    data &&
                    <div>
                        <div className='flex items-center space-x-5 text-2xl font-bold'>
                            <h1>Pending:</h1>
                            <div className=''>{data.data.balance.pending.map((pb, index) => (
                                <h1 key={index}>{pb.currency}-{centsToUsd(pb.amount)}</h1>
                            ))}</div>
                        </div>
                        <div className='flex items-center space-x-5 text-2xl font-bold'>
                            <h1>Update Stripe Account Details:</h1>
                            <Button onClick={() => {
                                updateStripeAccDetailMutation.mutate()
                            }} text='Update' />
                        </div>
                    </div>
                }
            </>
        </InstructorLayout>
    )
}

export default Revenue